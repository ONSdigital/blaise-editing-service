import { BlaiseApiClient } from "blaise-api-node-client";
import { Auth } from "blaise-login-react-server";
import supertest from "supertest";
import { It, Mock, MockBehavior, Times } from "typemoq";

import nodeServer from "../server.js";
import createAxiosError from "../test-utils/axiosTestHelper.js";
import FakeServerConfigurationProvider from "../test-utils/fakeServerConfigurationProvider.mock.js";
import mockUser from "../test-utils/user.mock.js";
import AuditLogger from "../utils/auditLogger.js";
import BlaiseApi from "../utils/blaiseApi.js";
import { sanitiseForLogging } from "../utils/sanitisation.js";

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

describe("Get Users information tests", () => {
  beforeEach(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  afterAll(() => {
    mockBlaiseApi.reset();
    mockCloudLogger.reset();
  });

  const userRole = "SVT Editor";
  const mockUserList = [
    {
      name: "Jake Bullet",
      role: "SVT Supervisor",
      serverParks: ["gusty"],
      defaultServerPark: "gusty",
    },
    {
      name: "Hulk Hogan",
      role: "SVT Editor",
      serverParks: ["gusty"],
      defaultServerPark: "gusty",
    },
    {
      name: "Barry White",
      role: "SVT Supervisor",
      serverParks: ["gusty"],
      defaultServerPark: "gusty",
    },
  ];

  const filteredUserListObject = [
    {
      name: "Hulk Hogan",
      role: "SVT Editor",
      serverParks: ["gusty"],
      defaultServerPark: "gusty",
    },
  ];

  it("When given a userRole It should return a 200 response with an expected list of users details", async () => {
    mockBlaiseApi.setup((api) => api.getUsers()).returns(async () => mockUserList);

    const response: Response = await sut.get(`/api/users?userRole=${userRole}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(filteredUserListObject);
    mockBlaiseApi.verify((api) => api.getUsers(), Times.once());
  });

  it("When given a userRole It should log the number of users retrieved", async () => {
    mockBlaiseApi.setup((api) => api.getUsers()).returns(async () => mockUserList);

    await sut.get(`/api/users?userRole=${userRole}`);

    mockCloudLogger.verify(
      (logger) =>
        logger.info(
          It.isAny(),
          sanitiseForLogging(
            `AUDIT_LOG: Retrieved ${mockUserList.length} user(s), current user: {name: ${user.name}, role: ${user.role}}`,
          ),
        ),
      Times.once(),
    );
    mockCloudLogger.verify(
      (logger) =>
        logger.info(
          It.isAny(),
          sanitiseForLogging(
            `AUDIT_LOG: Filtered down to ${filteredUserListObject.length} user(s), current user: {name: ${user.name}, role: ${user.role}}`,
          ),
        ),
      Times.once(),
    );
  });

  it("When not given a userRole It should return a 200 response with an expected list of users details", async () => {
    mockBlaiseApi.setup((api) => api.getUsers()).returns(async () => mockUserList);

    const response: Response = await sut.get("/api/users");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(mockUserList);
    mockBlaiseApi.verify((api) => api.getUsers(), Times.once());
  });

  it("When not given a userRole It should log the number of users retrieved", async () => {
    mockBlaiseApi.setup((api) => api.getUsers()).returns(async () => mockUserList);

    await sut.get("/api/users");

    mockCloudLogger.verify(
      (logger) =>
        logger.info(
          It.isAny(),
          sanitiseForLogging(
            `AUDIT_LOG: Retrieved ${mockUserList.length} user(s), current user: {name: ${user.name}, role: ${user.role}}`,
          ),
        ),
      Times.once(),
    );
  });

  it("It should return a 500 response when a call is made to retrieve a list of editing details and the rest api is not availiable", async () => {
    const axiosError = createAxiosError(500);

    mockBlaiseApi.setup((api) => api.getUsers()).returns(() => Promise.reject(axiosError));

    const response: Response = await sut.get("/api/users");

    expect(response.status).toEqual(500);
  });

  it("It should log a 500 response error when a call is made to retrieve a list of editing details and the rest api is not availiable", async () => {
    const axiosError = createAxiosError(500);

    mockBlaiseApi.setup((api) => api.getUsers()).returns(() => Promise.reject(axiosError));

    await sut.get("/api/users");

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          sanitiseForLogging(
            `AUDIT_LOG: Failed to get Users, current user: {name: ${user.name}, role: ${user.role}} with 500 ${axiosError}`,
          ),
        ),
      Times.once(),
    );
  });

  it("It should return a 500 response when the api client throws an error", async () => {
    const apiClientError = new Error();

    mockBlaiseApi.setup((api) => api.getUsers()).returns(() => Promise.reject(apiClientError));

    const response: Response = await sut.get("/api/users");

    expect(response.status).toEqual(500);
  });

  it("It should log a 500 response error when the api client throws an error", async () => {
    const apiClientError = new Error();

    mockBlaiseApi.setup((api) => api.getUsers()).returns(() => Promise.reject(apiClientError));

    await sut.get("/api/users");

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          sanitiseForLogging(
            `AUDIT_LOG: Failed to get Users, current user: {name: ${user.name}, role: ${user.role}} with 500 ${apiClientError}`,
          ),
        ),
      Times.once(),
    );
  });

  it("It should return a 404 response when a call is made to retrieve a list of editing details and the client returns a 404 not found", async () => {
    const axiosError = createAxiosError(404);

    mockBlaiseApi.setup((api) => api.getUsers()).returns(() => Promise.reject(axiosError));

    const response: Response = await sut.get("/api/users");

    expect(response.status).toEqual(404);
  });

  it("It should return a 404 response when a call is made to retrieve a list of editing details and the client returns a 404 not found", async () => {
    const axiosError = createAxiosError(404);

    mockBlaiseApi.setup((api) => api.getUsers()).returns(() => Promise.reject(axiosError));

    await sut.get("/api/users");

    mockCloudLogger.verify(
      (logger) =>
        logger.error(
          It.isAny(),
          sanitiseForLogging(
            `AUDIT_LOG: Failed to get Users, current user: {name: ${user.name}, role: ${user.role}} with 404 ${axiosError}`,
          ),
        ),
      Times.once(),
    );
  });

  it("should return a 400 response when userRole is invalid", async () => {
    const response: Response = await sut.get("/api/users?userRole=!invalid-role");

    expect(response.status).toEqual(400);
    mockBlaiseApi.verify((api) => api.getUsers(), Times.never());
  });
});
