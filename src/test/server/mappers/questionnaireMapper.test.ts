import { Questionnaire } from 'blaise-api-node-client';
import mapQuestionnaireDetails from '../../../server/mappers/questionnaireMapper';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';

describe('Map a questionnaire', () => {
  it('It should return a correctly mapped questionnaire given all details are present', () => {
    // arrange

    const questionnaire: Questionnaire = {
      name: 'FRS2504A_EDIT',
      serverParkName: 'gusty',
      installDate: '2021-01-15T15:26:43.4233454+00:00',
      fieldPeriod: '2021-01-01T00:00:00',
      surveyTla: 'LMS',
      dataRecordCount: 3,
      hasData: true,
      active: true,
    };

    const expectedQuestionnaireDetails: QuestionnaireDetails = {
      questionnaireName: 'FRS2504A_EDIT',
      numberOfCases: 3,
      fieldPeriod: 'January 2021',
      surveyTla: 'LMS',
    };

    // act
    const result = mapQuestionnaireDetails(questionnaire);

    // assert
    expect(result).toEqual(expectedQuestionnaireDetails);
  });

  it('It should return a correctly mapped questionnaire given some details are missing', () => {
    // arrange

    const questionnaire: Questionnaire = {
      name: 'FRS2504A_EDIT',
      serverParkName: 'gusty',
      installDate: '2021-01-15T15:26:43.4233454+00:00',
      hasData: false,
      active: true,
    };

    const expectedQuestionnaireDetails: QuestionnaireDetails = {
      questionnaireName: 'FRS2504A_EDIT',
      numberOfCases: 0,
      fieldPeriod: 'N/A',
      surveyTla: 'N/A',
    };

    // act
    const result = mapQuestionnaireDetails(questionnaire);

    // assert
    expect(result).toEqual(expectedQuestionnaireDetails);
  });
});
