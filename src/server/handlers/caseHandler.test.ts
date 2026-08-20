import { BlaiseApiClient, CaseOutcome, EditedStatus, Organisation } from "blaise-api-node-client";
import { Auth } from "blaise-login-react-server";
import supertest from "supertest";
import { It, Mock, MockBehavior, Times } from "typemoq";

import nodeServer from "../server.js";
import createAxiosError from "../test-utils/axiosTestHelper.js";
import { mockCaseSummaryDetails, mockCaseSummaryResponse } from "../test-utils/case.mock.js";
import FakeServerConfigurationProvider from "../test-utils/fakeServerConfigurationProvider.mock.js";
import mockUser from "../test-utils/user.mock.js";
import AuditLogger from "../utils/auditLogger.js";
import BlaiseApi from "../utils/blaiseApi.js";

import type { CaseEditInformation, User } from "blaise-api-node-client";
import type { HttpLogger } from "pino-http";
import type { Response } from "supertest";
import type { IMock } from "typemoq";

const configFake = new FakeServerConfigurationProvider();

const user: User = mockUser;

Auth.prototype.validateToken = vi.fn().mockReturnValue(true);
Auth.prototype.getUser = vi.fn().mockReturnValue({ name: user.name, role: user.role });

const mockBlaiseApiClient: IMock<BlaiseApiClient> = Mock.ofType(
  BlaiseApiClient,
  MockBehavior.Loose,
  true,
  "http://restapi.blaise.com",
);
const mockCloudLogger: IMock<AuditLogger> = Mock.ofType(AuditLogger);

const blaiseApi = new BlaiseApi(configFake, mockBlaiseApiClient.object);

const mockBlaiseApi: IMock<BlaiseApi> = Mock.ofInstance(blaiseApi);

const server = nodeServer(configFake, undefined as unknown as HttpLogger, {
  blaiseApi: mockBlaiseApi.object,
  auditLogger: mockCloudLogger.object,
});

const sut = supertest(server);

const validUserRoles: string[] = ["SVT Supervisor", "SVT Editor"];

describe("Get case summary tests", () => {
  const caseId: string = "1";
  const questionnaireName: string = "TEST111A";
  const caseSummaryPath = `/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`;

  const setupGetCaseSuccess = (): void => {
    mockBlaiseApi
      .setup((api) => api.getCase(questionnaireName, caseId))
      .returns(async () => mockCaseSummaryResponse);
  };

  const setupGetCaseFailure = (error: unknown): void => {
    mockBlaiseApi
      .setup((api) => api.getCase(questionnaireName, caseId))
      .returns(() => Promise.reject(error));
  };

  const getCaseSummary = () => sut.get(caseSummaryPath);

  beforeEach(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  afterAll(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  it("It should return a 200 response with expected case summary", async () => {
    setupGetCaseSuccess();

    const response: Response = await getCaseSummary();

    expect(response.status).toEqual(200);
    expect(response.text).toEqual(JSON.stringify(mockCaseSummaryDetails));
    mockBlaiseApi.verify((api) => api.getCase(questionnaireName, caseId), Times.once());
  });

  it("It should log when case summary is retrieved", async () => {
    setupGetCaseSuccess();

    await getCaseSummary();

    mockCloudLogger.verify(
      (logger) =>
        logger.info(
          It.isAny(),
          `Retrieved case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`,
        ),
      Times.once(),
    );
  });

  it.each([
    {
      statusCode: 500,
      expectedBody: {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to complete request, please try again in a few minutes",
        },
      },
    },
    {
      statusCode: 404,
      expectedBody: {
        error: {
          code: "NOT_FOUND",
          message: "Resource not found",
        },
      },
    },
  ])(
    "It should return a $statusCode response when get case fails with $statusCode",
    async ({ statusCode, expectedBody }) => {
      const axiosError = createAxiosError(statusCode);

      setupGetCaseFailure(axiosError);

      const response: Response = await getCaseSummary();

      expect(response.status).toEqual(statusCode);
      expect(response.body).toEqual(expectedBody);
    },
  );

  it.each([500, 404])(
    "It should log a %i response error when get case fails with an axios error",
    async (statusCode) => {
      const axiosError = createAxiosError(statusCode);

      setupGetCaseFailure(axiosError);

      await getCaseSummary();

      mockCloudLogger.verify(
        (logger) =>
          logger.error(
            It.isAny(),
            `Failed to get case details, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with ${statusCode} ${axiosError}`,
          ),
        Times.once(),
      );
    },
  );

  it("It should return a 500 response when get case summary client throws an error", async () => {
    const clientError = new Error();

    setupGetCaseFailure(clientError);

    const response: Response = await getCaseSummary();

    expect(response.status).toEqual(500);
  });

  it("It should log a 500 response error when get case summary client throws an error", async () => {
    const clientError = new Error();

    setupGetCaseFailure(clientError);

    await getCaseSummary();

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          `Failed to get case details, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${clientError}`,
        ),
      Times.once(),
    );
  });
});

