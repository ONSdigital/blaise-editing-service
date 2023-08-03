import axios from 'axios';
import { IQuestionnaire } from 'blaise-api-node-client';
import { ICaseDetails } from '../../server/interfaces/case.details.interface';
import notFound from '../../common/axios.helper';

export async function getQuestionnaires(): Promise<IQuestionnaire[]> {
  try {
    const response = await axios.get('/api/questionnaires');

    return response.data;
  } catch (error) {
    if (notFound(error)) {
      throw new Error('Unable to find questionnaires, please contact Richmond Rice');
    }
    throw new Error('Unable to retrieve questionnaires, please try again in a few minutes');
  }
}

export async function getCases(questionnaireName: string): Promise<ICaseDetails[]> {
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
