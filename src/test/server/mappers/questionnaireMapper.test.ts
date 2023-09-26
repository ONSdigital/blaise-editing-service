import mapQuestionnaireAllocation from '../../../server/mappers/questionnaireMapper';
import { questionnaire2Mock, questionnaireCaseDetailsListMockObject, questionnaireListMockObject } from '../../mockObjects/questionnaireListMockObject';
import { questionnaireReportMockObjectList } from '../../mockObjects/questionnaireReportMockObjects';

describe('Map a list o questionnaires and reports to a questionnaire allocation list', () => {
  it('It should return a correctly mapped list of questionnaires with allocation details', () => {
    // act
    const result = mapQuestionnaireAllocation(questionnaireListMockObject, questionnaireReportMockObjectList);

    // assert
    expect(result).toEqual(questionnaireCaseDetailsListMockObject);
  });

  it.each(['', ' ', '     ', null, undefined])('It should handle multiple diffrent scenarios where a case has not been allocated', (value) => {
    // arrange
    const report = questionnaireReportMockObjectList.find((r) => r.questionnaireName === questionnaire2Mock.name);
    report!.reportingData[0] = { 'allocation.toeditor': value };

    // act
    const result = mapQuestionnaireAllocation(questionnaireListMockObject, questionnaireReportMockObjectList);

    // assert
    expect(result).toEqual(questionnaireCaseDetailsListMockObject);
  });
});
