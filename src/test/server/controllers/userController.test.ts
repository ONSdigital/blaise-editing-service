import supertest, { Response } from 'supertest';
import { IMock, Mock, Times } from 'typemoq';
import { Auth } from 'blaise-login-react-server';
import nodeServer from '../../../server/server';
import BlaiseApi from '../../../server/api/BlaiseApi';
import FakeServerConfigurationProvider from '../configuration/FakeServerConfigurationProvider';
import createAxiosError from './axiosTestHelper';

// create fake config
const configFake = new FakeServerConfigurationProvider();

// mock auth
Auth.prototype.ValidateToken = jest.fn().mockReturnValue(true);

// mock blaise api client
const blaiseApiMock: IMock<BlaiseApi> = Mock.ofType(BlaiseApi);

// need to test the endpoints through the express server
const server = nodeServer(configFake, blaiseApiMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get Users information tests', () => {
  beforeEach(() => {
    blaiseApiMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
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

  it('It should return a 500 response when a call is made to retrieve a list of editing details and the rest api is not availiable', async () => {
    // arrange

    const axiosError = createAxiosError(500);

    blaiseApiMock.setup((api) => api.getUsers()).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get('/api/users');

    // assert
    expect(response.status).toEqual(500);
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

  it('It should return a 404 response when a call is made to retrieve a list of editing details and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);

    blaiseApiMock.setup((api) => api.getUsers()).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get('/api/users');

    // assert
    expect(response.status).toEqual(404);
  });
});
