import BlaiseClient, { IQuestionnaire } from 'blaise-api-node-client';
import express, { Request, Response } from 'express';
import { IControllerInterface } from '../interfaces/controller.interface';

export default class QuestionnaireController implements IControllerInterface {
  blaiseApiClient: BlaiseClient;

  constructor(blaiseApiClient: BlaiseClient) {
    this.blaiseApiClient = blaiseApiClient;
    this.getQuestionnaires = this.getQuestionnaires.bind(this);
  }

  getRoutes() {
    const router = express.Router();
    return router.get('/api/questionnaires', this.getQuestionnaires);
  }

  async getQuestionnaires(_request: Request, response: Response<IQuestionnaire[]>) {
    const questionnaires = await this.blaiseApiClient.getQuestionnaires('gusty');
    return response.status(200).json(questionnaires);
  }
}
