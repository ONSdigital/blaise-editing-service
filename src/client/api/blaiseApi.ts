import axios from 'axios';
import { ICaseStatus, IQuestionnaire } from 'blaise-api-node-client';

export async function getQuestionnaires(): Promise<IQuestionnaire[]> {
  const response = await axios.get('/api/questionnaires');
  return response.data;
}

export async function getStatusOfCases(questionnaireName: string): Promise<ICaseStatus[]> {
  const response = await axios.get(`/api/questionnaires/${questionnaireName}/cases/status`);
  return response.data;
}
