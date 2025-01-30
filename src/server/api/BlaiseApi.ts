import BlaiseClient, {
  CaseData,
  CaseEditInformation, CaseResponse, Questionnaire, User,
} from 'blaise-api-node-client';
import { ServerConfiguration } from '../interfaces/serverConfigurationInterface';
import { QuestionnaireDetails } from '../../common/interfaces/surveyInterface';
import mapQuestionnaireDetails from '../mappers/questionnaireMapper';
import GoogleCloudLogger from '../logger/googleCloudLogger';

export default class BlaiseApi {
  config: ServerConfiguration;

  blaiseApiClient: BlaiseClient;

  cloudLogger: GoogleCloudLogger;

  constructor(config: ServerConfiguration, blaiseApiClient: BlaiseClient, cloudLogger: GoogleCloudLogger) {
    this.config = config;
    this.blaiseApiClient = blaiseApiClient;
    this.cloudLogger = cloudLogger;
    this.getQuestionnaires = this.getQuestionnaires.bind(this);
    this.getCase = this.getCase.bind(this);
    this.getCaseEditInformation = this.getCaseEditInformation.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.updateCase = this.updateCase.bind(this);
  }

  async getQuestionnaires(): Promise<QuestionnaireDetails[]> {
    try {
      const questionnaires = await this.blaiseApiClient.getQuestionnaires(this.config.ServerPark);

      const questionnaireDetailsList: QuestionnaireDetails[] = [];
      questionnaires.forEach((questionnaire : Questionnaire) => {
        questionnaireDetailsList.push(mapQuestionnaireDetails(questionnaire));
      });

      this.cloudLogger.info(`Retrieved ${questionnaireDetailsList.length} questionnaires`);
      return questionnaireDetailsList;
    } catch (error) {
      this.cloudLogger.error(`Failed to get questionnaires: ${error}`);
      throw error;
    }
  }

  async getCase(questionnaireName: string, caseId: string): Promise<CaseResponse> {
    try {
      const response = await this.blaiseApiClient.getCase(this.config.ServerPark, questionnaireName, caseId);
      this.cloudLogger.info(`Retrieved case ${caseId} for questionnaire ${questionnaireName}`);
      return response;
    } catch (error) {
      this.cloudLogger.error(`Failed to get case ${caseId} for questionnaire ${questionnaireName}: ${error}`);
      throw error;
    }
  }

  async updateCase(questionnaireName: string, caseId: string, caseFields: CaseData): Promise<void> {
    try {
      await this.blaiseApiClient.updateCase(this.config.ServerPark, questionnaireName, caseId, caseFields);
      this.cloudLogger.info(`Updated case ${caseId} for questionnaire ${questionnaireName}`);
      return;
    } catch (error) {
      this.cloudLogger.error(`Failed to update case ${caseId} for questionnaire ${questionnaireName}: ${error}`);
      throw error;
    }
  }

  async getCaseEditInformation(questionnaireName: string): Promise<CaseEditInformation[]> {
    try {
      const caseEditInformationList = await this.blaiseApiClient.getCaseEditInformation(this.config.ServerPark, questionnaireName);

      caseEditInformationList.forEach((caseEditInformation) => {
        const editUrl = `https://${this.config.ExternalWebUrl}/${questionnaireName}?KeyValue=${caseEditInformation.primaryKey}`;
        caseEditInformation.editUrl = editUrl;
        caseEditInformation.readOnlyUrl = `${editUrl}&DataEntrySettings=ReadOnly`;
      });

      this.cloudLogger.info(`Retrieved ${caseEditInformationList.length} case edit information for questionnaire ${questionnaireName}`);
      return caseEditInformationList;
    } catch (error) {
      this.cloudLogger.error(`Failed to get case edit information for questionnaire ${questionnaireName}: ${error}`);
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.blaiseApiClient.getUsers();
      this.cloudLogger.info(`Retrieved ${users.length} users`);
      return users;
    } catch (error) {
      this.cloudLogger.error(`Failed to get users: ${error}`);
      throw error;
    }
  }
}
