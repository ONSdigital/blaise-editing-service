import mapSurveys from '../../../server/mappers/surveyMapper';
import surveyListMockObject from '../../mockObjects/surveyAllocationListMockObject';
import { questionnaireCaseDetailsListMockObject } from '../../mockObjects/questionnaireListMockObject';

describe('Map questionnaire list to survey list', () => {
  it('Should map a list of questionnaires to an expected list of surveys', () => {
    // act
    const surveys = mapSurveys(questionnaireCaseDetailsListMockObject);

    // assert
    expect(surveys).toEqual(surveyListMockObject);
  });
});
