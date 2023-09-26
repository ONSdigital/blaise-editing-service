import { Questionnaire, QuestionnaireReport } from 'blaise-api-node-client';
import { QuestionnaireCaseDetails } from '../../common/interfaces/surveyInterface';
import stringIsNullOrEmpty from '../../common/helpers/stringHelper';

export default function mapQuestionnaireAllocation(questionnaires: Questionnaire[], reports:QuestionnaireReport[]): QuestionnaireCaseDetails[] {
  const questionnairesWithCaseDetails:QuestionnaireCaseDetails[] = [];

  questionnaires.forEach((questionnaire) => {
    const report = reports.find((r) => r.questionnaireName === questionnaire.name);
    const allocatedCases = report?.reportingData.filter((data) => !stringIsNullOrEmpty(data['allocation.toeditor'])).length;

    questionnairesWithCaseDetails.push({
      questionnaireName: questionnaire.name,
      numberOfCases: questionnaire.dataRecordCount ?? 0,
      numberOfCasesAllocated: allocatedCases ?? 0,
    });
  });

  return questionnairesWithCaseDetails;
}
