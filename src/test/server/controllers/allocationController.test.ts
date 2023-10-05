import supertest, { Response } from 'supertest';
import { IMock, Mock, Times } from 'typemoq';
import nodeServer from '../../../server/server';
import createAxiosError from './axiosTestHelper';
import BlaiseApi from '../../../server/api/BlaiseApi';
import FakeServerConfigurationProvider from '../configuration/FakeServerConfigurationProvider';
import { allocationDetailsMockObject } from '../../mockObjects/questionnaireAllocationMockObject';

// create fake config
const configFake = new FakeServerConfigurationProvider();

// mock blaise api client
const blaiseApiMock: IMock<BlaiseApi> = Mock.ofType(BlaiseApi);

// need to test the endpoints through the express server
const server = nodeServer(configFake, blaiseApiMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get allocation details tests', () => {
  const questionnaireName = 'LMS2101_AA1';

  beforeEach(() => {
    blaiseApiMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
  });

  it('It should return a 200 response with allocation details', async () => {
    // arrange
    // mock blaise client to return a list of questionnaires with allocation
    blaiseApiMock.setup((api) => api.getAllocationDetails(questionnaireName)).returns(async () => allocationDetailsMockObject);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/allocation`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(allocationDetailsMockObject);
    blaiseApiMock.verify((api) => api.getAllocationDetails(questionnaireName), Times.once());
  });

  it('It should return a 500 response when a call is made to retrieve a list of surveys and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);

    blaiseApiMock.setup((api) => api.getAllocationDetails(questionnaireName)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/allocation`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 500 response when the api client throws an error', async () => {
    // arrange
    const apiClientError = new Error();

    blaiseApiMock.setup((api) => api.getAllocationDetails(questionnaireName)).returns(() => Promise.reject(apiClientError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/allocation`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 404 response when a call is made to retrieve a list of surveys and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);

    blaiseApiMock.setup((api) => api.getAllocationDetails(questionnaireName)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/allocation`);

    // assert
    expect(response.status).toEqual(404);
  });
});