describe("Get case edit information tests", () => {
  beforeEach(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  afterAll(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  it.each(validUserRoles)(
    "should return a 200 response with an expected filtered list of case edit details When given a valid questionnaire and userRole",
    async (userRole) => {
      const questionnaireName = "FRS2504A";

      const mockCaseEditInformationList: CaseEditInformation[] = [
        {
          primaryKey: "10001011",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
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
          assignedTo: "bob",
          interviewer: "",
          editedStatus: EditedStatus.NotStarted,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001013",
          outcome: CaseOutcome.Partial,
          assignedTo: "Julie",
          interviewer: "",
          editedStatus: EditedStatus.Query,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001013",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001014",
          outcome: CaseOutcome.CompletedNudge,
          assignedTo: "Sarah",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001015",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001015",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly",
        },
      ];

      const mockFilteredCaseEditInformationList: CaseEditInformation[] = [
        {
          primaryKey: "10001011",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
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
          assignedTo: "bob",
          interviewer: "",
          editedStatus: EditedStatus.NotStarted,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001014",
          outcome: CaseOutcome.CompletedNudge,
          assignedTo: "Sarah",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001015",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001015",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly",
        },
      ];

      mockBlaiseApi
        .setup((api) => api.getCaseEditInformation(questionnaireName))
        .returns(async () => mockCaseEditInformationList);

      const response: Response = await sut.get(
        `/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`,
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockFilteredCaseEditInformationList);
      mockBlaiseApi.verify((api) => api.getCaseEditInformation(questionnaireName), Times.once());
    },
  );

  it.each(validUserRoles)(
    "should log the number of case and filtered cases When given a valid questionnaire and userRole",
    async (userRole) => {
      const questionnaireName = "FRS2504A";

      const mockCaseEditInformationList: CaseEditInformation[] = [
        {
          primaryKey: "10001011",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
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
          assignedTo: "bob",
          interviewer: "",
          editedStatus: EditedStatus.NotStarted,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001013",
          outcome: CaseOutcome.Partial,
          assignedTo: "Julie",
          interviewer: "",
          editedStatus: EditedStatus.Query,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001013",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001014",
          outcome: CaseOutcome.CompletedNudge,
          assignedTo: "Sarah",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001015",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001015",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly",
        },
      ];

      const mockFilteredCaseEditInformationList: CaseEditInformation[] = [
        {
          primaryKey: "10001011",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
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
          assignedTo: "bob",
          interviewer: "",
          editedStatus: EditedStatus.NotStarted,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001014",
          outcome: CaseOutcome.CompletedNudge,
          assignedTo: "Sarah",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001015",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001015",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly",
        },
      ];

      mockBlaiseApi
        .setup((api) => api.getCaseEditInformation(questionnaireName))
        .returns(async () => mockCaseEditInformationList);

      await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

      mockCloudLogger.verify(
        (logger) =>
          logger.info(
            It.isAny(),
            `Retrieved ${mockCaseEditInformationList.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`,
          ),
        Times.once(),
      );
      mockCloudLogger.verify(
        (logger) =>
          logger.info(
            It.isAny(),
            `Filtered down to ${mockFilteredCaseEditInformationList.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`,
          ),
        Times.once(),
      );
    },
  );

  it.each(validUserRoles)(
    "should return a 200 response with an expected filtered list of case edit details When outcome codes match role",
    async (userRole) => {
      const questionnaireName = "FRS2504A";

      const mockCaseEditInformationList: CaseEditInformation[] = [
        {
          primaryKey: "10001011",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Finished,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001012",
          outcome: CaseOutcome.CompletedNudge,
          assignedTo: "bob",
          interviewer: "",
          editedStatus: EditedStatus.NotStarted,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001013",
          outcome: CaseOutcome.Partial,
          assignedTo: "Julie",
          interviewer: "",
          editedStatus: EditedStatus.Query,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001013",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001014",
          outcome: CaseOutcome.CompletedProxy,
          assignedTo: "Sarah",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001015",
          outcome: CaseOutcome.Partial,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001015",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly",
        },
      ];

      const mockFilteredCaseEditInformationList: CaseEditInformation[] = [
        {
          primaryKey: "10001011",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Finished,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001012",
          outcome: CaseOutcome.CompletedNudge,
          assignedTo: "bob",
          interviewer: "",
          editedStatus: EditedStatus.NotStarted,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001014",
          outcome: CaseOutcome.CompletedProxy,
          assignedTo: "Sarah",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
        },
      ];

      mockBlaiseApi
        .setup((api) => api.getCaseEditInformation(questionnaireName))
        .returns(async () => mockCaseEditInformationList);

      const response: Response = await sut.get(
        `/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`,
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockFilteredCaseEditInformationList);
      mockBlaiseApi.verify((api) => api.getCaseEditInformation(questionnaireName), Times.once());
    },
  );

  it.each(validUserRoles)(
    "should log the number of cases and filtered cases When outcome codes match role",
    async (userRole) => {
      const questionnaireName = "FRS2504A";

      const mockCaseEditInformationList: CaseEditInformation[] = [
        {
          primaryKey: "10001011",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Finished,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001012",
          outcome: CaseOutcome.CompletedNudge,
          assignedTo: "bob",
          interviewer: "",
          editedStatus: EditedStatus.NotStarted,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001013",
          outcome: CaseOutcome.Partial,
          assignedTo: "Julie",
          interviewer: "",
          editedStatus: EditedStatus.Query,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001013",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001014",
          outcome: CaseOutcome.CompletedProxy,
          assignedTo: "Sarah",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001015",
          outcome: CaseOutcome.Partial,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001015",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly",
        },
      ];

      const mockFilteredCaseEditInformationList: CaseEditInformation[] = [
        {
          primaryKey: "10001011",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Finished,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001012",
          outcome: CaseOutcome.CompletedNudge,
          assignedTo: "bob",
          interviewer: "",
          editedStatus: EditedStatus.NotStarted,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001014",
          outcome: CaseOutcome.CompletedProxy,
          assignedTo: "Sarah",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
        },
      ];

      mockBlaiseApi
        .setup((api) => api.getCaseEditInformation(questionnaireName))
        .returns(async () => mockCaseEditInformationList);

      await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

      mockCloudLogger.verify(
        (logger) =>
          logger.info(
            It.isAny(),
            `Retrieved ${mockCaseEditInformationList.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`,
          ),
        Times.once(),
      );
      mockCloudLogger.verify(
        (logger) =>
          logger.info(
            It.isAny(),
            `Filtered down to ${mockFilteredCaseEditInformationList.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`,
          ),
        Times.once(),
      );
    },
  );

  it.each(validUserRoles)(
    "should return a 200 response with an expected filtered list of case edit details When organisation match role",
    async (userRole) => {
      const questionnaireName = "FRS2504A";

      const mockCaseEditInformationList: CaseEditInformation[] = [
        {
          primaryKey: "10001011",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Finished,
          organisation: Organisation.NatCen,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001012",
          outcome: CaseOutcome.CompletedNudge,
          assignedTo: "bob",
          interviewer: "",
          editedStatus: EditedStatus.NotStarted,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001013",
          outcome: CaseOutcome.Partial,
          assignedTo: "Julie",
          interviewer: "",
          editedStatus: EditedStatus.Query,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001013",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001014",
          outcome: CaseOutcome.CompletedProxy,
          assignedTo: "Sarah",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.Nisra,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001015",
          outcome: CaseOutcome.Partial,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001015",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly",
        },
      ];

      const mockFilteredCaseEditInformationList: CaseEditInformation[] = [
        {
          primaryKey: "10001012",
          outcome: CaseOutcome.CompletedNudge,
          assignedTo: "bob",
          interviewer: "",
          editedStatus: EditedStatus.NotStarted,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
        },
      ];

      mockBlaiseApi
        .setup((api) => api.getCaseEditInformation(questionnaireName))
        .returns(async () => mockCaseEditInformationList);

      const response: Response = await sut.get(
        `/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`,
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockFilteredCaseEditInformationList);
      mockBlaiseApi.verify((api) => api.getCaseEditInformation(questionnaireName), Times.once());
    },
  );

  it.each(validUserRoles)(
    "should log the number of cases and filtered cases When organisation match role",
    async (userRole) => {
      const questionnaireName = "FRS2504A";

      const mockCaseEditInformationList: CaseEditInformation[] = [
        {
          primaryKey: "10001011",
          outcome: CaseOutcome.Completed,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Finished,
          organisation: Organisation.NatCen,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001012",
          outcome: CaseOutcome.CompletedNudge,
          assignedTo: "bob",
          interviewer: "",
          editedStatus: EditedStatus.NotStarted,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001013",
          outcome: CaseOutcome.Partial,
          assignedTo: "Julie",
          interviewer: "",
          editedStatus: EditedStatus.Query,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001013",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001014",
          outcome: CaseOutcome.CompletedProxy,
          assignedTo: "Sarah",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.Nisra,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
        },
        {
          primaryKey: "10001015",
          outcome: CaseOutcome.Partial,
          assignedTo: "Rich",
          interviewer: "",
          editedStatus: EditedStatus.Started,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001015",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly",
        },
      ];

      const mockFilteredCaseEditInformationList: CaseEditInformation[] = [
        {
          primaryKey: "10001012",
          outcome: CaseOutcome.CompletedNudge,
          assignedTo: "bob",
          interviewer: "",
          editedStatus: EditedStatus.NotStarted,
          organisation: Organisation.ONS,
          editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
          readOnlyUrl:
            "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
        },
      ];

      mockBlaiseApi
        .setup((api) => api.getCaseEditInformation(questionnaireName))
        .returns(async () => mockCaseEditInformationList);

      await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

      mockCloudLogger.verify(
        (logger) =>
          logger.info(
            It.isAny(),
            `Retrieved ${mockCaseEditInformationList.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`,
          ),
        Times.once(),
      );
      mockCloudLogger.verify(
        (logger) =>
          logger.info(
            It.isAny(),
            `Filtered down to ${mockFilteredCaseEditInformationList.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`,
          ),
        Times.once(),
      );
    },
  );

  it("should return a 200 response with a list of all case edit details When the Outcome Filter list is empty", async () => {
    const questionnaireName = "FRS2504A";
    const userRole = "SVT AllOutcomes";
    const mockCaseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
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
        assignedTo: "bob",
        interviewer: "",
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001013",
        outcome: CaseOutcome.Partial,
        assignedTo: "Julie",
        interviewer: "",
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001013",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001014",
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: "Sarah",
        interviewer: "",
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001015",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001015",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly",
      },
    ];

    mockBlaiseApi
      .setup((api) => api.getCaseEditInformation(questionnaireName))
      .returns(async () => mockCaseEditInformationList);

    const response: Response = await sut.get(
      `/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`,
    );

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(mockCaseEditInformationList);
    mockBlaiseApi.verify((api) => api.getCaseEditInformation(questionnaireName), Times.once());
  });

  it("should log the number of cases and filtered cases When the Outcome Filter list is empty", async () => {
    const questionnaireName = "FRS2504A";
    const userRole = "SVT AllOutcomes";
    const mockCaseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
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
        assignedTo: "bob",
        interviewer: "",
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001012",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001013",
        outcome: CaseOutcome.Partial,
        assignedTo: "Julie",
        interviewer: "",
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001013",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001014",
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: "Sarah",
        interviewer: "",
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001014",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly",
      },
      {
        primaryKey: "10001015",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001015",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly",
      },
    ];

    mockBlaiseApi
      .setup((api) => api.getCaseEditInformation(questionnaireName))
      .returns(async () => mockCaseEditInformationList);

    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    mockCloudLogger.verify(
      (logger) =>
        logger.info(
          It.isAny(),
          `Retrieved ${mockCaseEditInformationList.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`,
        ),
      Times.once(),
    );
    mockCloudLogger.verify(
      (logger) =>
        logger.info(
          It.isAny(),
          `Filtered down to ${mockCaseEditInformationList.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`,
        ),
      Times.once(),
    );
  });

  it("should return a 500 response if the users role is not configured for the survey", async () => {
    const questionnaireName = "FRS2504A";
    const userRole = "SVT NotConfigured"; // configured for LMS questionnaires only
    const mockCaseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
      },
    ];

    mockBlaiseApi
      .setup((api) => api.getCaseEditInformation(questionnaireName))
      .returns(async () => mockCaseEditInformationList);

    const response: Response = await sut.get(
      `/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`,
    );

    expect(response.status).toEqual(500);
  });

  it("should log a 500 response error if the users role is not configured for the survey", async () => {
    const questionnaireName = "FRS2504A";
    const userRole = "SVT NotConfigured"; // configured for LMS questionnaires only
    const error = `Error: No '${questionnaireName.substring(0, 3)}' survey configuration found for Role ${userRole}`;
    const mockCaseEditInformationList: CaseEditInformation[] = [
      {
        primaryKey: "10001011",
        outcome: CaseOutcome.Completed,
        assignedTo: "Rich",
        interviewer: "",
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: "https://cati.blaise.com/FRS2504A?KeyValue=10001011",
        readOnlyUrl:
          "https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly",
      },
    ];

    mockBlaiseApi
      .setup((api) => api.getCaseEditInformation(questionnaireName))
      .returns(async () => mockCaseEditInformationList);

    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          `Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`,
        ),
      Times.once(),
    );
  });

  it("should return a 500 response when a call is made to retrieve a list of editing details and the rest api is not availiable", async () => {
    const questionnaireName = "FRS2504A";
    const userRole = "SVT Editor";

    const axiosError = createAxiosError(500);

    mockBlaiseApi
      .setup((api) => api.getCaseEditInformation(questionnaireName))
      .returns(() => Promise.reject(axiosError));

    const response: Response = await sut.get(
      `/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`,
    );

    expect(response.status).toEqual(500);
  });

  it("should log a 500 response error when a call is made to retrieve a list of editing details and the rest api is not availiable", async () => {
    const questionnaireName = "FRS2504A";
    const userRole = "SVT Editor";

    const axiosError = createAxiosError(500);

    mockBlaiseApi
      .setup((api) => api.getCaseEditInformation(questionnaireName))
      .returns(() => Promise.reject(axiosError));

    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          `Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${axiosError}`,
        ),
      Times.once(),
    );
  });

  it("should return a 500 response when the api client throws an error", async () => {
    const questionnaireName = "FRS2504A";
    const userRole = "SVT Editor";

    const apiClientError = new Error();

    mockBlaiseApi
      .setup((api) => api.getCaseEditInformation(questionnaireName))
      .returns(() => Promise.reject(apiClientError));

    const response: Response = await sut.get(
      `/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`,
    );

    expect(response.status).toEqual(500);
  });

  it("should log a 500 response error when the api client throws an error", async () => {
    const questionnaireName = "FRS2504A";
    const userRole = "SVT Editor";

    const apiClientError = new Error();

    mockBlaiseApi
      .setup((api) => api.getCaseEditInformation(questionnaireName))
      .returns(() => Promise.reject(apiClientError));

    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          `Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${apiClientError}`,
        ),
      Times.once(),
    );
  });

  it("should return a 500 response when CaseContorller is called without a userRole", async () => {
    const questionnaireName = "FRS2504A";

    mockBlaiseApi
      .setup((api) => api.getCaseEditInformation(questionnaireName))
      .returns(async () => []);

    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit`);

    expect(response.status).toEqual(500);
  });

  it("should log a 500 response error when CaseContorller is called without a userRole", async () => {
    const questionnaireName = "FRS2504A";
    const error = "Error: Role: 'undefined' not found in Role configuration";

    mockBlaiseApi
      .setup((api) => api.getCaseEditInformation(questionnaireName))
      .returns(async () => []);

    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit`);

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          `Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`,
        ),
      Times.once(),
    );
  });

  it.each(["", "INVALIDROLE"])(
    "should return a 500 response when given an unknown userRole",
    async (userRoleInvalid) => {
      const questionnaireName = "FRS2504A";

      mockBlaiseApi
        .setup((api) => api.getCaseEditInformation(questionnaireName))
        .returns(async () => []);

      const response: Response = await sut.get(
        `/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRoleInvalid}`,
      );

      expect(response.status).toEqual(500);
    },
  );

  it.each(["", "INVALIDROLE"])(
    "should log a 500 response error when given an unknown userRole",
    async (userRoleInvalid) => {
      const questionnaireName = "FRS2504A";
      const error = `Error: Role: '${userRoleInvalid}' not found in Role configuration`;

      mockBlaiseApi
        .setup((api) => api.getCaseEditInformation(questionnaireName))
        .returns(async () => []);

      await sut.get(
        `/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRoleInvalid}`,
      );

      mockCloudLogger.verify(
        (logger) =>
          logger.error(
            It.isAny(),
            `Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`,
          ),
        Times.once(),
      );
    },
  );

  it("should return a 404 response when a call is made to retrieve a list of editing details and the client returns a 404 not found", async () => {
    const questionnaireName = "FRS2504A";
    const userRole = "SVT Editor";

    const axiosError = createAxiosError(404);

    mockBlaiseApi
      .setup((api) => api.getCaseEditInformation(questionnaireName))
      .returns(() => Promise.reject(axiosError));

    const response: Response = await sut.get(
      `/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`,
    );

    expect(response.status).toEqual(404);
  });

  it("should log a 404 response error when a call is made to retrieve a list of editing details and the client returns a 404 not found", async () => {
    const questionnaireName = "FRS2504A";
    const userRole = "SVT Editor";

    const axiosError = createAxiosError(404);

    mockBlaiseApi
      .setup((api) => api.getCaseEditInformation(questionnaireName))
      .returns(() => Promise.reject(axiosError));

    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          `Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 404 ${axiosError}`,
        ),
      Times.once(),
    );
  });
});

