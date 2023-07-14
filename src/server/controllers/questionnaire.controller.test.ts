import supertest, { Response } from 'supertest';
import BlaiseClient, { IQuestionnaire, QuestionnaireListMockObject } from 'blaise-api-node-client';
import { IMock, Mock, Times } from 'typemoq';
import nodeServer from '../server';
import FakeConfiguration from '../configuration/configuration.fake';

// create fake config
const configFake = new FakeConfiguration('restapi.blaise.com', 'dist', 5000, 'gusty', 'cati.blaise.com');

// mock blaise api client
const blaiseApiClientMock: IMock<BlaiseClient> = Mock.ofType(BlaiseClient);

// need to test the endpoints through the express server
const server = nodeServer(configFake, blaiseApiClientMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get questionnaire tests', () => {
  beforeEach(() => {
    blaiseApiClientMock.reset();
  });

  afterAll(() => {
    blaiseApiClientMock.reset();
  });

  it('It should return a 200 response with an expected list of questonnaires', async () => {
    // arrange
    // mock blaise client to return a list of questionnaires
    const questionnaireList: IQuestionnaire[] = QuestionnaireListMockObject;
    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(async () => questionnaireList);

    // act
    const response: Response = await sut.get('/api/questionnaires');

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(questionnaireList);
    blaiseApiClientMock.verify((client) => client.getQuestionnaires(configFake.ServerPark), Times.once());
  });

  it('It should return a 500 response when a call is made to retireve a list of questionnaires and the rest api is not availiable', async () => {
    // arrange
    // eslint-prefer-promise-reject-error
    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(() => Promise.reject({ response: { status: 500 } }));

    // act
    const response: Response = await sut.get('/api/questionnaires');

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 404 response when a call is made to retireve a list of questionnaires and the server park does not exist', async () => {
    // arrange
    // eslint-prefer-promise-reject-error
    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(() => Promise.reject({ response: { status: 404 }, isAxiosError: true }));

    // act
    const response: Response = await sut.get('/api/questionnaires');

    // assert
    expect(response.status).toEqual(404);
  });
});
