import axios from 'axios';
import { CaseDetails, CaseFactsheetDetails } from '../../common/interfaces/caseInterface';
import notFound from '../../server/helpers/axiosHelper';
import { Survey } from '../../common/interfaces/surveyInterface';

async function getDataFromNode<T>(url: string, notFoundError: string): Promise<T> {
  try {
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    if (notFound(error)) {
      throw new Error(notFoundError);
    }
    throw new Error('Unable to complete request, please try again in a few minutes');
  }
}

export async function getSurveys(): Promise<Survey[]> {
  return getDataFromNode('/api/surveys', 'Unable to find surveys, please contact Richmond Rice');
}

export async function getCases(questionnaireName: string, username: string): Promise<CaseDetails[]> {
  return getDataFromNode(`/api/questionnaires/${questionnaireName}/cases?username=${username}`, 'The questionnaire is no longer available');
}

export async function getCaseFactsheet(questionnaireName: string, caseId: string): Promise<CaseFactsheetDetails> {
  return getDataFromNode(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`, 'The questionnaire is no longer available');
}
