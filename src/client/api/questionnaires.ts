import axios from 'axios';
import { Questionnaire } from 'blaise-api-node-client';

export default async function getQuestionnaires(): Promise<Questionnaire []> {
  const response = await axios.get('/api/questionnaires');
  return response.data;
}
