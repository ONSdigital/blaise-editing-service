import express, { Request, Response, Router } from 'express';
import { Controller } from '../interfaces/controllerInterface';
import { Configuration } from '../interfaces/configurationInterface';
import { CaseDetails, CaseFactsheetDetails } from '../../common/interfaces/caseInterface';
import notFound from '../../common/helpers/axiosHelper';
import BlaiseApi from '../api/BlaiseApi';

export default class CaseController implements Controller {
  config: Configuration;

  blaiseApi: BlaiseApi;

  constructor(config: Configuration, blaiseApi: BlaiseApi) {
    this.config = config;
    this.blaiseApi = blaiseApi;
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
      const caseDetailsList = await this.blaiseApi.getCaseDetails(questionnaireName);

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
      const caseFactsheet = await this.blaiseApi.getCaseFactsheet(questionnaireName, caseId);

      return response.status(200).json(caseFactsheet);
    } catch (error: unknown) {
      if (notFound(error)) {
        return response.status(404).json();
      }
      return response.status(500).json();
    }
  }
}
