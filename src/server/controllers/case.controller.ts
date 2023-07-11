import BlaiseClient, { ICaseStatus } from 'blaise-api-node-client';
import express, { Request, Response, Router } from 'express';
import { IControllerInterface } from '../interfaces/controller.interface';
import { IConfiguration } from '../interfaces/configuration.interface';

export default class CaseController implements IControllerInterface {
  config: IConfiguration;

  blaiseApiClient: BlaiseClient;

  constructor(config: IConfiguration, blaiseApiClient: BlaiseClient) {
    this.config = config;
    this.blaiseApiClient = blaiseApiClient;
    this.getStatusOfCases = this.getStatusOfCases.bind(this);
  }

  getRoutes(): Router {
    const router = express.Router();
    return router.get('/api/questionnaires/:questionnaireName/cases/status', this.getStatusOfCases);
  }

  async getStatusOfCases(request: Request, response: Response<ICaseStatus[]>) {
    const { questionnaireName } = request.params;

    if (typeof questionnaireName !== 'string') {
      throw new Error('Questionnaire name has not been provided');
    }

    const cases = await this.blaiseApiClient.getCaseStatus(this.config.ServerPark, questionnaireName);

    return response.status(200).json(cases);
  }
}
