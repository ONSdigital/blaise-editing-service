import express, { Request, Response } from 'express';
import { CaseEditInformation, User } from 'blaise-api-node-client';
import { Auth } from 'blaise-login-react-server';
import moment from 'moment';
import { Controller } from '../interfaces/controllerInterface';
import notFound from '../helpers/axiosHelper';
import BlaiseApi from '../api/BlaiseApi';
import ServerConfigurationProvider from '../configuration/ServerConfigurationProvider';
import { CaseSummaryDetails } from '../../common/interfaces/caseInterface';
import mapCaseSummary from '../mappers/caseMapper';

export default class CaseController implements Controller {
  blaiseApi: BlaiseApi;

  configuration: ServerConfigurationProvider;

  auth: Auth;

  constructor(blaiseApi: BlaiseApi, configuration: ServerConfigurationProvider, auth: Auth) {
    this.blaiseApi = blaiseApi;
    this.configuration = configuration;
    this.getCaseEditInformation = this.getCaseEditInformation.bind(this);
    this.getCaseSummary = this.getCaseSummary.bind(this);
    this.allocateCases = this.allocateCases.bind(this);
    this.setCaseToUpdate = this.setCaseToUpdate.bind(this);
    this.auth = auth;
  }

  getRoutes() {
    const router = express.Router();
    router.get('/api/questionnaires/:questionnaireName/cases/:caseId/summary', this.auth.Middleware, this.getCaseSummary);
    router.get('/api/questionnaires/:questionnaireName/cases/edit', this.auth.Middleware, this.getCaseEditInformation);
    router.patch('/api/questionnaires/:questionnaireName/cases/allocate', this.auth.Middleware, this.allocateCases);
    router.patch('/api/questionnaires/:questionnaireName/cases/:caseId/update', this.auth.Middleware, this.setCaseToUpdate);

    return router;
  }

  async getCaseSummary(request: Request<{ questionnaireName: string, caseId: string }>, response: Response<CaseSummaryDetails>) {
    const {
      questionnaireName,
      caseId,
    } = request.params;

    const user = this.auth.GetUser(this.auth.GetToken(request));

    try {
      const caseResponse = await this.blaiseApi.getCase(questionnaireName, caseId);
      const caseSummary = mapCaseSummary(caseResponse);

      this.blaiseApi.cloudLogger.info(`Retrieved case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`);
      return response.status(200).json(caseSummary);
    } catch (error: unknown) {
      if (notFound(error)) {
        this.blaiseApi.cloudLogger.error(`Failed to get case details, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 404 ${error}`);
        return response.status(404).json();
      }
      this.blaiseApi.cloudLogger.error(`Failed to get case details, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`);
      return response.status(500).json();
    }
  }

  async getCaseEditInformation(request: Request<{ questionnaireName: string }, {}, {}, { userRole: string }>, response: Response<CaseEditInformation[]>) {
    const { questionnaireName } = request.params;
    const { userRole } = request.query;

    const user = this.auth.GetUser(this.auth.GetToken(request));

    try {
      const caseEditInformationList = await this.GetCaseEditInformationForRole(questionnaireName, userRole, user);

      return response.status(200).json(caseEditInformationList);
    } catch (error: unknown) {
      if (notFound(error)) {
        this.blaiseApi.cloudLogger.error(`Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 404 ${error}`);
        return response.status(404).json();
      }
      this.blaiseApi.cloudLogger.error(`Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`);
      return response.status(500).json();
    }
  }

  async GetCaseEditInformationForRole(questionnaireName: string, userRole: string, user: User): Promise<CaseEditInformation[]> {
    const cases = await this.blaiseApi.getCaseEditInformation(questionnaireName);
    this.blaiseApi.cloudLogger.info(`Retrieved ${cases.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`);

    const surveyTla = questionnaireName.substring(0, 3);
    const roleConfig = this.configuration.getSurveyConfigForRole(surveyTla, userRole);

    const filteredcases = cases
      .filter((caseEditInformation) => (roleConfig.Organisations.length > 0 ? roleConfig.Organisations.includes(caseEditInformation.organisation) : caseEditInformation))
      .filter((caseEditInformation) => (roleConfig.Outcomes.length > 0 ? roleConfig.Outcomes.includes(caseEditInformation.outcome) : caseEditInformation));

    this.blaiseApi.cloudLogger.info(`Filtered down to ${filteredcases.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`);

    return filteredcases;
  }

  async allocateCases(request: Request<{ questionnaireName: string }, {}, { name: string, cases: string[] }, {}>, response: Response) {
    const { questionnaireName } = request.params;
    const { name, cases } = request.body;

    const user = this.auth.GetUser(this.auth.GetToken(request));

    try {
      await Promise.all(
        cases.map(async (caseId) => {
          await this.blaiseApi.updateCase(questionnaireName, caseId, {
            'QEdit.AssignedTo': name,
            'QEdit.Edited': 1,
          });
        }),
      );
      this.blaiseApi.cloudLogger.info(`Allocated ${cases.length} cases to editor: ${name}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`);
      return response.status(204).json();
    } catch (error: unknown) {
      if (notFound(error)) {
        this.blaiseApi.cloudLogger.error(`Failed to allocate cases to editor: ${name}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 404 ${error}`);
        return response.status(404).json();
      }
      this.blaiseApi.cloudLogger.error(`Failed to allocate cases to editor: ${name}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`);
      return response.status(500).json();
    }
  }

  async setCaseToUpdate(request: Request<{ questionnaireName: string, caseId: string }, {}, {}, {}>, response: Response) {
    const {
      questionnaireName,
      caseId,
    } = request.params;
    const user = this.auth.GetUser(this.auth.GetToken(request));

    try {
      await this.blaiseApi.updateCase(`${questionnaireName}_EDIT`, caseId, {
        'QEdit.AssignedTo': '',
        'QEdit.Edited': '',
        'QEdit.LastUpdated': moment('1900-01-01').format('DD-MM-YYYY_HH:mm'),
      });
      this.blaiseApi.cloudLogger.info(`Set to update edit dataset overnight, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`);
      return response.status(204).json();
    } catch (error: unknown) {
      if (notFound(error)) {
        this.blaiseApi.cloudLogger.error(`Failed to set to update edit dataset overnight, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 404 ${error}`);
        return response.status(404).json();
      }
      this.blaiseApi.cloudLogger.error(`Failed to set to update edit dataset overnight, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`);
      return response.status(500).json();
    }
  }
}
