import supertest, { Response } from 'supertest';
import { IMock, Mock, Times } from 'typemoq';
import nodeServer from '../../../server/server';
import createAxiosError from './axiosTestHelper';
import BlaiseApi from '../../../server/api/BlaiseApi';
import FakeServerConfigurationProvider from '../configuration/FakeServerConfigurationProvider';
import { caseDetailsListMockObject, caseFactsheetMockObject } from '../../mockObjects/caseMockObject';

// create fake config
const configFake = new FakeServerConfigurationProvider();

// mock blaise api client
const blaiseApiMock: IMock<BlaiseApi> = Mock.ofType(BlaiseApi);

// need to test the endpoints through the express server
const server = nodeServer(configFake, blaiseApiMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get case list tests', () => {
  const username = 'toby';

  beforeEach(() => {
    blaiseApiMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
  });

  it('It should return a 200 response with an expected list of cases', async () => {
    // arrange
    // mock blaise client to return a list of cases
    const questionnaireName: string = 'OPN2201A';

    blaiseApiMock.setup((api) => api.getCaseDetails(questionnaireName, username)).returns(async () => caseDetailsListMockObject);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases?username=${username}`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(caseDetailsListMockObject);
    blaiseApiMock.verify((api) => api.getCaseDetails(questionnaireName, username), Times.once());
  });

  it('It should return a 500 response when a call is made to retrieve a list of cases and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const questionnaireName: string = 'OPN2201A';

    blaiseApiMock.setup((api) => api.getCaseDetails(questionnaireName, username)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases?username=${username}`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 500 response when the api client throws an error', async () => {
    // arrange
    const clientError = new Error();
    const questionnaireName: string = 'OPN2201A';

    blaiseApiMock.setup((api) => api.getCaseDetails(questionnaireName, username)).returns(() => Promise.reject(clientError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases?username=${username}`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 404 response when a call is made to retrieve a list of cases and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);
    const questionnaireName: string = 'OPN2201A';

    blaiseApiMock.setup((api) => api.getCaseDetails(questionnaireName, username)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases?username=${username}`);

    // assert
    expect(response.status).toEqual(404);
  });
});

describe('Get case fact sheet tests', () => {
  beforeEach(() => {
    blaiseApiMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
  });

  it('It should return a 200 response with expected case fact sheet', async () => {
    // arrange
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiMock.setup((api) => api.getCaseFactsheet(questionnaireName, caseId)).returns(async () => caseFactsheetMockObject);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.text).toEqual(JSON.stringify(caseFactsheetMockObject));
    blaiseApiMock.verify((api) => api.getCaseFactsheet(questionnaireName, caseId), Times.once());
  });

  it('It should return a 500 response when a call is made to retrieve a case and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiMock.setup((api) => api.getCaseFactsheet(questionnaireName, caseId)).returns(() => Promise.reject(axiosError));

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

    blaiseApiMock.setup((api) => api.getCaseFactsheet(questionnaireName, caseId)).returns(() => Promise.reject(clientError));

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

    blaiseApiMock.setup((api) => api.getCaseFactsheet(questionnaireName, caseId)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`);

    // assert
    expect(response.status).toEqual(404);
  });
});
