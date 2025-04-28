import express, { Request, Response, Express } from 'express';
import ejs from 'ejs';
import path from 'path';
import { Auth, newLoginHandler } from 'blaise-login-react-server';
import SurveyController from './controllers/surveyController';
import ConfigurationProvider from './configuration/ServerConfigurationProvider';
import BlaiseApi from './api/BlaiseApi';
import CaseController from './controllers/caseController';
import UserController from './controllers/userController';

const cors = require('cors');

export default function nodeServer(config: ConfigurationProvider, blaiseApi: BlaiseApi): Express {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cors());

  // serve the entire build folder as static
  const buildFolderPath = path.join(__dirname, config.BuildFolder);
  server.use("/static", express.static(buildFolderPath));

  // set up views for rendering index.html
  server.set('views', buildFolderPath);
  server.engine('html', ejs.renderFile);

  const auth = new Auth(config);

  // survey routing
  const surveyController = new SurveyController(blaiseApi, config, auth);
  server.use('/', surveyController.getRoutes());

  // case routing
  const caseController = new CaseController(blaiseApi, config, auth);
  server.use('/', caseController.getRoutes());

  // User routing
  const userController = new UserController(blaiseApi, config, auth);
  server.use('/', userController.getRoutes());

  // login routing
  const loginHandler = newLoginHandler(auth, blaiseApi.blaiseApiClient);
  server.use('/', loginHandler);

  // catch all other routes renders react pages
  server.get('*', (_request: Request, response: Response) => {
    response.sendFile(path.join(buildFolderPath, 'index.html'), {
      headers: { 'Cache-Control': 'no-cache' }
    })
  });

  return server;
}
