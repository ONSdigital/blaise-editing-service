import express, { Request, Response } from 'express';
import BlaiseApiClient from 'blaise-api-node-client';
import path from 'path';
import ejs from 'ejs';
import dotenv from 'dotenv';
import { getConfiguration } from './config';
import questionnaireRouter from './routers/questionnaireRouter';
import caseRouter from './routers/caseRouter';

dotenv.config();

const server = express();
const { BlaiseApiUrl, BuildFolder, Port } = getConfiguration();
const blaiseApiClient = new BlaiseApiClient(BlaiseApiUrl);

// treat the index.html as a template and substitute the values at runtime
server.set('views', path.join(__dirname, BuildFolder));
server.engine('html', ejs.renderFile);
server.use('/static', express.static(path.join(__dirname, `${BuildFolder}/static`)));

server.use('/', questionnaireRouter(blaiseApiClient));
server.use('/', caseRouter(blaiseApiClient));

server.get('*', (_request: Request, response: Response) => {
  response.render('index.html');
});

server.listen(Port, () => {
  console.log(`Example app listening on port ${Port}`);
});
