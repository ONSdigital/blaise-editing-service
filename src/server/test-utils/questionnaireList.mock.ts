import type { QuestionnaireDetails } from "../../common/types/survey.types.js";
import type { Questionnaire } from "blaise-api-node-client";

const mockLmsQuestionnaire1: Questionnaire = {
  name: "LMS2101_AA1_EDIT",
  serverParkName: "gusty",
  installDate: "2021-01-15T15:26:43.4233454+00:00",
  fieldPeriod: "2021-01-01T00:00:00",
  surveyTla: "LMS",
  status: "Active",
  dataRecordCount: 3,
  hasData: false,
};

const mockFrsQuestionnaire1: Questionnaire = {
  name: "FRS2408B_EDIT",
  serverParkName: "gusty",
  installDate: "2021-03-15T15:26:43.4233454+00:00",
  fieldPeriod: "2024-08-01T00:00:00",
  surveyTla: "FRS",
  status: "Active",
  dataRecordCount: 0,
  hasData: false,
};

const mockFrsQuestionnaire2: Questionnaire = {
  name: "FRS2504A_EDIT",
  serverParkName: "gusty",
  installDate: "2021-02-15T15:26:43.4233454+00:00",
  fieldPeriod: "2025-04-01T00:00:00",
  surveyTla: "FRS",
  status: "Active",
  dataRecordCount: 1,
  hasData: false,
};

const mockOpnQuestionnaire: Questionnaire = {
  name: "OPN2201A_EDIT",
  serverParkName: "gusty",
  installDate: "2022-04-15T15:26:43.4233454+00:00",
  fieldPeriod: "2022-01-01T00:00:00",
  surveyTla: "OPN",
  status: "Active",
  dataRecordCount: 3,
  hasData: false,
};

export const mockQuestionnaireList: Questionnaire[] = [
  mockLmsQuestionnaire1,
  mockFrsQuestionnaire1,
  mockFrsQuestionnaire2,
  mockOpnQuestionnaire,
];

export const mockLmsQuestionnaireDetails: QuestionnaireDetails = {
  questionnaireName: "LMS2101_AA1_EDIT",
  numberOfCases: 3,
  fieldPeriod: "January 2021",
  surveyTla: "LMS",
};

export const frsQuestionnaireDetailsMock1: QuestionnaireDetails = {
  questionnaireName: "FRS2408B_EDIT",
  numberOfCases: 0,
  fieldPeriod: "August 2024",
  surveyTla: "FRS",
};

export const frsQuestionnaireDetailsMock2: QuestionnaireDetails = {
  questionnaireName: "FRS2504A_EDIT",
  numberOfCases: 1,
  fieldPeriod: "April 2025",
  surveyTla: "FRS",
};

export const mockOpnQuestionnaireDetails: QuestionnaireDetails = {
  questionnaireName: "OPN2201A_EDIT",
  numberOfCases: 3,
  fieldPeriod: "January 2022",
  surveyTla: "OPN",
};
