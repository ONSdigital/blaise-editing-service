import express, { Request, Response } from 'express';
import { Auth } from 'blaise-login-react/blaise-login-react-server';
import { User } from 'blaise-api-node-client';
import { Controller } from '../interfaces/controllerInterface';
import notFound from '../helpers/axiosHelper';
import AuditLogger from "../logger/auditLogger";
import { QuestionnaireDetails, Survey } from '../../common/interfaces/surveyInterface';
import mapSurveys from '../mappers/surveyMapper';
import BlaiseApi from '../api/BlaiseApi';
import ServerConfigurationProvider from '../configuration/ServerConfigurationProvider';

export default class SurveyController implements Controller {
  blaiseApi: BlaiseApi;
  configuration: ServerConfigurationProvider;
  auth: Auth;
  auditLogger: AuditLogger;

  constructor(blaiseApi: BlaiseApi, configuration: ServerConfigurationProvider, auth: Auth, auditLogger: AuditLogger) {
    this.blaiseApi = blaiseApi;
    this.configuration = configuration;
    this.getSurveys = this.getSurveys.bind(this);
    this.auth = auth;
    this.auditLogger = auditLogger;
  }

  getRoutes() {
    const router = express.Router();
    return router.get('/api/surveys', this.auth.Middleware, this.getSurveys);
  }

  async getSurveys(request: Request<Record<string, never>, Record<string, never>, Record<string, never>, { userRole: string }>, response: Response<Survey[]>) {
    const { userRole } = request.query;
    const user = this.auth.GetUser(this.auth.GetToken(request));

    try {
      const questionnaires = await this.GetQuestionnairesForRole(userRole, user, request);
      const surveys = mapSurveys(questionnaires ?? []);
      return response.status(200).json(surveys);
    } catch (error: unknown) {
      if (notFound(error)) {
        this.auditLogger.error(request.log, `Failed to get questionnaires, current user: {name: ${user.name}, role: ${user.role}} with 404 ${error}`);
        return response.status(404).json();
      }
      this.auditLogger.error(request.log, `Failed to get questionnaires, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`);
      return response.status(500).json();
    }
  }

  async GetQuestionnairesForRole(userRole: string, user: User, request: Request<Record<string, never>>): Promise<QuestionnaireDetails[]> {
    const surveys = this.configuration.getSurveysForRole(userRole);
    const questionnaires = await this.blaiseApi.getQuestionnaires();
    this.auditLogger.info(request.log, `Retrieved ${questionnaires.length} questionnaire(s), current user: {name: ${user.name}, role: ${user.role}}`);

    if (userRole === 'Survey Support') {
      const questionnairesList = questionnaires
        .filter((q) => surveys.includes(q.surveyTla))
        .filter((q) => !q.questionnaireName.endsWith('_EDIT'));
      this.auditLogger.info(request.log, `Filtered down to ${questionnairesList.length} questionnaire(s), current user: {name: ${user.name}, role: ${user.role}}`);
      return questionnairesList;
    }

    const questionnairesList = questionnaires
      .filter((q) => surveys.includes(q.surveyTla))
      .filter((q) => q.questionnaireName.endsWith('_EDIT'));
    this.auditLogger.info(request.log, `Filtered down to ${questionnairesList.length} questionnaire(s), current user: {name: ${user.name}, role: ${user.role}}`);
    return questionnairesList;
  }
}
