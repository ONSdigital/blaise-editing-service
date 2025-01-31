import supertest, { Response } from 'supertest';
import { IMock, Mock, Times } from 'typemoq';
import { Auth } from 'blaise-login-react-server';
import BlaiseApiClient from 'blaise-api-node-client';
import nodeServer from '../../../server/server';
import BlaiseApi from '../../../server/api/BlaiseApi';
import FakeServerConfigurationProvider from '../configuration/FakeServerConfigurationProvider';
import createAxiosError from './axiosTestHelper';
import GoogleCloudLogger from '../../../server/logger/googleCloudLogger';

// create fake config
const configFake = new FakeServerConfigurationProvider();

// mock auth
Auth.prototype.ValidateToken = jest.fn().mockReturnValue(true);

// mock blaise api client and cloud logger
const blaiseApiClientMock: IMock<BlaiseApiClient> = Mock.ofType(BlaiseApiClient);
const cloudLoggerMock: IMock<GoogleCloudLogger> = Mock.ofType(GoogleCloudLogger);

// create blaise api
const blaiseApi = new BlaiseApi(configFake, blaiseApiClientMock.object, cloudLoggerMock.object);

// mock blaise api client
const blaiseApiMock: IMock<BlaiseApi> = Mock.ofInstance(blaiseApi);

// need to test the endpoints through the express server
const server = nodeServer(configFake, blaiseApiMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get Users information tests', () => {
  beforeEach(() => {
    blaiseApiMock.reset();
    cloudLoggerMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
    cloudLoggerMock.reset();
  });

  const userRole = 'SVT Editor';
  const userListMockObject = [
    {
      name: 'Jake Bullet',
      role: 'SVT Supervisor',
      serverParks: ['gusty'],
      defaultServerPark: 'gusty',
    },
    {
      name: 'Hulk Hogan',
      role: 'SVT Editor',
      serverParks: ['gusty'],
      defaultServerPark: 'gusty',
    },
    {
      name: 'Barry White',
      role: 'SVT Supervisor',
      serverParks: ['gusty'],
      defaultServerPark: 'gusty',
    },
  ];

  const filteredUserListObject = [{
    name: 'Hulk Hogan',
    role: 'SVT Editor',
    serverParks: ['gusty'],
    defaultServerPark: 'gusty',
  }];

  it('When given a userRole It should return a 200 response with an expected list of users details', async () => {
    // arrange
    blaiseApiMock.setup((api) => api.getUsers()).returns(async () => userListMockObject);

    // act
    const response: Response = await sut.get(`/api/users?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(filteredUserListObject);
    blaiseApiMock.verify((api) => api.getUsers(), Times.once());
  });

  it('When given a userRole It should log the number of users retrieved', async () => {
    // arrange
    blaiseApiMock.setup((api) => api.getUsers()).returns(async () => userListMockObject);

    // act
    await sut.get(`/api/users?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.info(`Retrieved ${userListMockObject.length} user(s)`), Times.once());
    cloudLoggerMock.verify((logger) => logger.info(`Filtered down to ${filteredUserListObject.length} user(s), role: ${userRole}`), Times.once());
  });

  it('When not given a userRole It should return a 200 response with an expected list of users details', async () => {
    // arrange
    blaiseApiMock.setup((api) => api.getUsers()).returns(async () => userListMockObject);

    // act
    const response: Response = await sut.get('/api/users');

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(userListMockObject);
    blaiseApiMock.verify((api) => api.getUsers(), Times.once());
  });

  it('When not given a userRole It should log the number of users retrieved', async () => {
    // arrange
    blaiseApiMock.setup((api) => api.getUsers()).returns(async () => userListMockObject);

    // act
    await sut.get('/api/users');

    // assert
    cloudLoggerMock.verify((logger) => logger.info(`Retrieved ${userListMockObject.length} user(s)`), Times.once());
  });

  it('It should return a 500 response when a call is made to retrieve a list of editing details and the rest api is not availiable', async () => {
    // arrange

    const axiosError = createAxiosError(500);

    blaiseApiMock.setup((api) => api.getUsers()).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get('/api/users');

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should log a 500 response error when a call is made to retrieve a list of editing details and the rest api is not availiable', async () => {
    // arrange

    const axiosError = createAxiosError(500);

    blaiseApiMock.setup((api) => api.getUsers()).returns(() => Promise.reject(axiosError));

    // act
    await sut.get('/api/users');

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get Users with 500 ${axiosError}`), Times.once());
  });

  it('It should return a 500 response when the api client throws an error', async () => {
    // arrange
    const apiClientError = new Error();

    blaiseApiMock.setup((api) => api.getUsers()).returns(() => Promise.reject(apiClientError));

    // act
    const response: Response = await sut.get('/api/users');

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should log a 500 response error when the api client throws an error', async () => {
    // arrange
    const apiClientError = new Error();

    blaiseApiMock.setup((api) => api.getUsers()).returns(() => Promise.reject(apiClientError));

    // act
    await sut.get('/api/users');

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get Users with 500 ${apiClientError}`), Times.once());
  });

  it('It should return a 404 response when a call is made to retrieve a list of editing details and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);

    blaiseApiMock.setup((api) => api.getUsers()).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get('/api/users');

    // assert
    expect(response.status).toEqual(404);
  });

  it('It should return a 404 response when a call is made to retrieve a list of editing details and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);

    blaiseApiMock.setup((api) => api.getUsers()).returns(() => Promise.reject(axiosError));

    // act
    await sut.get('/api/users');

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get Users with 404 ${axiosError}`), Times.once());
  });
});
