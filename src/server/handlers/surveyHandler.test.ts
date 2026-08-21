import { BlaiseApiClient } from "blaise-api-node-client";
import { Auth } from "blaise-login-react-server";
import supertest from "supertest";
import { It, Mock, MockBehavior, Times } from "typemoq";
import { vi } from "vitest";

import nodeServer from "../server.js";
import createAxiosError from "../test-utils/axiosTestHelper.js";
import FakeServerConfigurationProvider from "../test-utils/fakeServerConfigurationProvider.mock.js";
import mockUser from "../test-utils/user.mock.js";
import AuditLogger from "../utils/auditLogger.js";
import BlaiseApi from "../utils/blaiseApi.js";
import { sanitiseForLogging } from "../utils/sanitisation.js";

import type { QuestionnaireDetails, Survey } from "../../common/types/survey.types.js";
import type { User } from "blaise-api-node-client";
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

const server = nodeServer(configFake, undefined, {
  blaiseApi: mockBlaiseApi.object,
  auditLogger: mockCloudLogger.object,
});

const sut = supertest(server);

describe("Get surveys tests", () => {
  beforeEach(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  afterAll(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  it.each(["SVT Supervisor", "SVT Editor", "FRS Researcher"])(
    "should return a 200 response with an expected list of surveys for the SVT and research Roles",
    async (userRole) => {
      const mockQuestionnaireDetailsList: QuestionnaireDetails[] = [
        {
          questionnaireName: "LMS2101_AA1",
          numberOfCases: 3,
          fieldPeriod: "January 2021",
          surveyTla: "LMS",
        },
        {
          questionnaireName: "LMS2101_AA1_EDIT",
          numberOfCases: 3,
          fieldPeriod: "January 2021",
          surveyTla: "LMS",
        },
        {
          questionnaireName: "FRS2408B",
          numberOfCases: 0,
          fieldPeriod: "August 2024",
          surveyTla: "FRS",
        },
        {
          questionnaireName: "FRS2408B_EDIT",
          numberOfCases: 0,
          fieldPeriod: "August 2024",
          surveyTla: "FRS",
        },
        {
          questionnaireName: "FRS2504A",
          numberOfCases: 1,
          fieldPeriod: "April 2025",
          surveyTla: "FRS",
        },
        {
          questionnaireName: "FRS2504A_EDIT",
          numberOfCases: 1,
          fieldPeriod: "April 2025",
          surveyTla: "FRS",
        },
        {
          questionnaireName: "OPN2201A",
          numberOfCases: 3,
          fieldPeriod: "January 2022",
          surveyTla: "OPN",
        },
        {
          questionnaireName: "OPN2201A_EDIT",
          numberOfCases: 3,
          fieldPeriod: "January 2022",
          surveyTla: "OPN",
        },
      ];

      const mockExpectedSurveyList: Survey[] = [
        {
          name: "FRS",
          questionnaires: [
            {
              questionnaireName: "FRS2408B_EDIT",
              numberOfCases: 0,
              fieldPeriod: "August 2024",
              surveyTla: "FRS",
            },
            {
              questionnaireName: "FRS2504A_EDIT",
              numberOfCases: 1,
              fieldPeriod: "April 2025",
              surveyTla: "FRS",
            },
          ],
        },
      ];

      mockBlaiseApi
        .setup((api) => api.getQuestionnaires())
        .returns(async () => mockQuestionnaireDetailsList);

      const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockExpectedSurveyList);
      mockBlaiseApi.verify((api) => api.getQuestionnaires(), Times.once());
    },
  );

  it.each(["SVT Supervisor", "SVT Editor", "FRS Researcher"])(
    "should log the number of questionnaires and filtered questionnaires for the SVT and research Roles",
    async (userRole) => {
      const mockQuestionnaireDetailsList: QuestionnaireDetails[] = [
        {
          questionnaireName: "LMS2101_AA1",
          numberOfCases: 3,
          fieldPeriod: "January 2021",
          surveyTla: "LMS",
        },
        {
          questionnaireName: "LMS2101_AA1_EDIT",
          numberOfCases: 3,
          fieldPeriod: "January 2021",
          surveyTla: "LMS",
        },
        {
          questionnaireName: "FRS2408B",
          numberOfCases: 0,
          fieldPeriod: "August 2024",
          surveyTla: "FRS",
        },
        {
          questionnaireName: "FRS2408B_EDIT",
          numberOfCases: 0,
          fieldPeriod: "August 2024",
          surveyTla: "FRS",
        },
        {
          questionnaireName: "FRS2504A",
          numberOfCases: 1,
          fieldPeriod: "April 2025",
          surveyTla: "FRS",
        },
        {
          questionnaireName: "FRS2504A_EDIT",
          numberOfCases: 1,
          fieldPeriod: "April 2025",
          surveyTla: "FRS",
        },
        {
          questionnaireName: "OPN2201A",
          numberOfCases: 3,
          fieldPeriod: "January 2022",
          surveyTla: "OPN",
        },
        {
          questionnaireName: "OPN2201A_EDIT",
          numberOfCases: 3,
          fieldPeriod: "January 2022",
          surveyTla: "OPN",
        },
      ];

      const mockExpectedFilteredQuestionnaireList: QuestionnaireDetails[] = [
        {
          questionnaireName: "FRS2408B_EDIT",
          numberOfCases: 0,
          fieldPeriod: "August 2024",
          surveyTla: "FRS",
        },
        {
          questionnaireName: "FRS2504A_EDIT",
          numberOfCases: 1,
          fieldPeriod: "April 2025",
          surveyTla: "FRS",
        },
      ];

      mockBlaiseApi
        .setup((api) => api.getQuestionnaires())
        .returns(async () => mockQuestionnaireDetailsList);

      await sut.get(`/api/surveys?userRole=${userRole}`);

      mockCloudLogger.verify(
        (logger) =>
          logger.info(
            It.isAny(),
            sanitiseForLogging(
              `AUDIT_LOG: Retrieved ${mockQuestionnaireDetailsList.length} questionnaire(s), current user: {name: ${user.name}, role: ${user.role}}`,
            ),
          ),
        Times.once(),
      );
      mockCloudLogger.verify(
        (logger) =>
          logger.info(
            It.isAny(),
            sanitiseForLogging(
              `AUDIT_LOG: Filtered down to ${mockExpectedFilteredQuestionnaireList.length} questionnaire(s), current user: {name: ${user.name}, role: ${user.role}}`,
            ),
          ),
        Times.once(),
      );
    },
  );

  it("should return a 200 response with an expected list of surveys for the Survey Support Role", async () => {
    const userRole = "Survey Support";

    const mockQuestionnaireDetailsList: QuestionnaireDetails[] = [
      {
        questionnaireName: "LMS2101_AA1",
        numberOfCases: 3,
        fieldPeriod: "January 2021",
        surveyTla: "LMS",
      },
      {
        questionnaireName: "LMS2101_AA1_EDIT",
        numberOfCases: 3,
        fieldPeriod: "January 2021",
        surveyTla: "LMS",
      },
      {
        questionnaireName: "FRS2408B",
        numberOfCases: 0,
        fieldPeriod: "August 2024",
        surveyTla: "FRS",
      },
      {
        questionnaireName: "FRS2408B_EDIT",
        numberOfCases: 0,
        fieldPeriod: "August 2024",
        surveyTla: "FRS",
      },
      {
        questionnaireName: "FRS2504A",
        numberOfCases: 1,
        fieldPeriod: "April 2025",
        surveyTla: "FRS",
      },
      {
        questionnaireName: "FRS2504A_EDIT",
        numberOfCases: 1,
        fieldPeriod: "April 2025",
        surveyTla: "FRS",
      },
      {
        questionnaireName: "OPN2201A",
        numberOfCases: 3,
        fieldPeriod: "January 2022",
        surveyTla: "OPN",
      },
      {
        questionnaireName: "OPN2201A_EDIT",
        numberOfCases: 3,
        fieldPeriod: "January 2022",
        surveyTla: "OPN",
      },
    ];

    const mockExpectedSurveyList: Survey[] = [
      {
        name: "FRS",
        questionnaires: [
          {
            questionnaireName: "FRS2408B",
            numberOfCases: 0,
            fieldPeriod: "August 2024",
            surveyTla: "FRS",
          },
          {
            questionnaireName: "FRS2504A",
            numberOfCases: 1,
            fieldPeriod: "April 2025",
            surveyTla: "FRS",
          },
        ],
      },
    ];

    mockBlaiseApi
      .setup((api) => api.getQuestionnaires())
      .returns(async () => mockQuestionnaireDetailsList);

    const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(mockExpectedSurveyList);
    mockBlaiseApi.verify((api) => api.getQuestionnaires(), Times.once());
  });

  it("should log the number of questionnaires and filtered questionnaires for the Survey Support Role", async () => {
    const userRole = "Survey Support";

    const mockQuestionnaireDetailsList: QuestionnaireDetails[] = [
      {
        questionnaireName: "LMS2101_AA1",
        numberOfCases: 3,
        fieldPeriod: "January 2021",
        surveyTla: "LMS",
      },
      {
        questionnaireName: "LMS2101_AA1_EDIT",
        numberOfCases: 3,
        fieldPeriod: "January 2021",
        surveyTla: "LMS",
      },
      {
        questionnaireName: "FRS2408B",
        numberOfCases: 0,
        fieldPeriod: "August 2024",
        surveyTla: "FRS",
      },
      {
        questionnaireName: "FRS2408B_EDIT",
        numberOfCases: 0,
        fieldPeriod: "August 2024",
        surveyTla: "FRS",
      },
      {
        questionnaireName: "FRS2504A",
        numberOfCases: 1,
        fieldPeriod: "April 2025",
        surveyTla: "FRS",
      },
      {
        questionnaireName: "FRS2504A_EDIT",
        numberOfCases: 1,
        fieldPeriod: "April 2025",
        surveyTla: "FRS",
      },
      {
        questionnaireName: "OPN2201A",
        numberOfCases: 3,
        fieldPeriod: "January 2022",
        surveyTla: "OPN",
      },
      {
        questionnaireName: "OPN2201A_EDIT",
        numberOfCases: 3,
        fieldPeriod: "January 2022",
        surveyTla: "OPN",
      },
    ];

    const mockExpectedFilteredQuestionnaireList: QuestionnaireDetails[] = [
      {
        questionnaireName: "FRS2408B",
        numberOfCases: 0,
        fieldPeriod: "August 2024",
        surveyTla: "FRS",
      },
      {
        questionnaireName: "FRS2504A",
        numberOfCases: 1,
        fieldPeriod: "April 2025",
        surveyTla: "FRS",
      },
    ];

    mockBlaiseApi
      .setup((api) => api.getQuestionnaires())
      .returns(async () => mockQuestionnaireDetailsList);

    await sut.get(`/api/surveys?userRole=${userRole}`);

    mockCloudLogger.verify(
      (logger) =>
        logger.info(
          It.isAny(),
          sanitiseForLogging(
            `AUDIT_LOG: Retrieved ${mockQuestionnaireDetailsList.length} questionnaire(s), current user: {name: ${user.name}, role: ${user.role}}`,
          ),
        ),
      Times.once(),
    );
    mockCloudLogger.verify(
      (logger) =>
        logger.info(
          It.isAny(),
          sanitiseForLogging(
            `AUDIT_LOG: Filtered down to ${mockExpectedFilteredQuestionnaireList.length} questionnaire(s), current user: {name: ${user.name}, role: ${user.role}}`,
          ),
        ),
      Times.once(),
    );
  });

  it("It should return a 500 response when a call is made to retrieve a list of surveys and the rest api is not availiable", async () => {
    const axiosError = createAxiosError(500);
    const userRole = "SVT Editor";

    mockBlaiseApi.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(axiosError));

    const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to complete request, please try again in a few minutes",
      },
    });
  });

  it("It should log a 500 response error when a call is made to retrieve a list of surveys and the rest api is not availiable", async () => {
    const axiosError = createAxiosError(500);
    const userRole = "SVT Editor";

    mockBlaiseApi.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(axiosError));

    await sut.get(`/api/surveys?userRole=${userRole}`);

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          sanitiseForLogging(
            `AUDIT_LOG: Failed to get questionnaires, current user: {name: ${user.name}, role: ${user.role}} with 500 ${axiosError}`,
          ),
        ),
      Times.once(),
    );
  });

  it("It should return a 500 response when the api client throws an error", async () => {
    const apiClientError = new Error();
    const userRole = "SVT Editor";

    mockBlaiseApi
      .setup((api) => api.getQuestionnaires())
      .returns(() => Promise.reject(apiClientError));

    const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

    expect(response.status).toEqual(500);
  });

  it("It should log a 500 response erro when the api client throws an error", async () => {
    const apiClientError = new Error();
    const userRole = "SVT Editor";

    mockBlaiseApi
      .setup((api) => api.getQuestionnaires())
      .returns(() => Promise.reject(apiClientError));

    await sut.get(`/api/surveys?userRole=${userRole}`);

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          sanitiseForLogging(
            `AUDIT_LOG: Failed to get questionnaires, current user: {name: ${user.name}, role: ${user.role}} with 500 ${apiClientError}`,
          ),
        ),
      Times.once(),
    );
  });

  it("It should return a 404 response when a call is made to retrieve a list of surveys and the client returns a 404 not found", async () => {
    const axiosError = createAxiosError(404);
    const userRole = "SVT Editor";

    mockBlaiseApi.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(axiosError));

    const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Resource not found",
      },
    });
  });

  it("It should log a 404 response error when a call is made to retrieve a list of surveys and the client returns a 404 not found", async () => {
    const axiosError = createAxiosError(404);
    const userRole = "SVT Editor";

    mockBlaiseApi.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(axiosError));

    await sut.get(`/api/surveys?userRole=${userRole}`);

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          sanitiseForLogging(
            `AUDIT_LOG: Failed to get questionnaires, current user: {name: ${user.name}, role: ${user.role}} with 404 ${axiosError}`,
          ),
        ),
      Times.once(),
    );
  });

  it("should return a 400 response when userRole is missing", async () => {
    const response: Response = await sut.get("/api/surveys");

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      error: {
        code: "BAD_REQUEST",
        message: "Invalid request",
      },
    });
    mockBlaiseApi.verify((api) => api.getQuestionnaires(), Times.never());
  });

  it("should return a 400 response when userRole is invalid", async () => {
    const response: Response = await sut.get("/api/surveys?userRole=!invalid-role");

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      error: {
        code: "BAD_REQUEST",
        message: "Invalid request",
      },
    });
    mockBlaiseApi.verify((api) => api.getQuestionnaires(), Times.never());
  });
});
