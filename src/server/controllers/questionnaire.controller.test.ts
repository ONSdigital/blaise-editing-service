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
