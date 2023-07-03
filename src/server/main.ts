import express, { Request, Response } from 'express';
import BlaiseApiClient, { CaseStatus } from 'blaise-api-node-client';
import path from 'path';
import ejs from 'ejs';
import dotenv from 'dotenv';
import { getConfiguration } from './config';
import questionnaireRouter from './routers/questionnaireRouter';

dotenv.config();

const server = express();
const { BlaiseApiUrl, BuildFolder, Port } = getConfiguration();
const blaiseApiClient = new BlaiseApiClient(BlaiseApiUrl);

// treat the index.html as a template and substitute the values at runtime
server.set('views', path.join(__dirname, BuildFolder));
server.engine('html', ejs.renderFile);
server.use('/static', express.static(path.join(__dirname, `${BuildFolder}/static`)));

server.use("/", questionnaireRouter)

server.get('/api/cases', async (req: Request, res: Response<CaseStatus[]>) => {
  const { questionnaireName } = req.query;
  if (typeof questionnaireName !== 'string') {
    throw new Error('Questionnaire name has not been provided');
  }

  const cases = await blaiseApiClient.getCaseStatus('gusty', questionnaireName);
  return res.status(200).json(cases);
});

server.get('*/', (_req: Request, res: Response) => {
  res.render('index.html');
});

server.listen(Port, () => {
  console.log(`Example app listening on port ${Port}`);
});
