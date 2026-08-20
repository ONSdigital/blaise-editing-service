import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { CaseOutcome, EditedStatus } from "blaise-api-node-client";
import { Organisation } from "blaise-api-node-client";

import { mockCaseSummaryDetails } from "../../server/test-utils/case.mock";
import mockSurveyList from "../../server/test-utils/surveyList.mock";
import UserRole from "../types/user.types";

import {
  getAllocationDetails,
  getCaseSearchResults,
  getCaseSummary,
  getEditorInformation,
  getSpecificCaseEditInformation,
  getSupervisorEditorInformation,
  getSurveys,
  setCaseToUpdate,
  updateAllocationDetails,
} from "./nodeApi";

import type { AllocationDetails } from "../../common/types/allocation.types";
import type { EditorInformation } from "../types/editor.types";
import type { SupervisorInformation } from "../types/supervisor.types";
import type { CaseEditInformation, User } from "blaise-api-node-client";

const mockAxios = new MockAdapter(axios, { onNoMatch: "throwException" });

describe("GetSurveys from Blaise", () => {
  const validUserRoles: UserRole[] = [UserRole.SVT_Supervisor, UserRole.SVT_Editor];

  it.each(validUserRoles)(
    "Should retrieve a list of surveys in blaise with a 200 response",
    async (userRole) => {
      mockAxios.onGet(`/api/surveys?userRole=${userRole}`).reply(200, mockSurveyList);

      const result = await getSurveys(userRole);

      expect(result).toEqual(mockSurveyList);
    },
  );

  it.each(validUserRoles)(
    'Should throw the error "Unable to find surveys, please raise this on service desk stating the time and date of failure" when a 404 response is recieved',
    async (userRole) => {
      mockAxios.onGet(`/api/surveys?userRole=${userRole}`).reply(404, null);

      expect(getSurveys(userRole)).rejects.toThrow(
        "Unable to find surveys, please raise this on service desk stating the time and date of failure",
      );
    },
  );

  it.each(validUserRoles)(
    'Should throw the error "Unable to retrieve surveys, please try again in a few minutes" when a 500 response is recieved',
    async (userRole) => {
      mockAxios.onGet(`/api/surveys?userRole=${userRole}`).reply(500, null);

      expect(getSurveys(userRole)).rejects.toThrow(
        "Unable to complete request, please try again in a few minutes",
      );
    },
  );

  it.each(validUserRoles)(
    'Should throw the error "Unable to complete request, please try again in a few minutes" when there is a network error',
    async (userRole) => {
      mockAxios.onGet(`/api/surveys?userRole=${userRole}`).networkError();

      expect(getSurveys(userRole)).rejects.toThrow(
        "Unable to complete request, please try again in a few minutes",
      );
    },
  );
});

