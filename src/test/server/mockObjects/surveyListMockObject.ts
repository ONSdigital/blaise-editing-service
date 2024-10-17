import { Survey } from '../../../common/interfaces/surveyInterface';
import { frsQuestionnaireDetails1MockObject, frsQuestionnaireDetails2MockObject } from './questionnaireListMockObject';

const surveyListMockObject: Survey[] = [
  {
    name: 'FRS',
    questionnaires:
  [frsQuestionnaireDetails1MockObject, frsQuestionnaireDetails2MockObject],
  },
];

export default surveyListMockObject;
