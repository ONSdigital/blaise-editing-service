import BlaiseClient, { ICaseStatus } from 'blaise-api-node-client';
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

    const caseStatusList = await this.blaiseApiClient.getCaseStatus(this.config.ServerPark, questionnaireName);
    const caseDetailsList = this.mapCaseDetails(questionnaireName, caseStatusList);

    return response.status(200).json(caseDetailsList);
  }

  mapCaseDetails(questionnaireName:string, caseStatusList: ICaseStatus[]): ICaseDetails[] {
    return caseStatusList.map((caseStatus) => ({
      CaseId: caseStatus.primaryKey,
      CaseStatus: caseStatus.outcome,
      CaseLink: `https://${this.config.ExternalWebUrl}/${questionnaireName}?Mode=CAWI&KeyValue=${caseStatus.primaryKey}`,
    }));
  }
}
