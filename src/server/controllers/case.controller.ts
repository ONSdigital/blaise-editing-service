import BlaiseClient, { Outcome } from 'blaise-api-node-client';
import express, { Request, Response, Router } from 'express';
import { IControllerInterface } from '../interfaces/controller.interface';
import { IConfiguration } from '../interfaces/configuration.interface';
import { ICaseDetails } from '../interfaces/case.details.interface';

export default class CaseController implements IControllerInterface {
  config: IConfiguration;

  blaiseApiClient: BlaiseClient;

  constructor(config: IConfiguration, blaiseApiClient: BlaiseClient) {
    this.config = config;
    this.blaiseApiClient = blaiseApiClient;
    this.getListOfCases = this.getListOfCases.bind(this);
  }

  getRoutes(): Router {
    const router = express.Router();
    return router.get('/api/questionnaires/:questionnaireName/cases', this.getListOfCases);
  }

  async getListOfCases(request: Request, response: Response<ICaseDetails[]>) {
    const { questionnaireName } = request.params;

    if (typeof questionnaireName !== 'string') {
      throw new Error('Questionnaire name has not been provided');
    }

    const cases = await this.blaiseApiClient.getCaseStatus(this.config.ServerPark, questionnaireName);
    console.debug(cases);
    const mockResponseData = [
      {
        CaseId: '1',
        CaseStatus: Outcome.Completed,
        CaseLink: `https://dev-cati.social-surveys.gcp.onsdigital.uk/${questionnaireName}?Mode=CAWI&KeyValue=1`,
      },
      {
        CaseId: '2',
        CaseStatus: Outcome.Partial,
        CaseLink: `https://dev-cati.social-surveys.gcp.onsdigital.uk/${questionnaireName}?Mode=CAWI&KeyValue=2`,
      },
      {
        CaseId: '3',
        CaseStatus: Outcome.AppointmentMade,
        CaseLink: `https://dev-cati.social-surveys.gcp.onsdigital.uk/${questionnaireName}?Mode=CAWI&KeyValue=3`,
      },
    ];

    return response.status(200).json(mockResponseData);
  }
}
