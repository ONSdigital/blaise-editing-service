import { CaseData, Questionnaire } from 'blaise-api-node-client';
import mapQuestionnaireDetails from '../../../server/mappers/questionnaireMapper';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';

describe('Map a list of questionnaires and reports to a questionnaire allocation list', () => {
  it('It should return a correctly mapped list of questionnaires', () => {
    // arrange
    const username: string = 'toby';

    const questionnaire: Questionnaire = {
      name: 'LMS2101_AA1',
      serverParkName: 'gusty',
      installDate: '2021-01-15T15:26:43.4233454+00:00',
      status: 'Active',
      dataRecordCount: 3,
      hasData: false,
      active: false,
    };

    const caseData: CaseData[] = [
      {
        'qserial.serial_number': '9001',
        'qhadmin.hout': 110,
        'allocation.toeditor': 'jakew',
      },
      {
        'qserial.serial_number': '9002',
        'qhadmin.hout': 210,
        'allocation.toeditor': username,
      },
      {
        'qserial.serial_number': '9003',
        'qhadmin.hout': 210,
        'allocation.toeditor': '',
      },
    ];

    const expectedQuestionnaireDetails: QuestionnaireDetails = {
      questionnaireName: questionnaire.name,
      numberOfCases: questionnaire.dataRecordCount ?? 0,
      numberOfCasesAllocated: 2,
    };

    // act
    const result = mapQuestionnaireDetails(questionnaire, caseData);

    // assert
    expect(result).toEqual(expectedQuestionnaireDetails);
  });

  it('It should return a correctly mapped list of questionnaires when there are no cases', () => {
    // arrange
    const questionnaire: Questionnaire = {
      name: 'LMS2101_AA1',
      serverParkName: 'gusty',
      installDate: '2021-01-15T15:26:43.4233454+00:00',
      status: 'Active',
      dataRecordCount: 0,
      hasData: false,
      active: false,
    };

    const caseData: CaseData[] = [];

    const expectedQuestionnaireDetails: QuestionnaireDetails = {
      questionnaireName: questionnaire.name,
      numberOfCases: questionnaire.dataRecordCount ?? 0,
      numberOfCasesAllocated: 0,
    };

    // act
    const result = mapQuestionnaireDetails(questionnaire, caseData);

    // assert
    expect(result).toEqual(expectedQuestionnaireDetails);
  });
});
