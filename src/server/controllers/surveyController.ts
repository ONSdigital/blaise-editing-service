import express, { Request, Response } from 'express';
import { Auth } from 'blaise-login-react-server';
import { Controller } from '../interfaces/controllerInterface';
import notFound from '../helpers/axiosHelper';
import { QuestionnaireDetails, Survey } from '../../common/interfaces/surveyInterface';
import mapSurveys from '../mappers/surveyMapper';
import BlaiseApi from '../api/BlaiseApi';
import ServerConfigurationProvider from '../configuration/ServerConfigurationProvider';

export default class SurveyController implements Controller {
  blaiseApi: BlaiseApi;

  configuration: ServerConfigurationProvider;

  constructor(blaiseApi: BlaiseApi, configuration: ServerConfigurationProvider) {
    this.blaiseApi = blaiseApi;
    this.configuration = configuration;
    this.getSurveys = this.getSurveys.bind(this);
  }

  getRoutes() {
    const auth = new Auth(this.configuration);
    const router = express.Router();
    return router.get('/api/surveys', auth.Middleware, this.getSurveys);
  }

  async getSurveys(request: Request<{}, {}, {}, { userRole:string }>, response: Response<Survey[]>) {
    const { userRole } = request.query;

    try {
      const questionnaires = await this.GetQuestionnairesForRole(userRole);
      const surveys = mapSurveys(questionnaires ?? []);
      request.log.info(`Retrieved ${surveys.length} surveys for role ${userRole}`);
      return response.status(200).json(surveys);
    } catch (error: unknown) {
      if (notFound(error)) {
        return response.status(404).json();
      }
      return response.status(500).json();
    }
  }

  async GetQuestionnairesForRole(userRole: string): Promise<QuestionnaireDetails[]> {
    const surveys = this.configuration.getSurveysForRole(userRole);
    const questionnaires = await this.blaiseApi.getQuestionnaires();

    if (userRole === 'Survey Support') {
      return questionnaires
        .filter((q) => surveys.includes(q.surveyTla))
        .filter((q) => !q.questionnaireName.endsWith('_EDIT'));
    }

    return questionnaires
      .filter((q) => surveys.includes(q.surveyTla))
      .filter((q) => q.questionnaireName.endsWith('_EDIT'));
  }
}
