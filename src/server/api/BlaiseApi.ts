import BlaiseClient, { CaseResponse, CaseStatus } from 'blaise-api-node-client';
import { Configuration } from '../interfaces/configurationInterface';
import { QuestionnaireAllocation } from '../../common/interfaces/surveyInterface';

export default class BlaiseApi {
  config: Configuration;

  blaiseApiClient: BlaiseClient;

  constructor(config: Configuration, blaiseApiClient: BlaiseClient) {
    this.config = config;
    this.blaiseApiClient = blaiseApiClient;
    this.getCaseStatus = this.getCaseStatus.bind(this);
    this.getCaseStatus = this.getCaseStatus.bind(this);
    this.getQuestionnairesWithAllocation = this.getQuestionnairesWithAllocation.bind(this);
  }

  async getCaseStatus(questionnaireName: string): Promise<CaseStatus[]> {
    return this.blaiseApiClient.getCaseStatus(this.config.ServerPark, questionnaireName);
  }

  async getCase(questionnaireName: string, caseId: string): Promise<CaseResponse> {
    return this.blaiseApiClient.getCase(this.config.ServerPark, questionnaireName, caseId);
  }

  /* eslint no-restricted-syntax: ["off", "ForOfStatement"] */
  /* eslint no-await-in-loop: 0 */

  async getQuestionnairesWithAllocation(): Promise<QuestionnaireAllocation[]> {
    const questionnairesWithAllocation:QuestionnaireAllocation[] = [];
    const questionnaires = await this.blaiseApiClient.getQuestionnaires(this.config.ServerPark);
    const allocationFieldIds = ['allocation.toeditor'];

    for (const questionnaire of questionnaires) {
      const questionaireWithAllocation :QuestionnaireAllocation = questionnaire;
      const reportData = await this.blaiseApiClient.getQuestionnaireReportData(this.config.ServerPark, questionnaire.name, allocationFieldIds);

      questionaireWithAllocation.caseAllocation = reportData.reportingData;
      questionnairesWithAllocation.push(questionaireWithAllocation);
    }

    return questionnairesWithAllocation;
  }
}