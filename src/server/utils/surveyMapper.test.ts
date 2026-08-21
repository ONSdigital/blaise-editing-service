import {
  frsQuestionnaireDetailsMock1,
  frsQuestionnaireDetailsMock2,
  mockLmsQuestionnaireDetails,
  mockOpnQuestionnaireDetails,
} from "../test-utils/questionnaireList.mock.js";

import toSurveys from "./surveyMapper.js";

import type { QuestionnaireDetails, Survey } from "../../common/types/survey.types.js";

describe("Map questionnaire list to survey list", () => {
  it("Should return expected list of surveys", () => {
    const questionnaireDetailsList = [
      mockLmsQuestionnaireDetails,
      frsQuestionnaireDetailsMock1,
      frsQuestionnaireDetailsMock2,
      mockOpnQuestionnaireDetails,
    ];

    const expectedSurveys = [
      {
        name: "LMS",
        questionnaires: [mockLmsQuestionnaireDetails],
      },
      {
        name: "FRS",
        questionnaires: [frsQuestionnaireDetailsMock1, frsQuestionnaireDetailsMock2],
      },
      {
        name: "OPN",
        questionnaires: [mockOpnQuestionnaireDetails],
      },
    ];

    const surveys = toSurveys(questionnaireDetailsList);

    expect(surveys).toEqual(expectedSurveys);
  });

  it("Should return an empty list if no surveys are found", () => {
    const questionnaireDetailsList: QuestionnaireDetails[] = [];

    const expectedSurveys: Survey[] = [];

    const surveys = toSurveys(questionnaireDetailsList);

    expect(surveys).toEqual(expectedSurveys);
  });
});
