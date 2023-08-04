import BlaiseClient, { Questionnaire } from 'blaise-api-node-client';
import express, { Request, Response } from 'express';
import { ControllerInterface } from '../interfaces/controller.interface';
import { Configuration } from '../interfaces/configuration.interface';
import notFound from '../../common/axios.helper';

export default class QuestionnaireController implements ControllerInterface {
  config: Configuration;

  blaiseApiClient: BlaiseClient;

  constructor(config: Configuration, blaiseApiClient: BlaiseClient) {
    this.config = config;
    this.blaiseApiClient = blaiseApiClient;
    this.getQuestionnaires = this.getQuestionnaires.bind(this);
  }

  getRoutes() {
    const router = express.Router();
    return router.get('/api/questionnaires', this.getQuestionnaires);
  }

  async getQuestionnaires(_request: Request, response: Response<Questionnaire[]>) {
    try {
      const questionnaires = await this.blaiseApiClient.getQuestionnaires(this.config.ServerPark);
      return response.status(200).json(questionnaires);
    } catch (error: unknown) {
      if (notFound(error)) {
        return response.status(404).json();
      }
      return response.status(500).json();
    }
  }
}
