import { CaseOutcome, EditedStatus } from "blaise-api-node-client";
import { Organisation } from "blaise-api-node-client";

import mapSupervisorInformaiton from "./supervisorInformationMapper";

import type { SupervisorInformation } from "../types/supervisor.types";
import type { CaseEditInformation } from "blaise-api-node-client";

describe("Map editor informaiton", () => {
  const editors = [
    {
      name: "Dave",
      role: "SVT Editor",
      serverParks: ["gusty"],
      defaultServerPark: "gusty",
    },
    {
      name: "Malcom",
      role: "SVT Editor",
      serverParks: ["gusty"],
      defaultServerPark: "gusty",
    },
    {
      name: "Rich",
      role: "SVT Editor",
      serverParks: ["gusty"],
      defaultServerPark: "gusty",
    },
  ];

  it("It should return a correctly mapped editor information given all details are present", () => {
    const caseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001012",
        outcome: CaseOutcome.Completed,
        assignedTo: "Dave",
        interviewer: "",
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001013",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001013",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly",
      },
    ];

    const expectedSupervisorInformaiton: SupervisorInformation = {
      TotalNumberOfCases: 3,
      NumberOfCasesNotAllocated: 0,
      NumberOfCasesAllocated: 3,
      NumberOfCasesCompleted: 0,
      EditorInformation: [
        {
          EditorName: "Dave",
          NumberOfCasesAllocated: 1,
          NumberOfCasesCompleted: 0,
          NumberOfCasesQueried: 1,
        },
        {
          EditorName: "Malcom",
          NumberOfCasesAllocated: 0,
          NumberOfCasesCompleted: 0,
          NumberOfCasesQueried: 0,
        },
        {
          EditorName: "Rich",
          NumberOfCasesAllocated: 2,
          NumberOfCasesCompleted: 0,
          NumberOfCasesQueried: 0,
        },
      ],
    };

    const result = mapSupervisorInformaiton(caseEditInformationList, editors);

    expect(result).toEqual(expectedSupervisorInformaiton);
  });

  it("It should return a correctly mapped editor informaiton given some cases are unallocated", () => {
    const caseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001012",
        outcome: CaseOutcome.Completed,
        assignedTo: "Dave",
        interviewer: "",
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001013",
        outcome: CaseOutcome.Completed,
        assignedTo: "",
        interviewer: "",
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001013",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly",
      },
    ];

    const expectedSupervisorInformaiton: SupervisorInformation = {
      TotalNumberOfCases: 3,
      NumberOfCasesNotAllocated: 1,
      NumberOfCasesAllocated: 2,
      NumberOfCasesCompleted: 0,
      EditorInformation: [
        {
          EditorName: "Dave",
          NumberOfCasesAllocated: 1,
          NumberOfCasesCompleted: 0,
          NumberOfCasesQueried: 1,
        },
        {
          EditorName: "Malcom",
          NumberOfCasesAllocated: 0,
          NumberOfCasesCompleted: 0,
          NumberOfCasesQueried: 0,
        },
        {
          EditorName: "Rich",
          NumberOfCasesAllocated: 1,
          NumberOfCasesCompleted: 0,
          NumberOfCasesQueried: 0,
        },
      ],
    };

    const result = mapSupervisorInformaiton(caseEditInformationList, editors);

    expect(result).toEqual(expectedSupervisorInformaiton);
  });
});
