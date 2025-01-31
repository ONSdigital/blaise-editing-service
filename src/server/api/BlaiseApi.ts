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
    const questionnaires = await this.blaiseApiClient.getQuestionnaires(this.config.ServerPark);

    const questionnaireDetailsList: QuestionnaireDetails[] = [];
    questionnaires.forEach((questionnaire : Questionnaire) => {
      questionnaireDetailsList.push(mapQuestionnaireDetails(questionnaire));
    });
    return questionnaireDetailsList;
  }

  async getCase(questionnaireName: string, caseId: string): Promise<CaseResponse> {
    const response = await this.blaiseApiClient.getCase(this.config.ServerPark, questionnaireName, caseId);
    return response;
  }

  async updateCase(questionnaireName: string, caseId: string, caseFields: CaseData): Promise<void> {
    await this.blaiseApiClient.updateCase(this.config.ServerPark, questionnaireName, caseId, caseFields);
  }

  async getCaseEditInformation(questionnaireName: string): Promise<CaseEditInformation[]> {
    const caseEditInformationList = await this.blaiseApiClient.getCaseEditInformation(this.config.ServerPark, questionnaireName);

    caseEditInformationList.forEach((caseEditInformation) => {
      const editUrl = `https://${this.config.ExternalWebUrl}/${questionnaireName}?KeyValue=${caseEditInformation.primaryKey}`;
      caseEditInformation.editUrl = editUrl;
      caseEditInformation.readOnlyUrl = `${editUrl}&DataEntrySettings=ReadOnly`;
    });

    this.cloudLogger.info(`Retrieved ${caseEditInformationList.length} case edit information for questionnaire ${questionnaireName}`);
    return caseEditInformationList;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.blaiseApiClient.getUsers();
    return users;
  }
}
