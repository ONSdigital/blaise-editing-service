import { QuestionnaireDetails, Survey } from '../../../common/interfaces/surveyInterface';
import mapSurveys from '../../../server/mappers/surveyMapper';
import {
  frsQuestionnaireDetails1MockObject, frsQuestionnaireDetails2MockObject, lmsQuestionnaireDetailsMockObject, opnQuestionnaireDetailsMockObject,
} from '../mockObjects/questionnaireListMockObject';

describe('Map questionnaire list to survey list', () => {
  it('Should return expected list of surveys', () => {
    // arrange
    const questionnaireDetailsList = [
      lmsQuestionnaireDetailsMockObject,
      frsQuestionnaireDetails1MockObject,
      frsQuestionnaireDetails2MockObject,
      opnQuestionnaireDetailsMockObject,
    ];

    const expectedSurveys = [
      {
        name: 'LMS',
        questionnaires:
      [lmsQuestionnaireDetailsMockObject],
      },
      {
        name: 'FRS',
        questionnaires:
      [frsQuestionnaireDetails1MockObject, frsQuestionnaireDetails2MockObject],
      },
      {
        name: 'OPN',
        questionnaires:
      [opnQuestionnaireDetailsMockObject],
      },
    ];

    // act
    const surveys = mapSurveys(questionnaireDetailsList);

    // assert
    expect(surveys).toEqual(expectedSurveys);
  });

  it('Should return an empty list if no surveys are found', () => {
    // arrange
    const questionnaireDetailsList: QuestionnaireDetails[] = [];

    const expectedSurveys: Survey[] = [];

    // act
    const surveys = mapSurveys(questionnaireDetailsList);

    // assert
    expect(surveys).toEqual(expectedSurveys);
  });
});
