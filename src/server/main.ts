import express, { Request, Response } from 'express';
import { GetQuestionnaires } from '../shared/responses/GetQuestionnaires';
import path from 'path';
import ejs from 'ejs';

const app = express();
const port = 5000;

// where ever the react built package is
const buildFolder = "../../build";

// treat the index.html as a template and substitute the values at runtime
app.set("views", path.join(__dirname, buildFolder));
app.engine("html", ejs.renderFile);
app.use("/static", express.static(path.join(__dirname, `${buildFolder}/static`)));

app.get('/api/questionnaires', (_req, res: Response<GetQuestionnaires>) => {
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

app.get("*/", function (_req: Request, res: Response) {
  res.render("index.html");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
