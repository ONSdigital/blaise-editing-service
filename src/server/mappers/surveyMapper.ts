import { QuestionnaireDetails, Survey } from '../../common/interfaces/surveyInterface';

export default function mapSurveys(questionnaires: QuestionnaireDetails[]): Survey[] {
  const surveys: Survey[] = [];

  questionnaires.forEach((questionnaire) => {
    const surveyElement = surveys.find((survey) => survey.name === questionnaire.surveyTla);
    if (surveyElement === undefined) {
      surveys.push({
        name: questionnaire.surveyTla,
        questionnaires: [questionnaire],
      });
    } else {
      surveyElement.questionnaires.push(questionnaire);
    }
  });
  return surveys;
}
