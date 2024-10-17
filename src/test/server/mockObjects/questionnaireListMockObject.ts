import { Questionnaire } from 'blaise-api-node-client';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';

export const lmsQuestionnaire1Mock: Questionnaire = {
  name: 'LMS2101_AA1_EDIT',
  serverParkName: 'gusty',
  installDate: '2021-01-15T15:26:43.4233454+00:00',
  fieldPeriod: '2021-01-01T00:00:00',
  surveyTla: 'LMS',
  status: 'Active',
  dataRecordCount: 3,
  hasData: false,
  active: false,
};

export const frsQuestionnaire1Mock: Questionnaire = {
  name: 'FRS2408B_EDIT',
  serverParkName: 'gusty',
  installDate: '2021-03-15T15:26:43.4233454+00:00',
  fieldPeriod: '2024-08-01T00:00:00',
  surveyTla: 'FRS',
  status: 'Active',
  dataRecordCount: 0,
  hasData: false,
  active: false,
};
export const frsQuestionnaire2Mock: Questionnaire = {
  name: 'FRS2504A_EDIT',
  serverParkName: 'gusty',
  installDate: '2021-02-15T15:26:43.4233454+00:00',
  fieldPeriod: '2025-04-01T00:00:00',
  surveyTla: 'FRS',
  status: 'Active',
  dataRecordCount: 1,
  hasData: false,
  active: false,
};

export const opnQuestionnaireMock: Questionnaire = {
  name: 'OPN2201A_EDIT',
  serverParkName: 'gusty',
  installDate: '2022-04-15T15:26:43.4233454+00:00',
  fieldPeriod: '2022-01-01T00:00:00',
  surveyTla: 'OPN',
  status: 'Active',
  dataRecordCount: 3,
  hasData: false,
  active: false,
};

export const questionnaireListMockObject: Questionnaire[] = [
  lmsQuestionnaire1Mock,
  frsQuestionnaire1Mock,
  frsQuestionnaire2Mock,
  opnQuestionnaireMock,
];

export const lmsQuestionnaireDetailsMockObject: QuestionnaireDetails = {
  questionnaireName: 'LMS2101_AA1_EDIT',
  numberOfCases: 3,
  fieldPeriod: 'January 2021',
  surveyTla: 'LMS',
};

export const frsQuestionnaireDetails1MockObject: QuestionnaireDetails = {
  questionnaireName: 'FRS2408B_EDIT',
  numberOfCases: 0,
  fieldPeriod: 'August 2024',
  surveyTla: 'FRS',
};

export const frsQuestionnaireDetails2MockObject: QuestionnaireDetails = {
  questionnaireName: 'FRS2504A_EDIT',
  numberOfCases: 1,
  fieldPeriod: 'April 2025',
  surveyTla: 'FRS',
};

export const opnQuestionnaireDetailsMockObject: QuestionnaireDetails = {
  questionnaireName: 'OPN2201A_EDIT',
  numberOfCases: 3,
  fieldPeriod: 'January 2022',
  surveyTla: 'OPN',
};

export const questionnaireDetailsListMockObject: QuestionnaireDetails[] = [
  lmsQuestionnaireDetailsMockObject,
  frsQuestionnaireDetails1MockObject,
  frsQuestionnaireDetails2MockObject,
  opnQuestionnaireDetailsMockObject,
];
