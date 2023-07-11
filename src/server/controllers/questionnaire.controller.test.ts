import supertest, { Response } from 'supertest';
import BlaiseClient, { IQuestionnaire, QuestionnaireListMockObject } from 'blaise-api-node-client';
import { IMock, Mock, Times } from 'typemoq';
import nodeServer from '../server';
import { IConfiguration } from '../interfaces/configuration.interface';

// mock config
const configMock:IMock<IConfiguration> = Mock.ofType<IConfiguration>();
configMock.setup((config) => config.BuildFolder).returns(() => 'dist');
configMock.setup((config) => config.Port).returns(() => 5000);
configMock.setup((config) => config.BlaiseApiUrl).returns(() => 'localhost');
configMock.setup((config) => config.ServerPark).returns(() => 'gusty');

// mock blaise api client
const blaiseApiClientMock: IMock<BlaiseClient> = Mock.ofType(BlaiseClient);

// need to test the endpoints through the express server
const server = nodeServer(configMock.object, blaiseApiClientMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get questionnaire tests', () => {
  it('It should return a 200 response with an expected list of questonnaires', async () => {
    // arrange
    // mock blaise client to return a list of questionnaires
    const questionnaireList: IQuestionnaire[] = QuestionnaireListMockObject;
    blaiseApiClientMock.setup((client) => client.getQuestionnaires('gusty')).returns(async () => questionnaireList);

    // act
    const response: Response = await sut.get('/api/questionnaires');

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(questionnaireList);
    blaiseApiClientMock.verify((client) => client.getQuestionnaires('gusty'), Times.once());
  });
});
