import BlaiseApiClient from 'blaise-api-node-client';
import express, { Router } from 'express';
import CaseHandler from '../handlers/caseHandler';

export default function caseRouter(blaiseApiClient: BlaiseApiClient): Router {
  const router = express.Router();
  const caseHandler = new CaseHandler(blaiseApiClient);

  router.get('/api/questionnaires/:questionnaireName/cases/', caseHandler.getCases);
  return router;
}
