import BlaiseClient, {
  CaseData,
  CaseEditInformation, CaseResponse, Questionnaire, User,
} from 'blaise-api-node-client';
import { ServerConfiguration } from '../interfaces/serverConfigurationInterface';
import { QuestionnaireDetails } from '../../common/interfaces/surveyInterface';
import mapQuestionnaireDetails from '../mappers/questionnaireMapper';

export default class BlaiseApi {
  config: ServerConfiguration;

  blaiseApiClient: BlaiseClient;

  constructor(config: ServerConfiguration, blaiseApiClient: BlaiseClient) {
    this.config = config;
    this.blaiseApiClient = blaiseApiClient;
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
    return this.blaiseApiClient.getCase(this.config.ServerPark, questionnaireName, caseId);
  }

  async updateCase(questionnaireName: string, caseId: string, caseFields: CaseData): Promise<void> {
    await this.blaiseApiClient.updateCase(this.config.ServerPark, questionnaireName, caseId, caseFields);
  }

  async getCaseEditInformation(questionnaireName: string): Promise<CaseEditInformation[]> {
    const caseEditInformationList = await this.blaiseApiClient.getCaseEditInformation(this.config.ServerPark, questionnaireName);

    caseEditInformationList.forEach((caseEditInformation) => {
      caseEditInformation.editUrl = `https://${this.config.ExternalWebUrl}/${questionnaireName}?KeyValue=${caseEditInformation.primaryKey}`;
    });

    return caseEditInformationList;
  }

  async getUsers(): Promise<User[]> {
    return this.blaiseApiClient.getUsers();
  }
}
