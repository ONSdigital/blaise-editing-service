import supertest, { Response } from 'supertest';
import BlaiseClient, { ICaseStatus, CaseStatusListMockObject } from 'blaise-api-node-client';
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

describe('Get case tests', () => {
  it('It should return a 200 response with an expected list of cases', async () => {
    // arrange
    // mock blaise client to return a list of cases
    const questionnaire: string = 'TEST111A';
    const caseList: ICaseStatus[] = CaseStatusListMockObject;
    blaiseApiClientMock.setup((client) => client.getCaseStatus('gusty', questionnaire)).returns(async () => caseList);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaire}/cases/status`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(caseList);
    blaiseApiClientMock.verify((client) => client.getCaseStatus('gusty', questionnaire), Times.once());
  });
});
