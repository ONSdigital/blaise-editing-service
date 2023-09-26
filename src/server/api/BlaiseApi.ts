import BlaiseClient, { QuestionnaireReport } from 'blaise-api-node-client';
import { Configuration } from '../interfaces/configurationInterface';
import mapQuestionnaireAllocation from '../mappers/questionnaireMapper';
import { mapCaseDetails, mapCaseFactsheet } from '../mappers/caseMapper';
import { CaseDetails, CaseFactsheetDetails } from '../../common/interfaces/caseInterface';
import { QuestionnaireCaseDetails } from '../../common/interfaces/surveyInterface';

export default class BlaiseApi {
  config: Configuration;

  blaiseApiClient: BlaiseClient;

  constructor(config: Configuration, blaiseApiClient: BlaiseClient) {
    this.config = config;
    this.blaiseApiClient = blaiseApiClient;
    this.getCaseDetails = this.getCaseDetails.bind(this);
    this.getCaseFactsheet = this.getCaseFactsheet.bind(this);
    this.getQuestionnaires = this.getQuestionnaires.bind(this);
    this.getCaseFieldsForQuestionnaires = this.getCaseFieldsForQuestionnaires.bind(this);
  }

  async getCaseDetails(questionnaireName: string): Promise<CaseDetails[]> {
    const caseStatusList = await this.blaiseApiClient.getCaseStatus(this.config.ServerPark, questionnaireName);
    const caseDetails = mapCaseDetails(caseStatusList, questionnaireName, this.config.ExternalWebUrl);

    return caseDetails;
  }

  async getCaseFactsheet(questionnaireName: string, caseId: string): Promise<CaseFactsheetDetails> {
    const caseResponse = await this.blaiseApiClient.getCase(this.config.ServerPark, questionnaireName, caseId);
    const casefactsheet = mapCaseFactsheet(caseResponse);

    return casefactsheet;
  }

  async getQuestionnaires(): Promise<QuestionnaireCaseDetails[]> {
    const allocationFieldIds = ['allocation.toeditor'];

    const questionnaires = await this.blaiseApiClient.getQuestionnaires(this.config.ServerPark);
    const questionnaireNames = questionnaires.map((q) => q.name);
    const questionnairesReportData = await this.getCaseFieldsForQuestionnaires(questionnaireNames, allocationFieldIds);

    return mapQuestionnaireAllocation(questionnaires, questionnairesReportData);
  }

  private async getCaseFieldsForQuestionnaires(questionnaireNames: string[], fieldIds:string[]): Promise<QuestionnaireReport[]> {
    const reports: Promise<QuestionnaireReport>[] = [];

    questionnaireNames.forEach((questionnaireName) => {
      reports.push(this.blaiseApiClient.getQuestionnaireReportData(this.config.ServerPark, questionnaireName, fieldIds));
    });

    return Promise.all(reports);
  }
}
