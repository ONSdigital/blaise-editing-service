import express, { Request, Response } from 'express';
import { Questionnaire } from 'blaise-api-node-client';
import path from 'path';
import ejs from 'ejs';

const app = express();
const port = 5000;

// where ever the react built package is
const buildFolder = '../build';

// treat the index.html as a template and substitute the values at runtime
app.set('views', path.join(__dirname, buildFolder));
app.engine('html', ejs.renderFile);
app.use('/static', express.static(path.join(__dirname, `${buildFolder}/static`)));

app.get('/api/questionnaires', (_req, res: Response<Questionnaire []>) => {
  const questionnaires: Questionnaire [] = [{
    name: 'OPN2101A',
    serverParkName: 'gusty',
    installDate: '2021-01-15T14:41:29.4399898+00:00',
    status: 'Active',
    dataRecordCount: 10,
    hasData: false,
    active: false,
    fieldPeriod: 'dummy',
  },
  {
    name: 'LMS2101A',
    serverParkName: 'gusty',
    installDate: '2021-01-15T14:41:29.4399898+00:00',
    status: 'Active',
    dataRecordCount: 0,
    hasData: false,
    active: false,
    fieldPeriod: 'dummy',
  },
  ];

  res.json(questionnaires);
});

app.get('*/', (_req: Request, res: Response) => {
  res.render('index.html');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
