import { Questionnaire } from 'blaise-api-node-client';
import { QuestionnaireCaseDetails } from '../../common/interfaces/surveyInterface';

export const questionnaire1Mock: Questionnaire = {
  name: 'LMS2101_AA1',
  serverParkName: 'gusty',
  installDate: '2021-01-15T15:26:43.4233454+00:00',
  status: 'Active',
  dataRecordCount: 2,
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

export const questionnaireCaseDetails1MockObject = {
  questionnaireName: questionnaire1Mock.name,
  numberOfCases: questionnaire1Mock.dataRecordCount ?? 0,
  numberOfCasesAllocated: 1,
};

export const questionnaireCaseDetails2MockObject = {
  questionnaireName: questionnaire2Mock.name,
  numberOfCases: questionnaire2Mock.dataRecordCount ?? 0,
  numberOfCasesAllocated: 0,
};

export const questionnaireCaseDetails3MockObject = {
  questionnaireName: questionnaire3Mock.name,
  numberOfCases: questionnaire3Mock.dataRecordCount ?? 0,
  numberOfCasesAllocated: 0,
};

export const questionnaireCaseDetails4MockObject = {
  questionnaireName: questionnaire4Mock.name,
  numberOfCases: questionnaire4Mock.dataRecordCount ?? 0,
  numberOfCasesAllocated: 3,
};

export const questionnaireCaseDetailsListMockObject: QuestionnaireCaseDetails[] = [
  questionnaireCaseDetails1MockObject,
  questionnaireCaseDetails2MockObject,
  questionnaireCaseDetails3MockObject,
  questionnaireCaseDetails4MockObject,
];
