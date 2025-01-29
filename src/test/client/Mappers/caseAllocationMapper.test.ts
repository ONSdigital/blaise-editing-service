import { CaseEditInformation } from 'blaise-api-node-client/lib/cjs/interfaces/case';
import CaseOutcome from 'blaise-api-node-client/lib/cjs/enums/caseOutcome';
import EditedStatus from 'blaise-api-node-client/lib/cjs/enums/editedStatus';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import mapAllocationDetails from '../../../client/Mappers/caseAllocationMapper';
import { AllocationDetails } from '../../../common/interfaces/allocationInterface';

describe('Map cases not allocated informaiton', () => {
  it('It should return a correctly mapped cases not allocated model given all details are present', () => {
    // arrange

    const caseEditInformationList: CaseEditInformation[] = [{
      primaryKey: '10001011',
      outcome: CaseOutcome.Completed,
      assignedTo: '',
      interviewer: 'bobw',
      editedStatus: EditedStatus.NotStarted,
      organisation: Organisation.ONS,
      editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
      readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
    },
    {
      primaryKey: '10001012',
      outcome: CaseOutcome.Completed,
      assignedTo: 'Jake',
      interviewer: 'jamester',
      editedStatus: EditedStatus.NotStarted,
      organisation: Organisation.ONS,
      editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
      readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
    },
    {
      primaryKey: '10001013',
      outcome: CaseOutcome.Completed,
      assignedTo: '',
      interviewer: 'jamester',
      editedStatus: EditedStatus.NotStarted,
      organisation: Organisation.ONS,
      editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
      readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly',
    },
    {
      primaryKey: '10001014',
      outcome: CaseOutcome.CompletedProxy,
      assignedTo: '',
      interviewer: 'bobw',
      editedStatus: EditedStatus.NotStarted,
      organisation: Organisation.ONS,
      editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
      readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
    },
    {
      primaryKey: '10001015',
      outcome: CaseOutcome.CompletedNudge,
      assignedTo: 'Jake',
      interviewer: 'jamester',
      editedStatus: EditedStatus.NotStarted,
      organisation: Organisation.ONS,
      editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
      readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly',
    },
    ];

    const editors = [{
      name: 'Dave',
      role: 'SVT Editor',
      serverParks: ['gusty'],
      defaultServerPark: 'gusty',
    },
    {
      name: 'Jake',
      role: 'SVT Editor',
      serverParks: ['gusty'],
      defaultServerPark: 'gusty',
    },
    {
      name: 'Rich',
      role: 'SVT Editor',
      serverParks: ['gusty'],
      defaultServerPark: 'gusty',
    }];

    const expectedResult: AllocationDetails = {
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
        Name: 'bobw',
        Cases: ['10001011', '10001014'],
      },
      {
        Name: 'jamester',
        Cases: ['10001013'],
      },
      ],
    };

    // act
    const result = mapAllocationDetails(caseEditInformationList, editors);

    // assert
    expect(result).toEqual(expectedResult);
  });
});
