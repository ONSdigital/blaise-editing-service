import {
  frsQuestionnaireDetailsMock1,
  frsQuestionnaireDetailsMock2,
} from "./questionnaireList.mock.js";

import type { Survey } from "../../common/types/survey.types.js";

const mockSurveyList: Survey[] = [
  {
    name: "FRS",
    questionnaires: [frsQuestionnaireDetailsMock1, frsQuestionnaireDetailsMock2],
  },
];

export default mockSurveyList;
