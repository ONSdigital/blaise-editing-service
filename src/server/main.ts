import express, { Request, Response } from 'express';
import BlaiseApiClient, { Questionnaire } from 'blaise-api-node-client';
import path from 'path';
import ejs from 'ejs';

const app = express();
const port = 5000;
const blaiseUrl = 'http://localhost:90';
// where ever the react built package is
const buildFolder = '../build';
const blaiseApiClient = new BlaiseApiClient(blaiseUrl);

// treat the index.html as a template and substitute the values at runtime
app.set('views', path.join(__dirname, buildFolder));
app.engine('html', ejs.renderFile);
app.use('/static', express.static(path.join(__dirname, `${buildFolder}/static`)));

app.get('/api/questionnaires', async (_req: Request, res: Response<Questionnaire[]>) =>  {  
  var questionnaires = await blaiseApiClient.getQuestionnaires('gusty');
  return res.status(200).json(questionnaires);
});

app.get('*/', (_req: Request, res: Response) => {
  res.render('index.html');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
