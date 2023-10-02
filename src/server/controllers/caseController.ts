import express, { Request, Response, Router } from 'express';
import { Controller } from '../interfaces/controllerInterface';
import { ServerConfiguration } from '../interfaces/serverConfigurationInterface';
import { CaseDetails, CaseFactsheetDetails } from '../../common/interfaces/caseInterface';
import notFound from '../helpers/axiosHelper';
import BlaiseApi from '../api/BlaiseApi';

export default class CaseController implements Controller {
  config: ServerConfiguration;

  blaiseApi: BlaiseApi;

  constructor(config: ServerConfiguration, blaiseApi: BlaiseApi) {
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

  async getCases(request: Request<{ questionnaireName:string }, {}, {}, { username:string }>, response: Response<CaseDetails[]>) {
    const { questionnaireName } = request.params;
    const { username } = request.query;

    try {
      const caseDetailsList = await this.blaiseApi.getCaseDetails(questionnaireName, username);

      return response.status(200).json(caseDetailsList);
    } catch (error: unknown) {
      if (notFound(error)) {
        return response.status(404).json();
      }
      return response.status(500).json();
    }
  }

  async getCaseFactsheet(request: Request<{ questionnaireName:string, caseId:string }>, response: Response<CaseFactsheetDetails>) {
    const {
      questionnaireName,
      caseId,
    } = request.params;

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