describe("GetCaseSummary from Blaise", () => {
  const questionnaireName = "LMS2201_LT1";
  const caseId = "900001";

  it("Should retrieve a list of cases in blaise with a 200 response", async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`)
      .reply(200, mockCaseSummaryDetails);

    const result = await getCaseSummary(questionnaireName, caseId);

    expect(JSON.stringify(result)).toEqual(JSON.stringify(mockCaseSummaryDetails));
  });

  it('Should throw the error "The questionnaire is no longer available', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`)
      .reply(404, null);

    expect(getCaseSummary(questionnaireName, caseId)).rejects.toThrow(
      /The questionnaire is no longer available/,
    );
  });

  it('Should throw the error "Unable to retrieve case summary, please try again in a few minutes" when a 500 response is recieved', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`)
      .reply(500, null);

    expect(getCaseSummary(questionnaireName, caseId)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });

  it('Should throw the error "Unable to retrieve case summary, please try again in a few minutes" when there is a network error', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`)
      .networkError();

    expect(getCaseSummary(questionnaireName, caseId)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });

  it("Should normalise questionnaire name casing and whitespace before building the summary path", async () => {
    const mixedCaseQuestionnaireName = " lms2201_lt1 ";

    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`)
      .reply(200, mockCaseSummaryDetails);

    const result = await getCaseSummary(mixedCaseQuestionnaireName, caseId);

    expect(JSON.stringify(result)).toEqual(JSON.stringify(mockCaseSummaryDetails));
  });

  it("Should request case summary using the _EDIT questionnaire when provided", async () => {
    const editQuestionnaireName = "FRS2504A_EDIT";

    mockAxios
      .onGet(`/api/questionnaires/${editQuestionnaireName}/cases/${caseId}/summary`)
      .reply(200, mockCaseSummaryDetails);

    const result = await getCaseSummary(editQuestionnaireName, caseId);

    expect(JSON.stringify(result)).toEqual(JSON.stringify(mockCaseSummaryDetails));
  });
});

describe("getEditorInformation from Blaise", () => {
  const questionnaireName = "FRS2201";
  const userName = "Rich";
  const editorRole = UserRole.SVT_Editor;

  it("Should retrieve a list of case edit information with a 200 response", async () => {
    const mockCaseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: userName,
        interviewer: "",
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001012",
        outcome: CaseOutcome.Completed,
        assignedTo: userName,
        interviewer: "",
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
      },
    ];

    const expectedEditorInformation: EditorInformation = {
      numberOfCasesAllocated: 2,
      Cases: [
        {
          CaseId: "10001011",
          EditStatus: "Completed",
          EditUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
        },
        {
          CaseId: "10001012",
          EditStatus: "Not started",
          EditUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
        },
      ],
    };

    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${editorRole}`)
      .reply(200, mockCaseEditInformationList);

    const result = await getEditorInformation(questionnaireName, userName, editorRole);

    expect(result).toEqual(expectedEditorInformation);
  });

  it("Should only retrieve a list of case edit information for the user", async () => {
    const mockCaseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: "bob",
        interviewer: "",
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001012",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
      },
    ];

    const expectedEditorInformation: EditorInformation = {
      numberOfCasesAllocated: 1,
      Cases: [
        {
          CaseId: "10001012",
          EditStatus: "Not started",
          EditUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
        },
      ],
    };

    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${editorRole}`)
      .reply(200, mockCaseEditInformationList);

    const result = await getEditorInformation(questionnaireName, userName, editorRole);

    expect(result).toEqual(expectedEditorInformation);
  });

  it('Should throw the error "Unable to find case edit information, please raise this on service desk stating the time and date of failure" when a 404 response is recieved', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${editorRole}`)
      .reply(404, null);

    expect(getEditorInformation(questionnaireName, userName, editorRole)).rejects.toThrow(
      "Unable to find case edit information, please raise this on service desk stating the time and date of failure",
    );
  });

  it('Should throw the error "Unable to complete request, please try again in a few minutes" when a 500 response is recieved', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${editorRole}`)
      .reply(500, null);

    expect(getEditorInformation(questionnaireName, userName, editorRole)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });

  it('Should throw the error "Unable to complete request, please try again in a few minutes" when there is a network error', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${editorRole}`)
      .networkError();

    expect(getEditorInformation(questionnaireName, userName, editorRole)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });
});

describe("getSupervisorEditorInformation from Blaise", () => {
  const questionnaireName = "FRS2201";
  const supervisorRole = UserRole.SVT_Supervisor;
  const editorRole = UserRole.SVT_Editor;

  it("Should retrieve a list of case edit information with a 200 response", async () => {
    const mockEditorsList: User[] = [
      {
        name: "Rich",
        role: editorRole,
        serverParks: ["gusty"],
        defaultServerPark: "gusty",
      },
    ];

    const mockCaseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: "",
        interviewer: "",
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: "",
        readOnlyUrl: "",
      },
      {
        primaryKey: "10001012",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: "",
        readOnlyUrl: "",
      },
      {
        primaryKey: "10001015",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: "",
        readOnlyUrl: "",
      },
    ];

    const expectedSupervisorInformation: SupervisorInformation = {
      TotalNumberOfCases: 3,
      NumberOfCasesNotAllocated: 1,
      NumberOfCasesAllocated: 2,
      NumberOfCasesCompleted: 2,
      EditorInformation: [
        {
          EditorName: "Rich",
          NumberOfCasesAllocated: 2,
          NumberOfCasesCompleted: 1,
          NumberOfCasesQueried: 1,
        },
      ],
    };

    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${supervisorRole}`)
      .reply(200, mockCaseEditInformationList);
    mockAxios.onGet(`/api/users?userRole=${editorRole}`).reply(200, mockEditorsList);

    const result = await getSupervisorEditorInformation(
      questionnaireName,
      supervisorRole,
      editorRole,
    );

    expect(result).toEqual(expectedSupervisorInformation);
  });

  it('Should throw the error "Unable to find supervisor information, please raise this on service desk stating the time and date of failure" when a 404 response is recieved', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${supervisorRole}`)
      .reply(404, null);

    expect(
      getSupervisorEditorInformation(questionnaireName, supervisorRole, editorRole),
    ).rejects.toThrow(
      "Unable to find case edit information, please raise this on service desk stating the time and date of failure",
    );
  });

  it('Should throw the error "Unable to complete request, please try again in a few minutes" when a 500 response is recieved', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${supervisorRole}`)
      .reply(500, null);

    expect(
      getSupervisorEditorInformation(questionnaireName, supervisorRole, editorRole),
    ).rejects.toThrow("Unable to complete request, please try again in a few minutes");
  });

  it('Should throw the error "Unable to complete request, please try again in a few minutes" when there is a network error', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${supervisorRole}`)
      .networkError();

    expect(
      getSupervisorEditorInformation(questionnaireName, supervisorRole, editorRole),
    ).rejects.toThrow("Unable to complete request, please try again in a few minutes");
  });
});

