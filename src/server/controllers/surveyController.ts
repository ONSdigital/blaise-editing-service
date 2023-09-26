import express, { Request, Response } from 'express';
import { Controller } from '../interfaces/controllerInterface';
import notFound from '../../common/helpers/axiosHelper';
import { Survey } from '../../common/interfaces/surveyInterface';
import mapSurveys from '../mappers/surveyMapper';
import BlaiseApi from '../api/BlaiseApi';

export default class SurveyController implements Controller {
  blaiseApi: BlaiseApi;

  constructor(blaiseApi: BlaiseApi) {
    this.blaiseApi = blaiseApi;
    this.getSurveys = this.getSurveys.bind(this);
  }

  getRoutes() {
    const router = express.Router();
    return router.get('/api/surveys', this.getSurveys);
  }

  async getSurveys(_request: Request, response: Response<Survey[]>) {
    try {
      const questionnaires = await this.blaiseApi.getQuestionnaires();
      const surveys = mapSurveys(questionnaires);

      return response.status(200).json(surveys);
    } catch (error: unknown) {
      if (notFound(error)) {
        return response.status(404).json();
      }
      return response.status(500).json();
    }
  }
}
