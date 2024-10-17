import { SupervisorInformation } from '../../../client/Interfaces/supervisorInterface';

export const SupervisorInformationMockObject1: SupervisorInformation = {
  TotalNumberOfCases: 1000,
  NumberOfCasesNotAllocated: 966,
  NumberOfCasesAllocated: 25,
  NumberOfCasesCompleted: 9,
  EditorInformation: [
    {
      EditorName: 'Doctor Doom',
      NumberOfCasesAllocated: 10,
      NumberOfCasesCompleted: 5,
      NumberOfCasesQueried: 0,
    },
    {
      EditorName: 'Doctor Strange',
      NumberOfCasesAllocated: 15,
      NumberOfCasesCompleted: 4,
      NumberOfCasesQueried: 1,
    },
    {
      EditorName: 'Doctor Who',
      NumberOfCasesAllocated: 0,
      NumberOfCasesCompleted: 0,
      NumberOfCasesQueried: 0,
    },
  ],
};

export const SupervisorInformationMockObject2: SupervisorInformation = {
  TotalNumberOfCases: 100,
  NumberOfCasesNotAllocated: 80,
  NumberOfCasesAllocated: 15,
  NumberOfCasesCompleted: 5,
  EditorInformation: [
    {
      EditorName: 'Iron Man',
      NumberOfCasesAllocated: 11,
      NumberOfCasesCompleted: 2,
      NumberOfCasesQueried: 1,
    },
    {
      EditorName: 'Captain America',
      NumberOfCasesAllocated: 4,
      NumberOfCasesCompleted: 3,
      NumberOfCasesQueried: 0,
    },
    {
      EditorName: 'The Hulk',
      NumberOfCasesAllocated: 0,
      NumberOfCasesCompleted: 0,
      NumberOfCasesQueried: 0,
    },
  ],
};
