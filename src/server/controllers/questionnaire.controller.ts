import BlaiseClient, { IQuestionnaire } from 'blaise-api-node-client';
import express, { Request, Response } from 'express';
import { IControllerInterface } from '../interfaces/controller.interface';
import { IConfiguration } from '../interfaces/configuration.interface';

export default class QuestionnaireController implements IControllerInterface {
  config: IConfiguration;

  blaiseApiClient: BlaiseClient;

  constructor(config: IConfiguration, blaiseApiClient: BlaiseClient) {
    this.config = config;
    this.blaiseApiClient = blaiseApiClient;
    this.getQuestionnaires = this.getQuestionnaires.bind(this);
  }

  getRoutes() {
    const router = express.Router();
    return router.get('/api/questionnaires', this.getQuestionnaires);
  }

  async getQuestionnaires(_request: Request, response: Response<IQuestionnaire[]>) {
    try {
      const questionnaires = await this.blaiseApiClient.getQuestionnaires(this.config.ServerPark);
      return response.status(200).json(questionnaires);
    } catch (error) {
      return response.status(500).json();
    }
  }
}
