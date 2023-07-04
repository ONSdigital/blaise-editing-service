import BlaiseApiClient from "blaise-api-node-client";
import express, { Request, Response, Express } from 'express';
import ejs from 'ejs';
import path from "path";
import { Config } from "./config";
import caseRouter from "./routers/caseRouter";
import questionnaireRouter from "./routers/questionnaireRouter";

export function nodeServer(config: Config): Express {
  const server = express();
  const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

  // treat the index.html as a template and substitute the values at runtime
  server.set('views', path.join(__dirname, config.BuildFolder));
  server.engine('html', ejs.renderFile);
  server.use('/static', express.static(path.join(__dirname, `${config.BuildFolder}/static`)));

  server.use('/', questionnaireRouter(blaiseApiClient));
  server.use('/', caseRouter(blaiseApiClient));

  server.get('*', (_request: Request, response: Response) => {
    response.render('index.html');
  });
  
  return server;
};
