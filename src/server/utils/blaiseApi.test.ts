import { BlaiseApiClient } from "blaise-api-node-client";
import { Mock, MockBehavior, Times } from "typemoq";

import { mockCaseList, mockCaseSummaryResponse } from "../test-utils/case.mock.js";
import FakeServerConfigurationProvider from "../test-utils/fakeServerConfigurationProvider.mock.js";
import { mockQuestionnaireList } from "../test-utils/questionnaireList.mock.js";
import mockUser from "../test-utils/user.mock.js";
import AuditLogger from "../utils/auditLogger.js";

import BlaiseApi from "./blaiseApi.js";

import type { Questionnaire } from "blaise-api-node-client";
import type { IMock } from "typemoq";

// polyfill for setImmediate (when testing with logger)
global.setImmediate = global.setImmediate || ((fn: () => void) => setTimeout(fn, 0));

const configFake = new FakeServerConfigurationProvider();

const mockBlaiseApiClient: IMock<BlaiseApiClient> = Mock.ofType(
  BlaiseApiClient,
  MockBehavior.Loose,
  true,
  "http://restapi.blaise.com",
);
const mockCloudLogger: IMock<AuditLogger> = Mock.ofType(AuditLogger);

const sut = new BlaiseApi(configFake, mockBlaiseApiClient.object);

describe("getQuestionnaires from Blaise", () => {
  beforeEach(() => {
    mockBlaiseApiClient.reset();
    mockCloudLogger.reset();
  });

  it("Should call getQuestionnaires for the correct serverpark", async () => {
    mockBlaiseApiClient
      .setup((client) => client.getQuestionnaires(configFake.ServerPark))
      .returns(async () => mockQuestionnaireList);

    await sut.getQuestionnaires();

    mockBlaiseApiClient.verify(
      (client) => client.getQuestionnaires(configFake.ServerPark),
      Times.once(),
    );
  });

  it("Should return an expected list of questionnaires", async () => {
    const questionnaireList: Questionnaire[] = [
      {
        name: "FRS2408B",
        serverParkName: "gusty",
        installDate: "2021-03-15T15:26:43.4233454+00:00",
        fieldPeriod: "2024-08-01T00:00:00",
        surveyTla: "FRS",
        status: "Active",
        dataRecordCount: 0,
        hasData: false,
      },
      {
        name: "FRS2408B_EDIT",
        serverParkName: "gusty",
        installDate: "2021-03-15T15:26:43.4233454+00:00",
        fieldPeriod: "2024-08-01T00:00:00",
        surveyTla: "FRS",
        status: "Active",
        dataRecordCount: 0,
        hasData: false,
      },
    ];

    mockBlaiseApiClient
      .setup((client) => client.getQuestionnaires(configFake.ServerPark))
      .returns(async () => questionnaireList);

    const result = await sut.getQuestionnaires();

    expect(result.length).toEqual(2);
    expect(result[0]?.questionnaireName).toEqual("FRS2408B");
    expect(result[1]?.questionnaireName).toEqual("FRS2408B_EDIT");
  });

  it("Should return an expected list of questionnaires", async () => {
    const questionnaireList: Questionnaire[] = [
      {
        name: "FRS2408B",
        serverParkName: "gusty",
        installDate: "2021-03-15T15:26:43.4233454+00:00",
        fieldPeriod: "2024-08-01T00:00:00",
        surveyTla: "FRS",
        status: "Active",
        dataRecordCount: 0,
        hasData: false,
      },
      {
        name: "FRS2408B_EDIT",
        serverParkName: "gusty",
        installDate: "2021-03-15T15:26:43.4233454+00:00",
        fieldPeriod: "2024-08-01T00:00:00",
        surveyTla: "FRS",
        status: "Active",
        dataRecordCount: 0,
        hasData: false,
      },
    ];

    mockBlaiseApiClient
      .setup((client) => client.getQuestionnaires(configFake.ServerPark))
      .returns(async () => questionnaireList);

    const result = await sut.getQuestionnaires();

    expect(result.length).toEqual(2);
    expect(result[0]?.questionnaireName).toEqual("FRS2408B");
    expect(result[1]?.questionnaireName).toEqual("FRS2408B_EDIT");
  });
});

