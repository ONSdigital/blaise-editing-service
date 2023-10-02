import mapSurveys from '../../../server/mappers/surveyMapper';

describe('Map questionnaire list to survey list', () => {
  it('Should map a list of questionnaires to an expected list of surveys', () => {
    // arrange
    const questionnaireDetailsList = [
      {
        questionnaireName: 'LMS2101_AA1',
        numberOfCases: 3,
        numberOfCasesAllocated: 3,
      },
      {
        questionnaireName: 'LMS2101_AB1',
        numberOfCases: 1,
        numberOfCasesAllocated: 1,
      },
      {
        questionnaireName: 'LMS2101_AC1',
        numberOfCases: 0,
        numberOfCasesAllocated: 0,
      },
      {
        questionnaireName: 'OPN2201A',
        numberOfCases: 3,
        numberOfCasesAllocated: 3,
      },
    ];

    const expectedSurveys = [
      {
        name: 'LMS',
        questionnaires:
      [{
        questionnaireName: 'LMS2101_AA1',
        numberOfCases: 3,
        numberOfCasesAllocated: 3,
      },
      {
        questionnaireName: 'LMS2101_AB1',
        numberOfCases: 1,
        numberOfCasesAllocated: 1,
      },
      {
        questionnaireName: 'LMS2101_AC1',
        numberOfCases: 0,
        numberOfCasesAllocated: 0,
      }],
      },
      {
        name: 'OPN',
        questionnaires: [{
          questionnaireName: 'OPN2201A',
          numberOfCases: 3,
          numberOfCasesAllocated: 3,
        }],
      },
    ];

    // act
    const surveys = mapSurveys(questionnaireDetailsList);

    // assert
    expect(surveys).toEqual(expectedSurveys);
  });
});
