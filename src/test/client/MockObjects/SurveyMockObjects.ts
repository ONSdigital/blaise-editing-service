import { Survey } from '../../../common/interfaces/surveyInterface';

const FilteredSurveyListMockObject :Survey[] = [{
  name: 'FRS',
  questionnaires: [{
    questionnaireName: 'FRS2504A_EDIT',
    numberOfCases: 3,
    fieldPeriod: 'April 2025',
    surveyTla: 'FRS',
  },
  {
    questionnaireName: 'FRS2505A_EDIT',
    numberOfCases: 1,
    fieldPeriod: 'May 2025',
    surveyTla: 'FRS',
  }],
}];

export default FilteredSurveyListMockObject;
