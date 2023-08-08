import supertest, { Response } from 'supertest';
import BlaiseClient, { CaseStatus, CaseStatusListMockObject, CaseResponseMockObject } from 'blaise-api-node-client';
import { IMock, Mock, Times } from 'typemoq';
import nodeServer from '../../../server/server';
import FakeConfiguration from '../configuration/configuration.fake';
import { CaseDetails, CaseFactsheet } from '../../../common/interfaces/case.interface';
import createAxiosError from './axios.test.helper';
import { mapCaseDetails, mapCaseFactsheet } from '../../../server/mappers/case.mapper';

// create fake config
const configFake = new FakeConfiguration('restapi.blaise.com', 'dist', 5000, 'gusty', 'cati.blaise.com');

// mock blaise api client
const blaiseApiClientMock: IMock<BlaiseClient> = Mock.ofType(BlaiseClient);

// need to test the endpoints through the express server
const server = nodeServer(configFake, blaiseApiClientMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get case list tests', () => {
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
    const caseStatusList: CaseStatus[] = CaseStatusListMockObject;
    const expectedCaseDetailsList: CaseDetails[] = mapCaseDetails(caseStatusList, questionnaireName, configFake.ExternalWebUrl);

    blaiseApiClientMock.setup((client) => client.getCaseStatus(configFake.ServerPark, questionnaireName)).returns(async () => caseStatusList);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expectedCaseDetailsList);
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

describe('Get case fact sheet tests', () => {
  beforeEach(() => {
    blaiseApiClientMock.reset();
  });

  afterAll(() => {
    blaiseApiClientMock.reset();
  });

  it('It should return a 200 response with expected case fact sheet', async () => {
    // arrange
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiClientMock.setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId)).returns(async () => CaseResponseMockObject);
    const expectedCaseFactsheet: CaseFactsheet = mapCaseFactsheet(CaseResponseMockObject);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expectedCaseFactsheet);
    blaiseApiClientMock.verify((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId), Times.once());
  });

  it('It should return a 500 response when a call is made to retrieve a case and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiClientMock.setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 500 response when the api client throws an error', async () => {
    // arrange
    const clientError = new Error();
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiClientMock.setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId)).returns(() => Promise.reject(clientError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 404 response when a call is made to retrieve a case and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiClientMock.setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`);

    // assert
    expect(response.status).toEqual(404);
  });

  it('It should return an error when the mapper throws an error', async () => {
    // arrange
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';
    jest.mock('../../../server/mappers/case.mapper');

    const mapCaseFactsheetMock = mapCaseFactsheet as jest.Mock<CaseFactsheet>;

    blaiseApiClientMock.setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId)).returns(async () => CaseResponseMockObject);
    mapCaseFactsheetMock.mockImplementation(() => {throw new Error('Error message');});

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`);

    // assert
    expect(response.status).toEqual(500);
  });
});
