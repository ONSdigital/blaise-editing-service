import type { QuestionnaireDetails } from "../../common/types/survey.types.js";
import type { Questionnaire } from "blaise-api-node-client";

function mapFieldPeriod(fieldPeriodDate: string | undefined): string {
  if (fieldPeriodDate === undefined) {
    return "N/A";
  }

  const date = new Date(fieldPeriodDate);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };

  return date.toLocaleDateString(undefined, options);
}

export default function toQuestionnaireDetails(questionnaire: Questionnaire): QuestionnaireDetails {
  const questionnaireDetails: QuestionnaireDetails = {
    questionnaireName: questionnaire.name,
    numberOfCases: questionnaire.dataRecordCount ?? 0,
    fieldPeriod: mapFieldPeriod(questionnaire.fieldPeriod),
    surveyTla: questionnaire.surveyTla ?? "N/A",
  };

  return questionnaireDetails;
}
