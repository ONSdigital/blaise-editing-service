import BlaiseClient from 'blaise-api-node-client';
import express, { Request, Response, Router } from 'express';
import { Controller } from '../interfaces/controllerInterface';
import { Configuration } from '../interfaces/configurationInterface';
import { CaseDetails, CaseFactsheetDetails } from '../../common/interfaces/caseInterface';
import { mapCaseDetails, mapCaseFactsheet } from '../mappers/caseMapper';
import notFound from '../../common/helpers/axiosHelper';

export default class CaseController implements Controller {
  config: Configuration;

  blaiseApiClient: BlaiseClient;

  constructor(config: Configuration, blaiseApiClient: BlaiseClient) {
    this.config = config;
    this.blaiseApiClient = blaiseApiClient;
    this.getCases = this.getCases.bind(this);
    this.getCaseFactsheet = this.getCaseFactsheet.bind(this);
  }

  getRoutes(): Router {
    const router = express.Router();
    router.get('/api/questionnaires/:questionnaireName/cases', this.getCases);
    router.get('/api/questionnaires/:questionnaireName/cases/:caseId/factsheet', this.getCaseFactsheet);

    return router;
  }

  async getCases(request: Request, response: Response<CaseDetails[]>) {
    const { questionnaireName } = request.params;

    if (questionnaireName === undefined) {
      throw new Error('Questionnaire name has not been provided');
    }

    try {
      const caseStatusList = await this.blaiseApiClient.getCaseStatus(this.config.ServerPark, questionnaireName);
      const caseDetailsList = mapCaseDetails(caseStatusList, questionnaireName, this.config.ExternalWebUrl);

      return response.status(200).json(caseDetailsList);
    } catch (error: unknown) {
      if (notFound(error)) {
        return response.status(404).json();
      }
      return response.status(500).json();
    }
  }

  async getCaseFactsheet(request: Request, response: Response<CaseFactsheetDetails>) {
    const {
      questionnaireName,
      caseId,
    } = request.params;

    if (questionnaireName === undefined) {
      throw new Error('Questionnaire name has not been provided');
    }

    if (caseId === undefined) {
      throw new Error('Case ID has not been provided');
    }

    try {
      const caseResponse = await this.blaiseApiClient.getCase(this.config.ServerPark, questionnaireName, caseId);
      const caseFactsheet = mapCaseFactsheet(caseResponse);

      return response.status(200).json(caseFactsheet);
    } catch (error: unknown) {
      if (notFound(error)) {
        return response.status(404).json();
      }
      return response.status(500).json();
    }
  }
}
