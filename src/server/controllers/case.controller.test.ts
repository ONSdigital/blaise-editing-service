import supertest, { Response } from 'supertest';
import BlaiseClient, { ICaseStatus, Outcome } from 'blaise-api-node-client';
import { IMock, Mock, Times } from 'typemoq';
import nodeServer from '../server';
import FakeConfiguration from '../configuration/configuration.fake';
import { ICaseDetails } from '../interfaces/case.details.interface';
import { createAxiosError } from './axios.helper';

// create fake config
const configFake = new FakeConfiguration('restapi.blaise.com', 'dist', 5000, 'gusty', 'cati.blaise.com');

// mock blaise api client
const blaiseApiClientMock: IMock<BlaiseClient> = Mock.ofType(BlaiseClient);

// need to test the endpoints through the express server
const server = nodeServer(configFake, blaiseApiClientMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get case tests', () => {
  beforeEach(() => {
    blaiseApiClientMock.reset();
  });

  afterAll(() => {
    blaiseApiClientMock.reset();
  });

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

    blaiseApiClientMock.setup((client) => client.getCaseStatus(configFake.ServerPark, questionnaireName)).returns(async () => caseStatusList);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expectedCasesList);
    blaiseApiClientMock.verify((client) => client.getCaseStatus(configFake.ServerPark, questionnaireName), Times.once());
  });

  it('It should return a 500 response when a call is made to retrieve a list of cases and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const questionnaireName: string = 'TEST111A';

    blaiseApiClientMock.setup((client) => client.getCaseStatus(configFake.ServerPark, questionnaireName)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 500 response when the api client throws an error', async () => {
    // arrange
    const clientError = new Error();
    const questionnaireName: string = 'TEST111A';

    blaiseApiClientMock.setup((client) => client.getCaseStatus(configFake.ServerPark, questionnaireName)).returns(() => Promise.reject(clientError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 404 response when a call is made to retrieve a list of cases and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);
    const questionnaireName: string = 'TEST111A';

    blaiseApiClientMock.setup((client) => client.getCaseStatus(configFake.ServerPark, questionnaireName)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases`);

    // assert
    expect(response.status).toEqual(404);
  });
});