describe("getAllocationDetails from Blaise", () => {
  const questionnaireName = "FRS2201";
  const supervisorRole = UserRole.SVT_Supervisor;
  const editorRole = UserRole.SVT_Editor;

  it("Should retrieve a list of cases not allocated information with a 200 response", async () => {
    const mockEditorsList: User[] = [
      {
        name: "Rich",
        role: editorRole,
        serverParks: ["gusty"],
        defaultServerPark: "gusty",
      },
    ];

    const mockCaseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: "",
        interviewer: "bobw",
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: "",
        readOnlyUrl: "",
      },
      {
        primaryKey: "10001012",
        outcome: CaseOutcome.Completed,
        assignedTo: "",
        interviewer: "jamester",
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: "",
        readOnlyUrl: "",
      },
      {
        primaryKey: "10001015",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "bobw",
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: "",
        readOnlyUrl: "",
      },
    ];

    const expectedResult: AllocationDetails = {
      Editors: [
        {
          Name: "Rich",
          Cases: ["10001015"],
        },
      ],
      Interviewers: [
        {
          Name: "bobw",
          Cases: ["10001011"],
        },
        {
          Name: "jamester",
          Cases: ["10001012"],
        },
      ],
    };

    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${supervisorRole}`)
      .reply(200, mockCaseEditInformationList);
    mockAxios.onGet(`/api/users?userRole=${editorRole}`).reply(200, mockEditorsList);

    const result = await getAllocationDetails(questionnaireName, supervisorRole, editorRole);

    expect(result).toEqual(expectedResult);
  });

  it('Should throw the error "Unable to find case edit information, please raise this on service desk stating the time and date of failure', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${supervisorRole}`)
      .reply(404, null);

    expect(getAllocationDetails(questionnaireName, supervisorRole, editorRole)).rejects.toThrow(
      "Unable to find case edit information, please raise this on service desk stating the time and date of failure",
    );
  });

  it('Should throw the error "Unable to complete request, please try again in a few minutes" when a 500 response is recieved', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${supervisorRole}`)
      .reply(500, null);

    expect(getAllocationDetails(questionnaireName, supervisorRole, editorRole)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });

  it('Should throw the error "Unable to complete request, please try again in a few minutes" when there is a network error', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${supervisorRole}`)
      .networkError();

    expect(getAllocationDetails(questionnaireName, supervisorRole, editorRole)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });
});

