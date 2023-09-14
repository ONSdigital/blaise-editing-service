import QuestionnaireAllocationDetails from '../../common/interfaces/questionnaireAllocationInterface';

const questionnaireAllocationMockObject: QuestionnaireAllocationDetails = {
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

export default questionnaireAllocationMockObject;
