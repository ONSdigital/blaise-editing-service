import { CaseData, Questionnaire } from 'blaise-api-node-client';
import { QuestionnaireDetails } from '../../common/interfaces/surveyInterface';
import stringIsNullOrEmpty from '../../common/helpers/stringHelper';

export default function mapQuestionnaireDetails(questionnaire: Questionnaire, caseData: CaseData[]): QuestionnaireDetails {
  const numberOfAllocatedCases = caseData.filter((cases) => !stringIsNullOrEmpty(cases['allocation.toeditor'])).length;

  const questionaireDetails: QuestionnaireDetails = {
    questionnaireName: questionnaire.name,
    numberOfCases: questionnaire.dataRecordCount ?? 0,
    numberOfCasesAllocated: numberOfAllocatedCases,
  };

  return questionaireDetails;
}
