import express, { Request, Response, Express } from 'express';
import ejs from 'ejs';
import path from 'path';
import { Auth, newLoginHandler } from 'blaise-login-react-server';
import SurveyController from './controllers/surveyController';
import CaseController from './controllers/caseController';
import ConfigurationProvider from './configuration/ServerConfigurationProvider';
import BlaiseApi from './api/BlaiseApi';

export default function nodeServer(config: ConfigurationProvider, blaiseApi: BlaiseApi): Express {
  const server = express();

  // treat the index.html as a template and substitute the values at runtime
  server.set('views', path.join(__dirname, config.BuildFolder));
  server.engine('html', ejs.renderFile);
  server.use('/static', express.static(path.join(__dirname, `${config.BuildFolder}/static`)));

  // survey routing
  const surveyController = new SurveyController(blaiseApi);
  server.use('/', surveyController.getRoutes());

  // case routing
  const caseController = new CaseController(config, blaiseApi);
  server.use('/', caseController.getRoutes());

  // login routing
  const auth = new Auth(config);
  const loginHandler = newLoginHandler(auth, blaiseApi.blaiseApiClient);
  server.use('/', loginHandler);

  // catch all other routes renders react pages
  server.get('*', (_request: Request, response: Response) => {
    response.render('index.html');
  });

  return server;
}
