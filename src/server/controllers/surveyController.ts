import BlaiseClient from 'blaise-api-node-client';
import express, { Request, Response } from 'express';
import { Controller } from '../interfaces/controllerInterface';
import { Configuration } from '../interfaces/configurationInterface';
import notFound from '../../common/helpers/axiosHelper';
import { Survey } from '../../common/interfaces/surveyInterface';
import mapSurveys from '../mappers/surveyMapper';

export default class SurveyController implements Controller {
  config: Configuration;

  blaiseApiClient: BlaiseClient;

  constructor(config: Configuration, blaiseApiClient: BlaiseClient) {
    this.config = config;
    this.blaiseApiClient = blaiseApiClient;
    this.getSurveys = this.getSurveys.bind(this);
  }

  getRoutes() {
    const router = express.Router();
    return router.get('/api/surveys', this.getSurveys);
  }

  async getSurveys(_request: Request, response: Response<Survey[]>) {
    try {
      const questionnaires = await this.blaiseApiClient.getQuestionnaires(this.config.ServerPark);
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
