import axios from 'axios';
import { GetQuestionnaires } from '../../shared/responses/GetQuestionnaires';

export default async function getQuestionnaires(): Promise<GetQuestionnaires> {
  const response = await axios.get('/questionnaires');
  return response.data;
}
