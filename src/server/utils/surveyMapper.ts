import type { QuestionnaireDetails, Survey } from "../../common/types/survey.types.js";

export default function toSurveys(questionnaires: QuestionnaireDetails[]): Survey[] {
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