describe("allocate cases tests", () => {
  const questionnaireName: string = "TEST111A";
  const allocateCasesPath = `/api/questionnaires/${questionnaireName}/cases/allocate`;

  const buildAllocatePayload = (
    overrides: Partial<{ name: string; cases: string[] }> = {},
  ): { name: string; cases: string[] } => ({
    name: "jake",
    cases: ["1"],
    ...overrides,
  });

  const requestAllocateCases = (payload: { name: string; cases: string[] }) =>
    sut.patch(allocateCasesPath).send(payload);

  const setupUpdateCaseFailure = (error: unknown): void => {
    mockBlaiseApi
      .setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny()))
      .returns(() => Promise.reject(error));
  };

  beforeEach(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  afterAll(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  it("It should return a 204 response when cases are allocated", async () => {
    const caseId1: string = "1";
    const caseId2: string = "2";
    const editor: string = "jake";
    const payload = buildAllocatePayload({ name: editor, cases: [caseId1, caseId2] });
    const caseFields = { "QEdit.AssignedTo": editor, "QEdit.Edited": 1 };

    mockBlaiseApi.setup((api) => api.updateCase(questionnaireName, caseId1, caseFields));
    mockBlaiseApi.setup((api) => api.updateCase(questionnaireName, caseId2, caseFields));

    const response: Response = await requestAllocateCases(payload);

    expect(response.status).toEqual(204);
    mockBlaiseApi.verify(
      (api) => api.updateCase(questionnaireName, caseId1, caseFields),
      Times.once(),
    );
    mockBlaiseApi.verify(
      (api) => api.updateCase(questionnaireName, caseId2, caseFields),
      Times.once(),
    );
  });

  it("It should limit concurrent upstream case updates when allocating many cases", async () => {
    const payload = buildAllocatePayload({
      cases: Array.from({ length: 25 }, (_, index) => `${index + 1}`),
    });

    let inFlightUpdates = 0;
    let peakInFlightUpdates = 0;

    mockBlaiseApi
      .setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny()))
      .returns(async () => {
        inFlightUpdates += 1;
        peakInFlightUpdates = Math.max(peakInFlightUpdates, inFlightUpdates);

        await new Promise<void>((resolve) => {
          setTimeout(resolve, 0);
        });

        inFlightUpdates -= 1;
      });

    const response: Response = await requestAllocateCases(payload);

    expect(response.status).toEqual(204);
    expect(peakInFlightUpdates).toBeLessThanOrEqual(10);
    mockBlaiseApi.verify(
      (api) => api.updateCase(questionnaireName, It.isAny(), It.isAny()),
      Times.exactly(payload.cases.length),
    );
  });

  it("It should log when cases are successfully allocated", async () => {
    const caseId1: string = "1";
    const caseId2: string = "2";
    const editor: string = "jake";
    const payload = buildAllocatePayload({ name: editor, cases: [caseId1, caseId2] });
    const caseFields = { "QEdit.AssignedTo": editor, "QEdit.Edited": 1 };

    mockBlaiseApi.setup((api) => api.updateCase(questionnaireName, caseId1, caseFields));
    mockBlaiseApi.setup((api) => api.updateCase(questionnaireName, caseId2, caseFields));

    await requestAllocateCases(payload);

    mockCloudLogger.verify(
      (logger) =>
        logger.info(
          It.isAny(),
          `Allocated ${payload.cases.length} cases to editor: ${payload.name}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`,
        ),
      Times.once(),
    );
  });

  it.each([500, 404])(
    "It should return a %i response when case allocation fails with an axios error",
    async (statusCode) => {
      const axiosError = createAxiosError(statusCode);
      const payload = buildAllocatePayload();

      setupUpdateCaseFailure(axiosError);

      const response: Response = await requestAllocateCases(payload);

      expect(response.status).toEqual(statusCode);
    },
  );

  it.each([500, 404])(
    "It should log a %i response error when case allocation fails with an axios error",
    async (statusCode) => {
      const axiosError = createAxiosError(statusCode);
      const payload = buildAllocatePayload();

      setupUpdateCaseFailure(axiosError);

      await requestAllocateCases(payload);

      mockCloudLogger.verify(
        (logger) =>
          logger.error(
            It.isAny(),
            `Failed to allocate cases to editor: ${payload.name}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with ${statusCode} ${axiosError}`,
          ),
        Times.once(),
      );
    },
  );

  it("It should return a 500 response when case allocation client throws an error", async () => {
    const clientError = new Error();
    const payload = buildAllocatePayload();

    setupUpdateCaseFailure(clientError);

    const response: Response = await requestAllocateCases(payload);

    expect(response.status).toEqual(500);
  });

  it("It should log a 500 response error when case allocation client throws an error", async () => {
    const clientError = new Error();
    const payload = buildAllocatePayload();

    setupUpdateCaseFailure(clientError);

    await requestAllocateCases(payload);

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          `Failed to allocate cases to editor: ${payload.name}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${clientError}`,
        ),
      Times.once(),
    );
  });
});

