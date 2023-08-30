import { Questionnaire } from 'blaise-api-node-client';
import { Survey } from '../../../common/interfaces/surveyInterface';
import mapSurveys from '../../../server/mappers/surveyMapper';
import surveyListMockObject from '../../mockObjects/surveyListMockObject';
import questionnaireListMockObject from '../../mockObjects/questionnaireListMockObject';

describe('Map questionnaire list to survey list', () => {
  it('Should map a list of questionnaires to an expected list of surveys', () => {
    // arrange
    const questionnaires: Questionnaire[] = questionnaireListMockObject;
    const expectedSurveys: Survey[] = surveyListMockObject;

    // act
    const surveys = mapSurveys(questionnaires);

    // assert
    expect(surveys).toEqual(expectedSurveys);
  });
});
