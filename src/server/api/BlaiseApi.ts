import BlaiseClient, { CaseData, Questionnaire, QuestionnaireReport } from 'blaise-api-node-client';
import { ServerConfiguration } from '../interfaces/serverConfigurationInterface';
import mapQuestionnaireDetails from '../mappers/questionnaireMapper';
import { mapCaseDetails, mapCaseFactsheet, mapEditorAllocationDetails } from '../mappers/caseMapper';
import { CaseDetails, CaseFactsheetDetails } from '../../common/interfaces/caseInterface';
import { AllocationDetails, EditorAllocationDetails, QuestionnaireDetails } from '../../common/interfaces/surveyInterface';
import CaseFields from '../../client/enums/CaseFields';

export default class BlaiseApi {
  config: ServerConfiguration;

  blaiseApiClient: BlaiseClient;

  constructor(config: ServerConfiguration, blaiseApiClient: BlaiseClient) {
    this.config = config;
    this.blaiseApiClient = blaiseApiClient;
    this.getCaseDetails = this.getCaseDetails.bind(this);
    this.getQuestionnaireDetails = this.getQuestionnaireDetails.bind(this);
    this.getCaseFactsheet = this.getCaseFactsheet.bind(this);
    this.getQuestionnaires = this.getQuestionnaires.bind(this);
    this.getCaseData = this.getCaseData.bind(this);
    this.getCaseFieldsForQuestionnaire = this.getCaseFieldsForQuestionnaire.bind(this);
    this.getQuestionnaireDetailsList = this.getQuestionnaireDetailsList.bind(this);
  }

  async getCaseDetails(questionnaireName: string, username?: string): Promise<CaseDetails[]> {
    const fieldIds: string[] = [CaseFields.Id, CaseFields.Status, CaseFields.AllocatedTo];
    const caseData = await this.getCaseData(questionnaireName, fieldIds, username);

    return mapCaseDetails(caseData, questionnaireName, this.config.ExternalWebUrl);
  }

  async getCaseFactsheet(questionnaireName: string, caseId: string): Promise<CaseFactsheetDetails> {
    const caseResponse = await this.blaiseApiClient.getCase(this.config.ServerPark, questionnaireName, caseId);
    const casefactsheet = mapCaseFactsheet(caseResponse);

    return casefactsheet;
  }

  async getQuestionnaires(username?: string): Promise<QuestionnaireDetails[]> {
    const questionnaires = await this.blaiseApiClient.getQuestionnaires(this.config.ServerPark);

    return this.getQuestionnaireDetailsList(questionnaires, username);
  }

  async getAllocationDetails(questionnaireName: string, username?: string): Promise<AllocationDetails> {
    const questionnaire = await this.blaiseApiClient.getQuestionnaire(this.config.ServerPark, questionnaireName);
    const fieldIds: string[] = [CaseFields.Id, CaseFields.AllocatedTo];

    const caseData = await this.getCaseData(questionnaireName, fieldIds, username);
    const questionaireDetails: QuestionnaireDetails = mapQuestionnaireDetails(questionnaire, caseData);
    const editorAllocationDetails: EditorAllocationDetails[] = mapEditorAllocationDetails(caseData);

    return {
      ...questionaireDetails,
      editorAllocationDetails,
    };
  }

  private async getCaseFieldsForQuestionnaire(questionnaireName: string, fieldIds: string[]): Promise<QuestionnaireReport> {
    return this.blaiseApiClient.getQuestionnaireReportData(this.config.ServerPark, questionnaireName, fieldIds);
  }

  private async getCaseData(questionnaireName: string, fieldIds: string[], username?: string): Promise<CaseData[]> {
    const questionnaireReportData = await this.getCaseFieldsForQuestionnaire(questionnaireName, fieldIds);
    const reportData = questionnaireReportData.reportingData;

    return !username
      ? reportData
      : reportData.filter((caseData) => caseData[CaseFields.AllocatedTo] === username);
  }

  async getQuestionnaireDetails(questionnaire: Questionnaire, username?: string): Promise<QuestionnaireDetails> {
    const fieldIds: string[] = [CaseFields.AllocatedTo];
    const caseData = await this.getCaseData(questionnaire.name, fieldIds, username);

    return mapQuestionnaireDetails(questionnaire, caseData);
  }

  private async getQuestionnaireDetailsList(questionnaires: Questionnaire[], username?: string): Promise<QuestionnaireDetails[]> {
    const reports: Promise<QuestionnaireDetails>[] = [];

    questionnaires.forEach((questionnaire) => {
      reports.push(this.getQuestionnaireDetails(questionnaire, username));
    });

    return Promise.all(reports);
  }
}
