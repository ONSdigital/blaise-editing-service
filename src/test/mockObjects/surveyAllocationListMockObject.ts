import { Survey } from '../../common/interfaces/surveyInterface';
import {
  questionnaireCaseDetails1MockObject, questionnaireCaseDetails2MockObject, questionnaireCaseDetails3MockObject, questionnaireCaseDetails4MockObject,
} from './questionnaireListMockObject';

const surveyListMockObject: Survey[] = [{
  name: 'LMS',
  questionnaires: [
    questionnaireCaseDetails1MockObject,
    questionnaireCaseDetails2MockObject,
    questionnaireCaseDetails3MockObject,
  ],
},
{
  name: 'OPN',
  questionnaires: [
    questionnaireCaseDetails4MockObject,
  ],
}];

export default surveyListMockObject;
