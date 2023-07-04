import axios from 'axios';
import { CaseStatus, Questionnaire } from 'blaise-api-node-client';

export async function getQuestionnaires(): Promise<Questionnaire[]> {
  const response = await axios.get('/api/questionnaires');
  return response.data;
}

export async function getCaseStatuses(questionnaireName: string): Promise<CaseStatus[]> {
  const response = await axios.get(`/api/questionnaires/${questionnaireName}/cases/`);
  return response.data;
}