describe("set to update case tests", () => {
  const caseFields = {
    "QEdit.AssignedTo": "",
    "QEdit.Edited": "",
    "QEdit.LastUpdated": "01-01-1900_00:00",
  };

  const buildSetToUpdateFixture = (
    overrides: Partial<{ questionnaireName: string; caseId: string }> = {},
  ): {
    questionnaireName: string;
    editQuestionnaireName: string;
    caseId: string;
    setToUpdatePath: string;
  } => {
    const questionnaireName = overrides.questionnaireName ?? "TEST111A";
    const caseId = overrides.caseId ?? "9001";

    return {
      questionnaireName,
      editQuestionnaireName: `${questionnaireName}_EDIT`,
      caseId,
      setToUpdatePath: `/api/questionnaires/${questionnaireName}/cases/${caseId}/update`,
    };
  };

  const requestSetToUpdate = (setToUpdatePath: string) => sut.patch(setToUpdatePath);

  const setupSetToUpdateFailure = (error: unknown): void => {
    mockBlaiseApi
      .setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny()))
      .returns(() => Promise.reject(error));
  };

  beforeEach(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  afterAll(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  it("It should return a 204 response when cases are set to update", async () => {
    const { editQuestionnaireName, caseId, setToUpdatePath } = buildSetToUpdateFixture();

    mockBlaiseApi.setup((api) => api.updateCase(editQuestionnaireName, caseId, caseFields));
    const response: Response = await requestSetToUpdate(setToUpdatePath);

    expect(response.status).toEqual(204);
    mockBlaiseApi.verify(
      (api) => api.updateCase(editQuestionnaireName, caseId, caseFields),
      Times.once(),
    );
  });

  it("It should log when cases are set to update", async () => {
    const { questionnaireName, editQuestionnaireName, caseId, setToUpdatePath } =
      buildSetToUpdateFixture();

    mockBlaiseApi.setup((api) => api.updateCase(editQuestionnaireName, caseId, caseFields));

    await requestSetToUpdate(setToUpdatePath);

    mockCloudLogger.verify(
      (logger) =>
        logger.info(
          It.isAny(),
          `Set to update edit dataset overnight, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`,
        ),
      Times.once(),
    );
  });

  it.each([500, 404])(
    "It should return a %i response when set to update fails with an axios error",
    async (statusCode) => {
      const { setToUpdatePath } = buildSetToUpdateFixture();
      const axiosError = createAxiosError(statusCode);

      setupSetToUpdateFailure(axiosError);
      const response: Response = await requestSetToUpdate(setToUpdatePath);

      expect(response.status).toEqual(statusCode);
    },
  );

  it.each([500, 404])(
    "It should log a %i response error when set to update fails with an axios error",
    async (statusCode) => {
      const { questionnaireName, caseId, setToUpdatePath } = buildSetToUpdateFixture();
      const axiosError = createAxiosError(statusCode);

      setupSetToUpdateFailure(axiosError);
      await requestSetToUpdate(setToUpdatePath);

      mockCloudLogger.verify(
        (logger) =>
          logger.error(
            It.isAny(),
            `Failed to set to update edit dataset overnight, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with ${statusCode} ${axiosError}`,
          ),
        Times.once(),
      );
    },
  );

  it("It should return a 500 response when set to update client throws an error", async () => {
    const clientError = new Error();
    const { setToUpdatePath } = buildSetToUpdateFixture();

    setupSetToUpdateFailure(clientError);
    const response: Response = await requestSetToUpdate(setToUpdatePath);

    expect(response.status).toEqual(500);
  });

  it("It should log a 500 response error when set to update client throws an error", async () => {
    const clientError = new Error();
    const { questionnaireName, caseId, setToUpdatePath } = buildSetToUpdateFixture();

    setupSetToUpdateFailure(clientError);
    await requestSetToUpdate(setToUpdatePath);

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          `Failed to set to update edit dataset overnight, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${clientError}`,
        ),
      Times.once(),
    );
  });
});

