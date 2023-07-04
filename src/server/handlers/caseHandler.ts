import BlaiseApiClient, { CaseStatus } from 'blaise-api-node-client';
import { Request, Response } from 'express';

export default class CaseHandler {
  blaiseApiClient: BlaiseApiClient;

  constructor(blaiseApiClient: BlaiseApiClient) {
    this.blaiseApiClient = blaiseApiClient;
    this.getStatusOfCases = this.getStatusOfCases.bind(this);
  }

  async getStatusOfCases(request: Request, response: Response<CaseStatus[]>) {
    const { questionnaireName } = request.params;

    if (typeof questionnaireName !== 'string') {
      throw new Error('Questionnaire name has not been provided');
    }

    const cases = await this.blaiseApiClient.getCaseStatus('gusty', questionnaireName);

    return response.status(200).json(cases);
  }
}