describe("updateAllocationDetails in Blaise", () => {
  const questionnaireName = "FRS2201";
  const name = "jake";
  const cases = ["1"];

  it("Should update allocation details with a 204 response", async () => {
    mockAxios.onPatch(`/api/questionnaires/${questionnaireName}/cases/allocate`).reply(204, null);

    const result = await updateAllocationDetails(questionnaireName, name, cases);

    expect(result).toBeUndefined();
  });

  it('Should throw the error "Unable to allocate, please raise this on service desk stating the time and date of failure" when a 404 response is recieved', async () => {
    mockAxios.onPatch(`/api/questionnaires/${questionnaireName}/cases/allocate`).reply(404, null);

    expect(updateAllocationDetails(questionnaireName, name, cases)).rejects.toThrow(
      "Unable to allocate, please raise this on service desk stating the time and date of failure",
    );
  });

  it('Should throw the error "Unable to complete request, please try again in a few minutes" when a 500 response is recieved', async () => {
    mockAxios.onPatch(`/api/questionnaires/${questionnaireName}/cases/allocate`).reply(500, null);

    expect(updateAllocationDetails(questionnaireName, name, cases)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });

  it('Should throw the error "Unable to complete request, please try again in a few minutes" when there is a network error', async () => {
    mockAxios.onPatch(`/api/questionnaires/${questionnaireName}/cases/allocate`).networkError();

    expect(updateAllocationDetails(questionnaireName, name, cases)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });
});

describe("getCaseSearchResults from Blaise for FRS Researcher role", () => {
  const questionnaireName = "FRS2201";
  const caseId = "10001011";
  const role = UserRole.FRS_Researcher;

  it("Should retrieve a single case that matches the case id with a 200 response", async () => {
    const mockCaseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: "rich",
        interviewer: "",
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001012",
        outcome: CaseOutcome.Completed,
        assignedTo: "rich",
        interviewer: "",
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
      },
    ];

    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${role}`)
      .reply(200, mockCaseEditInformationList);

    const result = await getCaseSearchResults(questionnaireName, caseId, role);

    expect(result).toEqual([mockCaseEditInformationList[0]]);
  });

  it("Should retrieve a list of cases that match a partial case id for all organisations", async () => {
    const mockCaseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: "bob",
        interviewer: "",
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001012",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.NatCen,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "90001013",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001013",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001014",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.Nisra,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
      },
    ];

    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${role}`)
      .reply(200, mockCaseEditInformationList);

    const result = await getCaseSearchResults(questionnaireName, "1000101", role);

    expect(result).toEqual([
      mockCaseEditInformationList[0],
      mockCaseEditInformationList[1],
      mockCaseEditInformationList[3],
    ]);
  });

  it('Should throw the error "Unable to find case edit information, please raise this on service desk stating the time and date of failure" when a 404 response is recieved', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${role}`)
      .reply(404, null);

    expect(getCaseSearchResults(questionnaireName, caseId, role)).rejects.toThrow(
      "Unable to find case edit information, please raise this on service desk stating the time and date of failure",
    );
  });

  it('Should throw the error "Unable to complete request, please try again in a few minutes" when a 500 response is recieved', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${role}`)
      .reply(500, null);

    expect(getCaseSearchResults(questionnaireName, caseId, role)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });

  it('Should throw the error "Unable to complete request, please try again in a few minutes" when there is a network error', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${role}`)
      .networkError();

    expect(getCaseSearchResults(questionnaireName, caseId, role)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });
});

describe("getSpecificCaseEditInformation from Blaise for FRS Researcher role", () => {
  const questionnaireName = "FRS2201";
  const caseId = "10001011";
  const role = UserRole.FRS_Researcher;

  it("Should retrieve a single case that matches the case id with a 200 response", async () => {
    const mockCaseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: "rich",
        interviewer: "",
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001012",
        outcome: CaseOutcome.Completed,
        assignedTo: "rich",
        interviewer: "",
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
      },
    ];

    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${role}`)
      .reply(200, mockCaseEditInformationList);

    const result = await getSpecificCaseEditInformation(questionnaireName, caseId, role);

    expect(result).toEqual(mockCaseEditInformationList[0]);
  });

  it('Should throw the error "Unable to find case edit information, please raise this on service desk stating the time and date of failure" when a 404 response is recieved', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${role}`)
      .reply(404, null);

    expect(getSpecificCaseEditInformation(questionnaireName, caseId, role)).rejects.toThrow(
      "Unable to find case edit information, please raise this on service desk stating the time and date of failure",
    );
  });

  it('Should throw the error "Unable to complete request, please try again in a few minutes" when a 500 response is recieved', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${role}`)
      .reply(500, null);

    expect(getSpecificCaseEditInformation(questionnaireName, caseId, role)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });

  it('Should throw the error "Unable to complete request, please try again in a few minutes" when there is a network error', async () => {
    mockAxios
      .onGet(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${role}`)
      .networkError();

    expect(getSpecificCaseEditInformation(questionnaireName, caseId, role)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });
});

describe("setCaseToUpdate in Blaise", () => {
  const questionnaireName = "FRS2201";
  const caseId = "9001";

  it("Should update case details with a 204 response", async () => {
    mockAxios
      .onPatch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`)
      .reply(204, null);
    const result = await setCaseToUpdate(questionnaireName, caseId);

    expect(result).toBe(204);
  });
  it('Should throw the error "Unable to set case to update, please raise this on service desk stating the time and date of failure" when a 404 response is recieved', async () => {
    mockAxios
      .onPatch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`)
      .reply(404, null);
    expect(setCaseToUpdate(questionnaireName, caseId)).rejects.toThrow(
      "Unable to set case to update, please raise this on service desk stating the time and date of failure",
    );
  });
  it('Should throw the error "Unable to complete request, please try again in a few minutes" when a 500 response is recieved', async () => {
    mockAxios
      .onPatch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`)
      .reply(500, null);
    expect(setCaseToUpdate(questionnaireName, caseId)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });
  it('Should throw the error "Unable to complete request, please try again in a few minutes" when there is a network error', async () => {
    mockAxios
      .onPatch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`)
      .networkError();
    expect(setCaseToUpdate(questionnaireName, caseId)).rejects.toThrow(
      "Unable to complete request, please try again in a few minutes",
    );
  });

  it("Should normalise questionnaire name casing and whitespace before building the update path", async () => {
    const mixedCaseQuestionnaireName = " frs2201 ";

    mockAxios
      .onPatch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`)
      .reply(204, null);

    const result = await setCaseToUpdate(mixedCaseQuestionnaireName, caseId);

    expect(result).toBe(204);
  });
});
