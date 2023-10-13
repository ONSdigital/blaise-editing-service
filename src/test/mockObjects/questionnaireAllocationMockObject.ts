import { AllocationDetails } from '../../common/interfaces/surveyInterface';

const allocationDetailsMockObject: AllocationDetails = {
  questionnaireName: 'LMS2101_AA1',
  numberOfCases: 900,
  numberOfCasesAllocated: 100,
  editorAllocationDetails: [{
    editor: 'Toby Maguire',
    cases: ['90001', '90002', '90003', '90004'],
  },
  {
    editor: 'Richmond Ricecake',
    cases: ['90005', '90006'],
  },
  ],
};

export default allocationDetailsMockObject;
