import supertest, { Response } from 'supertest';
import BlaiseClient, { CaseStatus } from 'blaise-api-node-client';
import { IMock, Mock, Times } from 'typemoq';
import { Config } from '../config';
import nodeServer from '../server';

// mock config
const configMock:IMock<Config> = Mock.ofType<Config>();
configMock.setup((config) => config.BuildFolder).returns(() => 'dist');
configMock.setup((config) => config.Port).returns(() => 5000);
configMock.setup((config) => config.BlaiseApiUrl).returns(() => 'localhost');

// mock blaise api client
const blaiseApiClientMock: IMock<BlaiseClient> = Mock.ofType(BlaiseClient);

// need to test the endpoints through the express server
const server = nodeServer(configMock.object, blaiseApiClientMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get case tests', () => {
  it('It should return a 200 response with an expected list of cases', async () => {
    // arrange
    // mock blaise client to return a list of cases
    const questionnaire: string = 'TEST111A';
    const caseList: CaseStatus[] = []; // sort mock cases
    blaiseApiClientMock.setup((client) => client.getCaseStatus('gusty', questionnaire)).returns(async () => caseList);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaire}/cases/status`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(caseList);
    blaiseApiClientMock.verify((client) => client.getCaseStatus('gusty', questionnaire), Times.once());
  });
});
