import BlaiseClient from 'blaise-api-node-client';
import express, { Request, Response, Express } from 'express';
import ejs from 'ejs';
import path from 'path';
import SurveyController from './controllers/surveyController';
import CaseController from './controllers/caseController';
import { Configuration } from './interfaces/configurationInterface';

export default function nodeServer(config: Configuration, blaiseApiClient: BlaiseClient): Express {
  const server = express();

  // treat the index.html as a template and substitute the values at runtime
  server.set('views', path.join(__dirname, config.BuildFolder));
  server.engine('html', ejs.renderFile);
  server.use('/static', express.static(path.join(__dirname, `${config.BuildFolder}/static`)));

  // survey routing
  const surveyController = new SurveyController(config, blaiseApiClient);
  server.use('/', surveyController.getRoutes());

  // case routing
  const caseController = new CaseController(config, blaiseApiClient);
  server.use('/', caseController.getRoutes());

  // catch all other routes renders react pages
  server.get('*', (_request: Request, response: Response) => {
    response.render('index.html');
  });

  return server;
}
