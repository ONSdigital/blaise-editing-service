import { Survey } from '../../common/interfaces/surveyInterface';

const surveyListMockObject: Survey[] = [{
  name: 'LMS',
  questionnaires: [
    {
      questionnaireName: 'LMS2101_AA1',
      numberOfCases: 5,
      numberOfCasesAllocated: 3,
    },
    {
      questionnaireName: 'LMS2101_AB1',
      numberOfCases: 15,
      numberOfCasesAllocated: 5,
    },
    {
      questionnaireName: 'LMS2101_AC1',
      numberOfCases: 7,
      numberOfCasesAllocated: 3,
    },

  ],
},
{
  name: 'OPN',
  questionnaires: [
    {
      questionnaireName: 'OPN2201A',
      numberOfCases: 24,
      numberOfCasesAllocated: 18,
    }],
}];

export default surveyListMockObject;
