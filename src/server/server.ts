import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { BlaiseApiClient } from "blaise-api-node-client";
import { Auth, newLoginHandler } from "blaise-login-react-server";
import cors from "cors";
import ejs from "ejs";
import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

import CaseHandler from "./handlers/caseHandler.js";
import newClientLogHandler from "./handlers/clientLogHandler.js";
import SurveyHandler from "./handlers/surveyHandler.js";
import UserHandler from "./handlers/userHandler.js";
import { createApiErrorResponse } from "./helpers/apiErrorResponse.js";
import AuditLogger from "./utils/auditLogger.js";
import BlaiseApi from "./utils/blaiseApi.js";
import createLogger from "./utils/pino.js";

import type { ConfigurationProvider } from "./utils/serverConfigurationProvider.js";
import type { Express, NextFunction, Request, Response } from "express";
import type { HttpLogger } from "pino-http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface NodeServerDependencies {
  blaiseApiClient?: BlaiseApiClient;
  blaiseApi?: BlaiseApi;
  auth?: Auth;
  auditLogger?: AuditLogger;
}

function firstExistingPath(candidates: string[]): string | undefined {
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function resolveBuildFolderPath(buildFolder: string): string {
  const candidateFolders = [
    path.resolve(process.cwd(), "build/client"),
    path.resolve(__dirname, buildFolder),
    path.resolve(process.cwd()),
  ];

  const buildFolderPath = candidateFolders.find((candidate) =>
    fs.existsSync(path.join(candidate, "index.html")),
  );

  return buildFolderPath ?? candidateFolders[0];
}

function loadErrorPageContent(buildFolderPath: string): string | undefined {
  const errorPageCandidates = [
    path.resolve(process.cwd(), "src/server/views/500.html"),
    path.join(buildFolderPath, "500.html"),
    path.join(buildFolderPath, "views/500.html"),
  ];
  const errorPagePath = firstExistingPath(errorPageCandidates);

  if (!errorPagePath) {
    return undefined;
  }

  return fs.readFileSync(errorPagePath, "utf-8");
}

function isApiRequest(request: Request): boolean {
  return request.path === "/api" || request.path.startsWith("/api/");
}

function getRateLimitIp(request: Request): string {
  return request.ip ?? "unknown";
}

export default function nodeServer(
  config: ConfigurationProvider,
  logger: HttpLogger = createLogger(),
  dependencies: NodeServerDependencies = {},
): Express {
  const blaiseApiClient = dependencies.blaiseApiClient ?? new BlaiseApiClient(config.BlaiseApiUrl);
  const blaiseApi = dependencies.blaiseApi ?? new BlaiseApi(config, blaiseApiClient);
  const auth = dependencies.auth ?? new Auth(config);
  const auditLogger = dependencies.auditLogger ?? new AuditLogger(config.ProjectId);

  const server = express();
  const buildFolderPath = resolveBuildFolderPath(config.BuildFolder);
  const errorPageContent = loadErrorPageContent(buildFolderPath);

  server.set("trust proxy", 1);
  server.disable("x-powered-by");

  server.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "img-src": ["'self'", "data:", "https://cdn.ons.gov.uk"],
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
        const token = auth.getToken(request);
        const user = auth.getUser(token);

        if (user?.name) {
          return `user:${user.name.toLowerCase()}`;
        }
      } catch {
        // Fall back to trusted proxy-derived request IP when auth context is unavailable.
      }

      return `ip:${getRateLimitIp(request)}`;
    },
  });

  server.use(pageRateLimiter);
  server.use(apiRateLimiter);

  server.get("/bes-ui/:version/health", (_req: Request, res: Response) =>
    res.status(200).json({ healthy: true }),
  );

  server.use("/assets", express.static(path.join(buildFolderPath, "assets")));
  server.use("/static", express.static(path.join(buildFolderPath, "static")));

  server.set("views", buildFolderPath);
  server.engine("html", ejs.renderFile);

  const surveyHandler = new SurveyHandler(blaiseApi, config, auth, auditLogger);

  server.use("/", surveyHandler.getRoutes());

  const caseHandler = new CaseHandler(blaiseApi, config, auth, auditLogger);

  server.use("/", caseHandler.getRoutes());

  const userHandler = new UserHandler(blaiseApi, config, auth, auditLogger);

  server.use("/", userHandler.getRoutes());

  const loginHandler = newLoginHandler(auth, blaiseApi.blaiseApiClient);

  server.use("/", loginHandler);

  const clientLogHandler = newClientLogHandler(auth);

  server.use("/", clientLogHandler);

  server.use(/^\/api(?:\/.*)?$/, (_request: Request, response: Response) => {
    response.status(404).json(createApiErrorResponse(404));
  });

  server.get(/.*/, async (_request: Request, response: Response) => {
    response.set("Cache-Control", "no-cache, no-store, must-revalidate");
    try {
      const html = await ejs.renderFile(path.join(buildFolderPath, "index.html"), {
        appConfigJson: JSON.stringify({
          projectId: config.ProjectId,
          urlDomain: config.UrlDomain,
        }).replace(/</g, "\\u003c"),
      });

      response.send(html);
    } catch {
      if (errorPageContent != null) {
        response.status(500).type("text/html").send(errorPageContent);

        return;
      }

      response.status(500).type("text/plain").send("Sorry, there is a problem with the service.");
    }
  });

  server.use((error: Error, request: Request, response: Response, _next: NextFunction) => {
    request.log.error(error, error.message);

    if (errorPageContent != null) {
      response.status(500).type("text/html").send(errorPageContent);

      return;
    }

    response.status(500).type("text/plain").send("Sorry, there is a problem with the service.");
  });

  return server;
}
