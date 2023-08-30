import { Questionnaire } from 'blaise-api-node-client';

export interface Survey {
  name: string,
  questionnaires: Questionnaire[],
}
