import axios from 'axios';
import { IQuestionnaire } from 'blaise-api-node-client';
import { ICaseDetails } from '../../server/interfaces/case.details.interface';

export async function getQuestionnaires(): Promise<IQuestionnaire[]> {
  const response = await axios.get('/api/questionnaires');
  return response.data;
}

export async function getListOfCases(questionnaireName: string): Promise<ICaseDetails[]> {
  const response = await axios.get(`/api/questionnaires/${questionnaireName}/cases`);
  return response.data;
}
