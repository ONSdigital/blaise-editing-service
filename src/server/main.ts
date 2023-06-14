import express, { Response } from 'express';
import { GetQuestionnaires } from '../shared/responses/GetQuestionnaires';

const app = express();
const port = 5000;

app.get('/', (_req, res) => {
  res.send('Hello World! Hello now..!!');
});

app.get('/questionnaires', (_req, res: Response<GetQuestionnaires>) => {
  const questionnaires: GetQuestionnaires = [
    {
      name: 'LMS',
    },
    {
      name: 'FRS',
    },
  ];
  res.json(questionnaires);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
