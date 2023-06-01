import axios from 'axios';
import { GetQuestionnaires } from '../../shared/responses/GetQuestionnaires';

export default async function getQuestionnaires(): Promise<GetQuestionnaires> {
  const response = await axios.get('http://localhost:3100/questionnaires');
  return response.data;
}
