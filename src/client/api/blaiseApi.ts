import axios from 'axios';
import { CaseDetails, CaseFactsheetDetails } from '../../common/interfaces/caseInterface';
import notFound from '../../common/helpers/axiosHelper';
import { Survey } from '../../common/interfaces/surveyInterface';

export async function getSurveys(): Promise<Survey[]> {
  try {
    const response = await axios.get('/api/surveys');

    return response.data;
  } catch (error) {
    if (notFound(error)) {
      throw new Error('Unable to find surveys, please contact Richmond Rice');
    }
    throw new Error('Unable to retrieve surveys, please try again in a few minutes');
  }
}

export async function getCases(questionnaireName: string): Promise<CaseDetails[]> {
  try {
    const response = await axios.get(`/api/questionnaires/${questionnaireName}/cases`);
    return response.data;
  } catch (error) {
    if (notFound(error)) {
      throw new Error('The questionnaire is no longer available');
    }
    throw new Error('Unable to retrieve cases, please try again in a few minutes');
  }
}

export async function getCaseFactsheet(questionnaireName: string, caseId: string): Promise<CaseFactsheetDetails> {
  try {
    const response = await axios.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`);
    return response.data;
  } catch (error) {
    if (notFound(error)) {
      throw new Error('The questionnaire is no longer available');
    }
    throw new Error('Unable to retrieve case factsheet, please try again in a few minutes');
  }
}
