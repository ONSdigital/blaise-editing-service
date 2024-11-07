import express, { Request, Response } from 'express';
import { CaseEditInformation } from 'blaise-api-node-client';
import { Auth } from 'blaise-login-react-server';
import { Controller } from '../interfaces/controllerInterface';
import notFound from '../helpers/axiosHelper';
import BlaiseApi from '../api/BlaiseApi';
import ServerConfigurationProvider from '../configuration/ServerConfigurationProvider';
import { CaseSummaryDetails } from '../../common/interfaces/caseInterface';
import mapCaseSummary from '../mappers/caseMapper';

export default class CaseController implements Controller {
  blaiseApi: BlaiseApi;

  configuration: ServerConfigurationProvider;

  constructor(blaiseApi: BlaiseApi, configuration: ServerConfigurationProvider) {
    this.blaiseApi = blaiseApi;
    this.configuration = configuration;
    this.getCaseEditInformation = this.getCaseEditInformation.bind(this);
    this.getCaseSummary = this.getCaseSummary.bind(this);
  }

  getRoutes() {
    const auth = new Auth(this.configuration);
    const router = express.Router();
    router.get('/api/questionnaires/:questionnaireName/cases/:caseId/summary', auth.Middleware, this.getCaseSummary);
    router.get('/api/questionnaires/:questionnaireName/cases/edit', auth.Middleware, this.getCaseEditInformation);

    return router;
  }

  async getCaseSummary(request: Request<{ questionnaireName:string, caseId:string }>, response: Response<CaseSummaryDetails>) {
    const {
      questionnaireName,
      caseId,
    } = request.params;

    try {
      const caseResponse = await this.blaiseApi.getCase(questionnaireName, caseId);
      const caseSummary = mapCaseSummary(caseResponse);

      return response.status(200).json(caseSummary);
    } catch (error: unknown) {
      if (notFound(error)) {
        return response.status(404).json();
      }
      return response.status(500).json();
    }
  }

  async getCaseEditInformation(request: Request<{ questionnaireName:string }, {}, {}, { }>, response: Response<CaseEditInformation[]>) {
    const { questionnaireName } = request.params;

    try {
      const caseEditInformationList = await this.GetCaseEditInformationForRole(questionnaireName);

      return response.status(200).json(caseEditInformationList);
    } catch (error: unknown) {
      if (notFound(error)) {
        return response.status(404).json();
      }
      return response.status(500).json();
    }
  }

  async GetCaseEditInformationForRole(questionnaireName:string): Promise<CaseEditInformation[]> {
    return this.blaiseApi.getCaseEditInformation(questionnaireName);
  }
}
