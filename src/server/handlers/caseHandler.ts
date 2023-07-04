import BlaiseApiClient, { CaseStatus } from 'blaise-api-node-client';
import { Request, Response } from 'express';

export default class CaseHandler {
  blaiseApiClient: BlaiseApiClient;

  constructor(blaiseApiClient: BlaiseApiClient) {
    this.blaiseApiClient = blaiseApiClient;
    this.getCases = this.getCases.bind(this);
  }

  async getCases(request: Request, response: Response<CaseStatus[]>) {
    console.debug('getcases');
    const { questionnaireName } = request.params;
    if (typeof questionnaireName !== 'string') {
      throw new Error('Questionnaire name has not been provided');
    }
    console.debug('questionnaireName = ', questionnaireName);
    const cases = await this.blaiseApiClient.getCaseStatus('gusty', questionnaireName);
    console.debug('cases = ', cases);
    return response.status(200).json(cases);
  }
}
