import supertest, { Response } from 'supertest';
import BlaiseClient, { CaseResponse, CaseStatus, CaseStatusListMockObject } from 'blaise-api-node-client';
import { IMock, Mock, Times } from 'typemoq';
import nodeServer from '../../../server/server';
import FakeConfiguration from '../configuration/fakeConfiguration';
import { CaseDetails, CaseFactsheetDetails } from '../../../common/interfaces/caseInterface';
import createAxiosError from './axiosTestHelper';
import { mapCaseDetails, mapCaseFactsheet } from '../../../server/mappers/caseMapper';
import CaseBuilder from '../../builders/caseBuilder';
import CaseDetailsBuilder from '../../builders/caseDetailsBuilder';

// create fake config
const configFake = new FakeConfiguration('restapi.blaise.com', 'dist', 5000, 'gusty', 'cati.blaise.com');

// mock blaise api client
const blaiseApiClientMock: IMock<BlaiseClient> = Mock.ofType(BlaiseClient);

// mock case mappers
jest.mock('../../../server/mappers/caseMapper');

// create case mock objects
const caseBuilder = new CaseBuilder(2);
const CaseResponseMockObject: CaseResponse = caseBuilder.buildCaseResponse();
const CaseFactsheetMockObject: CaseFactsheetDetails = caseBuilder.buildCaseFactsheet();

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

  it.each([1, 2, 3, 4])('It should return a 200 response with an expected list of cases', async (value) => {
    // arrange
    // mock blaise client to return a list of cases
    const questionnaireName: string = 'TEST111A';
    const caseStatusList: CaseStatus[] = CaseStatusListMockObject;
    const caseDetailsBuider = new CaseDetailsBuilder(value);
    const caseDetailsListMockObject = caseDetailsBuider.BuildCaseDetails();
    const mapCaseDetailsMock = mapCaseDetails as jest.Mock<CaseDetails[]>;

    mapCaseDetailsMock.mockReturnValueOnce(caseDetailsListMockObject);

    blaiseApiClientMock.setup((client) => client.getCaseStatus(configFake.ServerPark, questionnaireName)).returns(async () => caseStatusList);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(caseDetailsListMockObject);
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
    const mapCasefactsheetMock = mapCaseFactsheet as jest.Mock<CaseFactsheetDetails>;

    mapCasefactsheetMock.mockReturnValue(CaseFactsheetMockObject);

    blaiseApiClientMock.setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId)).returns(async () => CaseResponseMockObject);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.text).toEqual(JSON.stringify(CaseFactsheetMockObject));
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
    const mapCaseFactsheetMock = mapCaseFactsheet as jest.Mock<CaseFactsheetDetails>;
    mapCaseFactsheetMock.mockImplementation(() => { throw new Error('Error message'); });

    blaiseApiClientMock.setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId)).returns(async () => CaseResponseMockObject);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`);

    // assert
    expect(response.status).toEqual(500);
  });
});
