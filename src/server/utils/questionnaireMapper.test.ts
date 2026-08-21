import toQuestionnaireDetails from "./questionnaireMapper.js";

import type { QuestionnaireDetails } from "../../common/types/survey.types.js";
import type { Questionnaire } from "blaise-api-node-client";

describe("Map a questionnaire", () => {
  it("It should return a correctly mapped questionnaire given all details are present", () => {
    const questionnaire: Questionnaire = {
      name: "FRS2504A_EDIT",
      serverParkName: "gusty",
      installDate: "2021-01-15T15:26:43.4233454+00:00",
      fieldPeriod: "2021-01-01T00:00:00",
      surveyTla: "LMS",
      dataRecordCount: 3,
      hasData: true,
    };

    const expectedQuestionnaireDetails: QuestionnaireDetails = {
      questionnaireName: "FRS2504A_EDIT",
      numberOfCases: 3,
      fieldPeriod: "January 2021",
      surveyTla: "LMS",
    };

    const result = toQuestionnaireDetails(questionnaire);

    expect(result).toEqual(expectedQuestionnaireDetails);
  });

  it("It should return a correctly mapped questionnaire given some details are missing", () => {
    const questionnaire: Questionnaire = {
      name: "FRS2504A_EDIT",
      serverParkName: "gusty",
      installDate: "2021-01-15T15:26:43.4233454+00:00",
      hasData: false,
    };

    const expectedQuestionnaireDetails: QuestionnaireDetails = {
      questionnaireName: "FRS2504A_EDIT",
      numberOfCases: 0,
      fieldPeriod: "N/A",
      surveyTla: "N/A",
    };

    const result = toQuestionnaireDetails(questionnaire);

    expect(result).toEqual(expectedQuestionnaireDetails);
  });
});
