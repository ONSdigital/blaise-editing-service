import supertest, { Response } from 'supertest';
import BlaiseClient, { QuestionnaireListMockObject } from 'blaise-api-node-client';
import { IMock, Mock, Times } from 'typemoq';
import nodeServer from '../../../server/server';
import FakeConfiguration from '../configuration/fakeConfiguration';
import createAxiosError from './axiosTestHelper';
import surveyListMockObject from '../../mockObjects/surveyListMockObject';
import { Survey } from '../../../common/interfaces/surveyInterface';
import mapSurveys from '../../../server/mappers/surveyMapper';

// create fake config
const configFake = new FakeConfiguration('restapi.blaise.com', 'dist', 5000, 'gusty', 'cati.blaise.com');

// mock blaise api client
const blaiseApiClientMock: IMock<BlaiseClient> = Mock.ofType(BlaiseClient);

// mock survey mapper
jest.mock('../../../server/mappers/surveyMapper');

// need to test the endpoints through the express server
const server = nodeServer(configFake, blaiseApiClientMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get surveys tests', () => {
  beforeEach(() => {
    blaiseApiClientMock.reset();
  });

  afterAll(() => {
    blaiseApiClientMock.reset();
  });

  it('It should return a 200 response with an expected list of surveys', async () => {
    // arrange
    // mock blaise client to return a list of questionnaires
    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(async () => QuestionnaireListMockObject);

    const surveyMapperMock = mapSurveys as jest.Mock<Survey[]>;
    surveyMapperMock.mockReturnValueOnce(surveyListMockObject);

    // act
    const response: Response = await sut.get('/api/surveys');

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(surveyListMockObject);
    blaiseApiClientMock.verify((client) => client.getQuestionnaires(configFake.ServerPark), Times.once());
  });

  it('It should return a 500 response when a call is made to retrieve a list of surveys and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);

    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get('/api/surveys');

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 500 response when the api client throws an error', async () => {
    // arrange
    const apiClientError = new Error();

    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(() => Promise.reject(apiClientError));

    // act
    const response: Response = await sut.get('/api/surveys');

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 404 response when a call is made to retrieve a list of surveys and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);

    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get('/api/surveys');

    // assert
    expect(response.status).toEqual(404);
  });
});
