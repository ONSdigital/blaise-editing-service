import { AllocationDetails } from '../../../common/interfaces/allocationInterface';

const AllocationMockObject: AllocationDetails = {
  Editors: [{
    Name: 'Dave',
    Cases: [],
  },
  {
    Name: 'Jake',
    Cases: ['10001012', '10001015'],
  },
  {
    Name: 'Rich',
    Cases: [],
  },
  ],
  Interviewers: [{
    Name: 'bob',
    Cases: ['10001011', '10001014'],
  },
  {
    Name: 'jamester',
    Cases: ['10001013'],
  },
  ],
};

export default AllocationMockObject;
