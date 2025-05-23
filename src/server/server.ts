import express, {
  Request, Response, Express, NextFunction,
} from 'express';
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
  server.use(express.static(buildFolderPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  }));

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

  // fallback for any API endpoints that are not found
  server.use('/api/*', (_request: Request, response: Response) => {
    response.redirect('/?error=API endpoint not found');
  });

  // catch all other routes renders react pages
  server.get('*', (_request: Request, response: Response) => {
    response.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.render('index.html');
  });

  server.use((_error: Error, _request: Request, response: Response, _next: NextFunction) => {
    response.redirect('/?error=Server Error Occurred');
  });

  return server;
}
