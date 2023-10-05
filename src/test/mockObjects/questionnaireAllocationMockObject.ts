import QuestionnaireAllocationDetails from '../../common/interfaces/questionnaireAllocationInterface';
import { AllocationDetails } from '../../common/interfaces/surveyInterface';

export const questionnaireAllocationMockObject: QuestionnaireAllocationDetails = {
  name: 'LMS2101_AA1',
  allocation: [{
    editor: 'Toby Maguire',
    cases: ['90001', '90002', '90003', '90004'],
  },
  {
    editor: 'Richmond Ricecake',
    cases: ['90005', '90006'],
  },
  ],
};

export const allocationDetailsMockObject: AllocationDetails = {
  questionnaireName: 'LMS2101_AA1',
  numberOfCases: 900,
  numberOfCasesAllocated: 100,
  casesAllocated: [],
  casesNotAllocated: [],
};
