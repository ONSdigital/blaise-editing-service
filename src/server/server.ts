import cors from 'cors';
import express, {
  Request, Response, Express, NextFunction,
} from 'express';
import ejs from 'ejs';
import path from 'path';
import { Auth, newLoginHandler } from 'blaise-login-react/blaise-login-react-server';
import SurveyHandler from './handlers/surveyHandler';
import ConfigurationProvider from './configuration/ServerConfigurationProvider';
import BlaiseApi from './api/BlaiseApi';
import BlaiseApiClient from 'blaise-api-node-client';
import createLogger from "./pino";
import { HttpLogger } from "pino-http";
import AuditLogger from "./logger/auditLogger";
import CaseHandler from './handlers/caseHandler';
import newClientLogHandler from "./handlers/clientLogHandler";
import UserHandler from './handlers/userHandler';


export interface NodeServerDependencies {
  blaiseApiClient?: BlaiseApiClient;
  blaiseApi?: BlaiseApi;
  auth?: Auth;
  auditLogger?: AuditLogger;
}


export default function nodeServer(
  config: ConfigurationProvider,
  logger: HttpLogger = createLogger(),
  dependencies: NodeServerDependencies = {},
): Express {

  const blaiseApiClient = dependencies.blaiseApiClient ?? new BlaiseApiClient(config.BlaiseApiUrl);
  const blaiseApi = dependencies.blaiseApi ?? new BlaiseApi(config, blaiseApiClient);

  const server = express();
  server.use(logger);

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cors());

  server.get('/bes-ui/:version/health', (_req: Request, res: Response) => res.status(200).json({ healthy: true }));

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

  const auth = dependencies.auth ?? new Auth(config);
  const auditLogger = dependencies.auditLogger ?? new AuditLogger("BES");

  // survey routing
  const surveyHandler = new SurveyHandler(blaiseApi, config, auth, auditLogger);
  server.use('/', surveyHandler.getRoutes());

  // case routing
  const caseHandler = new CaseHandler(blaiseApi, config, auth, auditLogger);
  server.use('/', caseHandler.getRoutes());

  // User routing
  const userHandler = new UserHandler(blaiseApi, config, auth, auditLogger);
  server.use('/', userHandler.getRoutes());

  // login routing
  const loginHandler = newLoginHandler(auth, blaiseApi.blaiseApiClient);
  server.use('/', loginHandler);


  // client log handler

  const clientLogHandler = newClientLogHandler(auth);
  server.use("/", clientLogHandler);

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