describe("questionnaire input validation tests", () => {
  beforeEach(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  it("should return 400 for get case summary with invalid questionnaire name", async () => {
    const response: Response = await sut.get("/api/questionnaires/frs2504a/cases/1/summary");

    expect(response.status).toEqual(400);
    mockBlaiseApi.verify((api) => api.getCase(It.isAny(), It.isAny()), Times.never());
  });

  it("should return 400 for get case edit information with invalid questionnaire name", async () => {
    const response: Response = await sut.get(
      "/api/questionnaires/frs2504a/cases/edit?userRole=SVT%20Editor",
    );

    expect(response.status).toEqual(400);
    mockBlaiseApi.verify((api) => api.getCaseEditInformation(It.isAny()), Times.never());
  });

  it("should return 400 for allocate cases with invalid questionnaire name", async () => {
    const payload = { name: "jake", cases: ["1"] };
    const response: Response = await sut
      .patch("/api/questionnaires/frs2504a/cases/allocate")
      .send(payload);

    expect(response.status).toEqual(400);
    mockBlaiseApi.verify(
      (api) => api.updateCase(It.isAny(), It.isAny(), It.isAny()),
      Times.never(),
    );
  });

  it("should return 400 for set to update with invalid questionnaire name", async () => {
    const response: Response = await sut.patch("/api/questionnaires/frs2504a/cases/9001/update");

    expect(response.status).toEqual(400);
    mockBlaiseApi.verify(
      (api) => api.updateCase(It.isAny(), It.isAny(), It.isAny()),
      Times.never(),
    );
  });
});
