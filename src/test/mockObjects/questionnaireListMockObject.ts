import { Questionnaire } from 'blaise-api-node-client';
import { QuestionnaireDetails } from '../../common/interfaces/surveyInterface';

export const questionnaire1Mock: Questionnaire = {
  name: 'LMS2101_AA1',
  serverParkName: 'gusty',
  installDate: '2021-01-15T15:26:43.4233454+00:00',
  status: 'Active',
  dataRecordCount: 3,
  hasData: false,
  active: false,
};

export const questionnaire2Mock: Questionnaire = {
  name: 'LMS2101_AB1',
  serverParkName: 'gusty',
  installDate: '2021-02-15T15:26:43.4233454+00:00',
  status: 'Active',
  dataRecordCount: 1,
  hasData: false,
  active: false,
};

export const questionnaire3Mock: Questionnaire = {
  name: 'LMS2101_AC1',
  serverParkName: 'gusty',
  installDate: '2021-03-15T15:26:43.4233454+00:00',
  status: 'Active',
  dataRecordCount: 0,
  hasData: false,
  active: false,
};

export const questionnaire4Mock: Questionnaire = {
  name: 'OPN2201A',
  serverParkName: 'gusty',
  installDate: '2021-04-15T15:26:43.4233454+00:00',
  status: 'Active',
  dataRecordCount: 3,
  hasData: false,
  active: false,
};

export const questionnaireListMockObject: Questionnaire[] = [
  questionnaire1Mock,
  questionnaire2Mock,
  questionnaire3Mock,
  questionnaire4Mock,
];

export const questionnaireDetails1MockObject: QuestionnaireDetails = {
  questionnaireName: questionnaire1Mock.name,
  numberOfCases: questionnaire1Mock.dataRecordCount ?? 0,
  numberOfCasesAllocated: 3,
};

export const questionnaireDetails2MockObject: QuestionnaireDetails = {
  questionnaireName: questionnaire2Mock.name,
  numberOfCases: questionnaire2Mock.dataRecordCount ?? 0,
  numberOfCasesAllocated: 1,
};

export const questionnaireDetails3MockObject: QuestionnaireDetails = {
  questionnaireName: questionnaire3Mock.name,
  numberOfCases: questionnaire3Mock.dataRecordCount ?? 0,
  numberOfCasesAllocated: 0,
};

export const questionnaireDetails4MockObject: QuestionnaireDetails = {
  questionnaireName: questionnaire4Mock.name,
  numberOfCases: questionnaire4Mock.dataRecordCount ?? 0,
  numberOfCasesAllocated: 3,
};

export const questionnaireDetailsListMockObject: QuestionnaireDetails[] = [
  questionnaireDetails1MockObject,
  questionnaireDetails2MockObject,
  questionnaireDetails3MockObject,
  questionnaireDetails4MockObject,
];
