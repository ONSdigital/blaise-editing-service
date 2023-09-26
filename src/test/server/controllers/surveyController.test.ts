import supertest, { Response } from 'supertest';
import { IMock, Mock, Times } from 'typemoq';
import nodeServer from '../../../server/server';
import FakeConfigurationProvider from '../configuration/FakeConfigurationProvider';
import createAxiosError from './axiosTestHelper';
import BlaiseApi from '../../../server/api/BlaiseApi';
import surveyAllocationListMockObject from '../../mockObjects/surveyAllocationListMockObject';
import { questionnaireCaseDetailsListMockObject } from '../../mockObjects/questionnaireListMockObject';

// create fake config
const configFake = new FakeConfigurationProvider('restapi.blaise.com', 'dist', 5000, 'gusty', 'cati.blaise.com', 'richlikesricecakes', '12h', ['DST']);

// mock blaise api client
const blaiseApiMock: IMock<BlaiseApi> = Mock.ofType(BlaiseApi);

// need to test the endpoints through the express server
const server = nodeServer(configFake, blaiseApiMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get surveys tests', () => {
  beforeEach(() => {
    blaiseApiMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
  });

  it('It should return a 200 response with an expected list of surveys', async () => {
    // arrange
    // mock blaise client to return a list of questionnaires with allocation
    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(async () => questionnaireCaseDetailsListMockObject);

    // act
    const response: Response = await sut.get('/api/surveys');

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(surveyAllocationListMockObject);
    blaiseApiMock.verify((api) => api.getQuestionnaires(), Times.once());
  });

  it('It should return a 500 response when a call is made to retrieve a list of surveys and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get('/api/surveys');

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 500 response when the api client throws an error', async () => {
    // arrange
    const apiClientError = new Error();

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(apiClientError));

    // act
    const response: Response = await sut.get('/api/surveys');

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 404 response when a call is made to retrieve a list of surveys and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get('/api/surveys');

    // assert
    expect(response.status).toEqual(404);
  });
});
