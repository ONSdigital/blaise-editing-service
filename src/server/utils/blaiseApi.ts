import toQuestionnaireDetails from "./questionnaireMapper.js";

import type { QuestionnaireDetails } from "../../common/types/survey.types.js";
import type { ServerConfiguration } from "../serverConfiguration.js";
import type {
  BlaiseApiClient,
  CaseEditInformation,
  CaseResponse,
  Questionnaire,
  User,
} from "blaise-api-node-client";

export default class BlaiseApi {
  config: ServerConfiguration;

  blaiseApiClient: BlaiseApiClient;

  constructor(config: ServerConfiguration, blaiseApiClient: BlaiseApiClient) {
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

    questionnaires.forEach((questionnaire: Questionnaire) => {
      questionnaireDetailsList.push(toQuestionnaireDetails(questionnaire));
    });

    return questionnaireDetailsList;
  }

  async getCase(questionnaireName: string, caseId: string): Promise<CaseResponse> {
    const response = await this.blaiseApiClient.getCase(
      this.config.ServerPark,
      questionnaireName,
      caseId,
    );

    return response;
  }

  async updateCase(
    questionnaireName: string,
    caseId: string,
    caseFields: Record<string, string | number>,
  ): Promise<void> {
    await this.blaiseApiClient.updateCase(
      this.config.ServerPark,
      questionnaireName,
      caseId,
      caseFields,
    );
  }

  async getCaseEditInformation(questionnaireName: string): Promise<CaseEditInformation[]> {
    const caseEditInformationList = await this.blaiseApiClient.getCaseEditInformation(
      this.config.ServerPark,
      questionnaireName,
    );

    (
      caseEditInformationList as (CaseEditInformation & {
        editUrl?: string;
        readOnlyUrl?: string;
      })[]
    ).forEach((caseEditInformation) => {
      const editUrl = `https://${this.config.ExternalWebUrl}/${questionnaireName}?KeyValue=${caseEditInformation.primaryKey}`;

      caseEditInformation.editUrl = editUrl;
      caseEditInformation.readOnlyUrl = `${editUrl}&DataEntrySettings=ReadOnly`;
    });

    return caseEditInformationList as (CaseEditInformation & {
      editUrl: string;
      readOnlyUrl: string;
    })[];
  }

  async getUsers(): Promise<User[]> {
    const users = await this.blaiseApiClient.getUsers();

    return [...users];
  }
}
