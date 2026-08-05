import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import express, {
  Request, Response, Express, NextFunction,
} from 'express';
import ejs from 'ejs';
import path from 'path';
import { Auth, newLoginHandler } from 'blaise-login-react/blaise-login-react-server';
import SurveyHandler from './handlers/surveyHandler';
import ConfigurationProvider from './ServerConfigurationProvider';
import BlaiseApi from './BlaiseApi';
import BlaiseApiClient from 'blaise-api-node-client';
import createLogger from "./pino";
import { HttpLogger } from "pino-http";
import AuditLogger from "./auditLogger";
import CaseHandler from './handlers/caseHandler';
import newClientLogHandler from "./handlers/clientLogHandler";
import UserHandler from './handlers/userHandler';


export interface NodeServerDependencies {
  blaiseApiClient?: BlaiseApiClient;
  blaiseApi?: BlaiseApi;
  auth?: Auth;
  auditLogger?: AuditLogger;
}

function isApiRequest(request: Request): boolean {
  return request.path === '/api' || request.path.startsWith('/api/');
}

function parseForwardedFor(forwardedHeader: string | undefined): string | undefined {
  if (!forwardedHeader) {
    return undefined;
  }

  const firstForwardedValue = forwardedHeader.split(',')[0]?.trim();
  if (!firstForwardedValue) {
    return undefined;
  }

  const forPart = firstForwardedValue
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.toLowerCase().startsWith('for='));

  if (!forPart) {
    return undefined;
  }

  let client = forPart.slice(4).trim();
  if (!client) {
    return undefined;
  }

  if (client.startsWith('"') && client.endsWith('"')) {
    client = client.slice(1, -1);
  }

  if (client.startsWith('[')) {
    const ipv6End = client.indexOf(']');
    if (ipv6End > 0) {
      client = client.slice(1, ipv6End);
    }
  } else {
    const [hostOnly] = client.split(':');
    client = hostOnly ?? client;
  }

  if (!client || client.toLowerCase() === 'unknown') {
    return undefined;
  }

  return client;
}

function getRateLimitIp(request: Request): string {
  return parseForwardedFor(request.header('forwarded')) ?? request.ip ?? 'unknown';
}


export default function nodeServer(
  config: ConfigurationProvider,
  logger: HttpLogger = createLogger(),
  dependencies: NodeServerDependencies = {},
): Express {

  const blaiseApiClient = dependencies.blaiseApiClient ?? new BlaiseApiClient(config.BlaiseApiUrl);
  const blaiseApi = dependencies.blaiseApi ?? new BlaiseApi(config, blaiseApiClient);
  const auth = dependencies.auth ?? new Auth(config);
  const auditLogger = dependencies.auditLogger ?? new AuditLogger('BES');

  const server = express();
  server.set('trust proxy', 1);
  server.disable('x-powered-by');

  server.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'img-src': ["'self'", 'data:', 'https://cdn.ons.gov.uk'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  server.use(logger);

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cors());

  const pageRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 600,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (request) => isApiRequest(request),
    keyGenerator: (request) => `ip:${getRateLimitIp(request)}`,
  });

  const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (request) => !isApiRequest(request),
    keyGenerator: (request) => {
      try {
        const token = auth.GetToken(request);
        const user = auth.GetUser(token);
        if (user?.name) {
          return `user:${user.name.toLowerCase()}`;
        }
      } catch {
        // Fall back to forwarded client IP when auth context is unavailable.
      }

      return `ip:${getRateLimitIp(request)}`;
    },
  });

  server.use(pageRateLimiter);
  server.use(apiRateLimiter);

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
