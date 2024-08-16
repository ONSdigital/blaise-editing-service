import { CaseEditInformation, CaseOutcome, EditedStatus } from 'blaise-api-node-client';
import mapSupervisorInformaiton from '../../../client/Mappers/supervisorInformationMapper';
import { SupervisorInformation } from '../../../client/Interfaces/supervisorInterface';

describe('Map editor informaiton', () => {
  const editors = [{
    name: 'Dave',
    role: 'SVT_Editor',
    serverParks: ['gusty'],
    defaultServerPark: 'gusty',
  },
  {
    name: 'Malcom',
    role: 'SVT_Editor',
    serverParks: ['gusty'],
    defaultServerPark: 'gusty',
  },
  {
    name: 'Rich',
    role: 'SVT_Editor',
    serverParks: ['gusty'],
    defaultServerPark: 'gusty',
  }];

  it('It should return a correctly mapped editor information given all details are present', () => {
    // arrange

    const caseEditInformationList: CaseEditInformation[] = [{
      primaryKey: '10001011',
      outcome: CaseOutcome.Completed,
      assignedTo: 'Rich',
      editedStatus: EditedStatus.NotStarted,
      interviewer: '',
    },
    {
      primaryKey: '10001012',
      outcome: CaseOutcome.Completed,
      assignedTo: 'Dave',
      editedStatus: EditedStatus.Query,
      interviewer: '',
    },
    {
      primaryKey: '10001013',
      outcome: CaseOutcome.Completed,
      assignedTo: 'Rich',
      editedStatus: EditedStatus.Started,
      interviewer: '',
    },
    ];

    const expectedSupervisorInformaiton: SupervisorInformation = {
      TotalNumberOfCases: 3,
      NumberOfCasesNotAllocated: 0,
      NumberOfCasesAllocated: 3,
      NumberOfCasesCompleted: 0,
      EditorInformation: [{
        EditorName: 'Dave',
        NumberOfCasesAllocated: 1,
        NumberOfCasesCompleted: 0,
        NumberOfCasesQueried: 1,
      },
      {
        EditorName: 'Malcom',
        NumberOfCasesAllocated: 0,
        NumberOfCasesCompleted: 0,
        NumberOfCasesQueried: 0,
      },
      {
        EditorName: 'Rich',
        NumberOfCasesAllocated: 2,
        NumberOfCasesCompleted: 0,
        NumberOfCasesQueried: 0,
      },
      ],
    };

    // act
    const result = mapSupervisorInformaiton(caseEditInformationList, editors);

    // assert
    expect(result).toEqual(expectedSupervisorInformaiton);
  });

  it('It should return a correctly mapped editor informaiton given some cases are unallocated', () => {
    // arrange

    const caseEditInformationList: CaseEditInformation[] = [{
      primaryKey: '10001011',
      outcome: CaseOutcome.Completed,
      assignedTo: 'Rich',
      editedStatus: EditedStatus.NotStarted,
      interviewer: '',
    },
    {
      primaryKey: '10001012',
      outcome: CaseOutcome.Completed,
      assignedTo: 'Dave',
      editedStatus: EditedStatus.Query,
      interviewer: '',
    },
    {
      primaryKey: '10001013',
      outcome: CaseOutcome.Completed,
      assignedTo: '',
      editedStatus: EditedStatus.NotStarted,
      interviewer: '',
    },
    ];

    const expectedSupervisorInformaiton: SupervisorInformation = {
      TotalNumberOfCases: 3,
      NumberOfCasesNotAllocated: 1,
      NumberOfCasesAllocated: 2,
      NumberOfCasesCompleted: 0,
      EditorInformation: [{
        EditorName: 'Dave',
        NumberOfCasesAllocated: 1,
        NumberOfCasesCompleted: 0,
        NumberOfCasesQueried: 1,
      },
      {
        EditorName: 'Malcom',
        NumberOfCasesAllocated: 0,
        NumberOfCasesCompleted: 0,
        NumberOfCasesQueried: 0,
      },
      {
        EditorName: 'Rich',
        NumberOfCasesAllocated: 1,
        NumberOfCasesCompleted: 0,
        NumberOfCasesQueried: 0,
      },
      ],
    };

    // act
    const result = mapSupervisorInformaiton(caseEditInformationList, editors);

    // assert
    expect(result).toEqual(expectedSupervisorInformaiton);
  });
});