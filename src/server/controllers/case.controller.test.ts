import supertest, { Response } from 'supertest';
import BlaiseClient, { ICaseStatus, Outcome } from 'blaise-api-node-client';
import { IMock, Mock, Times } from 'typemoq';
import nodeServer from '../server';
import FakeConfiguration from '../configuration/configuration.fake';
import { ICaseDetails } from '../interfaces/case.details.interface';

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
    const questionnaireName: string = 'TEST111A';
    const caseStatusList: ICaseStatus[] = [
      {
        primaryKey: '1',
        outcome: Outcome.Completed,
      },
      {
        primaryKey: '2',
        outcome: Outcome.Partial,
      },
      {
        primaryKey: '3',
        outcome: Outcome.AppointmentMade,
      },
    ];

    const expectedCasesList: ICaseDetails[] = [
      {
        CaseId: '1',
        CaseStatus: Outcome.Completed,
        CaseLink: `https://${configFake.ExternalWebUrl}/${questionnaireName}?Mode=CAWI&KeyValue=1`,
      },
      {
        CaseId: '2',
        CaseStatus: Outcome.Partial,
        CaseLink: `https://${configFake.ExternalWebUrl}/${questionnaireName}?Mode=CAWI&KeyValue=2`,
      },
      {
        CaseId: '3',
        CaseStatus: Outcome.AppointmentMade,
        CaseLink: `https://${configFake.ExternalWebUrl}/${questionnaireName}?Mode=CAWI&KeyValue=3`,
      },
    ];

    blaiseApiClientMock.setup((client) => client.getCaseStatus('gusty', questionnaireName)).returns(async () => caseStatusList);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expectedCasesList);
    blaiseApiClientMock.verify((client) => client.getCaseStatus('gusty', questionnaireName), Times.once());
  });
});
