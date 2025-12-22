import express, { Request, Response } from 'express';
import { Auth } from 'blaise-login-react/blaise-login-react-server';
import { User } from 'blaise-api-node-client';
import { Controller } from '../interfaces/controllerInterface';
import notFound from '../helpers/axiosHelper';
import { QuestionnaireDetails, Survey } from '../../common/interfaces/surveyInterface';
import mapSurveys from '../mappers/surveyMapper';
import BlaiseApi from '../api/BlaiseApi';
import ServerConfigurationProvider from '../configuration/ServerConfigurationProvider';

export default class SurveyController implements Controller {
  blaiseApi: BlaiseApi;

  configuration: ServerConfigurationProvider;

  auth: Auth;

  constructor(blaiseApi: BlaiseApi, configuration: ServerConfigurationProvider, auth: Auth) {
    this.blaiseApi = blaiseApi;
    this.configuration = configuration;
    this.getSurveys = this.getSurveys.bind(this);
    this.auth = auth;
  }

  getRoutes() {
    const router = express.Router();
    return router.get('/api/surveys', this.auth.Middleware, this.getSurveys);
  }

  async getSurveys(request: Request<Record<string, never>, Record<string, never>, Record<string, never>, { userRole: string }>, response: Response<Survey[]>) {
    const { userRole } = request.query;
    const user = this.auth.GetUser(this.auth.GetToken(request));

    try {
      const questionnaires = await this.GetQuestionnairesForRole(userRole, user);
      const surveys = mapSurveys(questionnaires ?? []);
      return response.status(200).json(surveys);
    } catch (error: unknown) {
      if (notFound(error)) {
        this.blaiseApi.cloudLogger.error(`Failed to get questionnaires, current user: {name: ${user.name}, role: ${user.role}} with 404 ${error}`);
        return response.status(404).json();
      }
      this.blaiseApi.cloudLogger.error(`Failed to get questionnaires, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`);
      return response.status(500).json();
    }
  }

  async GetQuestionnairesForRole(userRole: string, user: User): Promise<QuestionnaireDetails[]> {
    const surveys = this.configuration.getSurveysForRole(userRole);
    const questionnaires = await this.blaiseApi.getQuestionnaires();
    this.blaiseApi.cloudLogger.info(`Retrieved ${questionnaires.length} questionnaire(s), current user: {name: ${user.name}, role: ${user.role}}`);

    if (userRole === 'Survey Support') {
      const questionnairesList = questionnaires
        .filter((q) => surveys.includes(q.surveyTla))
        .filter((q) => !q.questionnaireName.endsWith('_EDIT'));
      this.blaiseApi.cloudLogger.info(`Filtered down to ${questionnairesList.length} questionnaire(s), current user: {name: ${user.name}, role: ${user.role}}`);
      return questionnairesList;
    }

    const questionnairesList = questionnaires
      .filter((q) => surveys.includes(q.surveyTla))
      .filter((q) => q.questionnaireName.endsWith('_EDIT'));
    this.blaiseApi.cloudLogger.info(`Filtered down to ${questionnairesList.length} questionnaire(s), current user: {name: ${user.name}, role: ${user.role}}`);
    return questionnairesList;
  }
}
