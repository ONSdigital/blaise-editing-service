import type { Survey } from "../../common/types/survey.types";

const mockFilteredSurveyList: Survey[] = [
  {
    name: "FRS",
    questionnaires: [
      {
        questionnaireName: "FRS2504A_EDIT",
        numberOfCases: 3,
        fieldPeriod: "April 2025",
        surveyTla: "FRS",
      },
      {
        questionnaireName: "FRS2505A_EDIT",
        numberOfCases: 1,
        fieldPeriod: "May 2025",
        surveyTla: "FRS",
      },
    ],
  },
];

export default mockFilteredSurveyList;
