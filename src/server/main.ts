import express, { Request, Response } from 'express';
import BlaiseApiClient, { CaseStatus, Outcome, Questionnaire } from 'blaise-api-node-client';
import path from 'path';
import ejs from 'ejs';
import dotenv from 'dotenv';
import { getConfiguration } from './config';

dotenv.config();

const app = express();
const { BlaiseApiUrl, BuildFolder, Port } = getConfiguration();
const blaiseApiClient = new BlaiseApiClient(BlaiseApiUrl);

// treat the index.html as a template and substitute the values at runtime
app.set('views', path.join(__dirname, BuildFolder));
app.engine('html', ejs.renderFile);
app.use('/static', express.static(path.join(__dirname, `${BuildFolder}/static`)));

app.get('/api/questionnaires', async (_req: Request, res: Response<Questionnaire[]>) => {
  const questionnaires = await blaiseApiClient.getQuestionnaires('gusty');
  return res.status(200).json(questionnaires);
});

app.get('/api/cases', async (req: Request, res: Response<CaseStatus[]>) => {
  let questionnaireName = req.query['questionnaireName'];
  console.debug('Questionnaire Name= '+questionnaireName);
  //const cases = await blaiseApiClient.getCaseStatus('gusty','LMS2101_AA1');
  const cases = [
    {'primaryKey':'123',
      'outcome': Outcome.Completed
    },
    {'primaryKey':'456',
      'outcome': Outcome.CompletedNudge
    },
    {'primaryKey':'789',
      'outcome': Outcome.HardRefusal
    }
  ];
  return res.status(200).json(cases);
});

app.get('*/', (_req: Request, res: Response) => {
  res.render('index.html');
});

app.listen(Port, () => {
  console.log(`Example app listening on port ${Port}`);
});
