import { Questionnaire } from 'blaise-api-node-client';
import { QuestionnaireDetails } from '../../common/interfaces/surveyInterface';

function mapFieldPeriod(fieldPeriodDate: string | undefined): string {
  if (fieldPeriodDate === undefined) {
    return 'N/A';
  }

  const date = new Date(fieldPeriodDate);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
  };

  return date.toLocaleDateString(undefined, options);
}

export default function mapQuestionnaireDetails(questionnaire: Questionnaire): QuestionnaireDetails {
  const questionaireDetails: QuestionnaireDetails = {
    questionnaireName: questionnaire.name,
    numberOfCases: questionnaire.dataRecordCount ?? 0,
    fieldPeriod: mapFieldPeriod(questionnaire.fieldPeriod),
    surveyTla: questionnaire.surveyTla ?? 'N/A',
  };

  return questionaireDetails;
}