describe("getCase from Blaise", () => {
  beforeEach(() => {
    mockBlaiseApiClient.reset();
    mockCloudLogger.reset();
  });

  it("Should call getCase with the expected parameters", async () => {
    const questionnaireName = "FRS2504A";
    const caseId = "9001";

    mockBlaiseApiClient
      .setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId))
      .returns(async () => mockCaseSummaryResponse);

    await sut.getCase(questionnaireName, caseId);

    mockBlaiseApiClient.verify(
      (client) => client.getCase(configFake.ServerPark, questionnaireName, caseId),
      Times.once(),
    );
  });

  it("Should retrieve an extpected case from blaise", async () => {
    const questionnaireName = "FRS2504A";
    const caseId = "9001";

    mockBlaiseApiClient
      .setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId))
      .returns(async () => mockCaseSummaryResponse);

    const result = await sut.getCase(questionnaireName, caseId);

    expect(result).toEqual(mockCaseSummaryResponse);
  });
});

describe("updateCase from Blaise", () => {
  beforeEach(() => {
    mockBlaiseApiClient.reset();
  });

  it("Should call the update function with the expected parameters", async () => {
    const questionnaireName = "FRS2504A_EDIT";
    const caseId = "9001";
    const caseFields = {};

    mockBlaiseApiClient
      .setup((client) =>
        client.updateCase(configFake.ServerPark, questionnaireName, caseId, caseFields),
      )
      .returns(async () => null);

    await sut.updateCase(questionnaireName, caseId, caseFields);

    mockBlaiseApiClient.verify(
      (client) => client.updateCase(configFake.ServerPark, questionnaireName, caseId, caseFields),
      Times.once(),
    );
  });
});

describe("getCaseEditInformation from Blaise", () => {
  beforeEach(() => {
    mockBlaiseApiClient.reset();
  });

  it("Should call getCaseEditInformation for a given questionnaire", async () => {
    const questionnaireName = "FRS2504A_EDIT";

    mockBlaiseApiClient
      .setup((client) => client.getCaseEditInformation(configFake.ServerPark, questionnaireName))
      .returns(async () => mockCaseList);

    await sut.getCaseEditInformation(questionnaireName);

    mockBlaiseApiClient.verify(
      (client) => client.getCaseEditInformation(configFake.ServerPark, questionnaireName),
      Times.once(),
    );
  });

  it("Should return an expected list of Cases for editing", async () => {
    const questionnaireName = "FRS2504A_EDIT";
    const expectedEditUrlBase = `https://${configFake.ExternalWebUrl}/${questionnaireName}?KeyValue=`;

    mockBlaiseApiClient
      .setup((client) => client.getCaseEditInformation(configFake.ServerPark, questionnaireName))
      .returns(async () => mockCaseList);

    const caseEditInformationList = await sut.getCaseEditInformation(questionnaireName);

    caseEditInformationList.forEach((caseEditInformation, index) => {
      expect(caseEditInformation.primaryKey).toEqual(mockCaseList[index]?.primaryKey);
      expect(caseEditInformation.outcome).toEqual(mockCaseList[index]?.outcome);
      expect(caseEditInformation.assignedTo).toEqual(mockCaseList[index]?.assignedTo);
      expect(caseEditInformation.editedStatus).toEqual(mockCaseList[index]?.editedStatus);
      expect(caseEditInformation.interviewer).toEqual(mockCaseList[index]?.interviewer);
      expect(caseEditInformation.editUrl).toEqual(
        `${expectedEditUrlBase}${caseEditInformation.primaryKey}`,
      );
      expect(caseEditInformation.readOnlyUrl).toEqual(
        `${expectedEditUrlBase}${caseEditInformation.primaryKey}&DataEntrySettings=ReadOnly`,
      );
    });
  });
});

describe("getUsers from Blaise", () => {
  beforeEach(() => {
    mockBlaiseApiClient.reset();
  });

  it("Should call getCaseEditInformation for a given questionnaire", async () => {
    mockBlaiseApiClient.setup((client) => client.getUsers()).returns(async () => [mockUser]);

    await sut.getUsers();

    mockBlaiseApiClient.verify((client) => client.getUsers(), Times.once());
  });

  it("Should call getCaseEditInformation for a given questionnaire", async () => {
    mockBlaiseApiClient.setup((client) => client.getUsers()).returns(async () => [mockUser]);

    const result = await sut.getUsers();

    expect(result).toEqual([mockUser]);
  });
});
