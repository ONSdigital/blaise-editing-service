import supertest, { Response } from 'supertest';
import {
  IMock, It, Mock, Times,
} from 'typemoq';
import BlaiseApiClient, {
  CaseEditInformation, CaseOutcome, EditedStatus, User,
} from 'blaise-api-node-client';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import { Auth } from 'blaise-login-react-server';
import nodeServer from '../../../server/server';
import createAxiosError from './axiosTestHelper';
import BlaiseApi from '../../../server/api/BlaiseApi';
import FakeServerConfigurationProvider from '../configuration/FakeServerConfigurationProvider';
import { caseResponseMockObject, caseSummaryDetailsMockObject } from '../mockObjects/CaseMockObject';
import GoogleCloudLogger from '../../../server/logger/googleCloudLogger';
import userMockObject from '../mockObjects/userMockObject';

// create fake config
const configFake = new FakeServerConfigurationProvider();

// mock User
const user: User = userMockObject;

// mock auth
Auth.prototype.ValidateToken = jest.fn().mockReturnValue(true);
Auth.prototype.GetUser = jest.fn().mockReturnValue({ name: user.name, role: user.role });

// mock blaise api client and cloud logger
const blaiseApiClientMock: IMock<BlaiseApiClient> = Mock.ofType(BlaiseApiClient);
const cloudLoggerMock: IMock<GoogleCloudLogger> = Mock.ofType(GoogleCloudLogger);

// create blaise api
const blaiseApi = new BlaiseApi(configFake, blaiseApiClientMock.object, cloudLoggerMock.object);

// mock blaise api client
const blaiseApiMock: IMock<BlaiseApi> = Mock.ofInstance(blaiseApi);

// need to test the endpoints through the express server
const server = nodeServer(configFake, blaiseApiMock.object);

// supertest will handle all http calls
const sut = supertest(server);

// Using Node.js `assert`
// const assert = require('assert').strict;

const validUserRoles:string[] = ['SVT Supervisor', 'SVT Editor'];

describe('Get case summary tests', () => {
  beforeEach(() => {
    blaiseApiMock.reset();
    cloudLoggerMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
    cloudLoggerMock.reset();
  });

  it('It should return a 200 response with expected case summary', async () => {
    // arrange
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiMock.setup((api) => api.getCase(questionnaireName, caseId)).returns(async () => caseResponseMockObject);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.text).toEqual(JSON.stringify(caseSummaryDetailsMockObject));
    blaiseApiMock.verify((api) => api.getCase(questionnaireName, caseId), Times.once());
  });

  it('It should return a 200 response with expected case summary', async () => {
    // arrange
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiMock.setup((api) => api.getCase(questionnaireName, caseId)).returns(async () => caseResponseMockObject);

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`);

    // assert
    cloudLoggerMock.verify((logger) => logger.info(`Retrieved case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`), Times.once());
  });

  it('It should return a 500 response when a call is made to retrieve a case and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiMock.setup((api) => api.getCase(questionnaireName, caseId)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should log a 500 response error when a call is made to retrieve a case and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiMock.setup((api) => api.getCase(questionnaireName, caseId)).returns(() => Promise.reject(axiosError));

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get case details, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${axiosError}`), Times.once());
  });

  it('It should return a 500 response when the api client throws an error', async () => {
    // arrange
    const clientError = new Error();
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiMock.setup((api) => api.getCase(questionnaireName, caseId)).returns(() => Promise.reject(clientError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should log a 500 response error when the api client throws an error', async () => {
    // arrange
    const clientError = new Error();
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiMock.setup((api) => api.getCase(questionnaireName, caseId)).returns(() => Promise.reject(clientError));

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get case details, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${clientError}`), Times.once());
  });

  it('It should return a 404 response when a call is made to retrieve a case and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiMock.setup((api) => api.getCase(questionnaireName, caseId)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`);

    // assert
    expect(response.status).toEqual(404);
  });

  it('It should log a 404 response error when a call is made to retrieve a case and the client returns a 404 not found', async () => {
  // arrange
    const axiosError = createAxiosError(404);
    const caseId: string = '1';
    const questionnaireName: string = 'TEST111A';

    blaiseApiMock.setup((api) => api.getCase(questionnaireName, caseId)).returns(() => Promise.reject(axiosError));

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/${caseId}/summary`);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get case details, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 404 ${axiosError}`), Times.once());
  });
});

describe('Get case edit information tests', () => {
  beforeEach(() => {
    blaiseApiMock.reset();
    cloudLoggerMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
    cloudLoggerMock.reset();
  });

  it.each(validUserRoles)('should return a 200 response with an expected filtered list of case edit details When given a valid questionnaire and userRole', async (userRole) => {
    // arrange
    const questionnaireName = 'FRS2504A';

    const caseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.Completed,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001013',
        outcome: CaseOutcome.Partial,
        assignedTo: 'Julie',
        interviewer: '',
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001014',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'Sarah',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001015',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly',
      },
    ];

    const filteredCaseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.Completed,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001014',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'Sarah',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001015',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly',
      },
    ];

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => caseEditInformationListMockObject);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(filteredCaseEditInformationListMockObject);
    blaiseApiMock.verify((api) => api.getCaseEditInformation(questionnaireName), Times.once());
  });

  it.each(validUserRoles)('should log the number of case and filtered cases When given a valid questionnaire and userRole', async (userRole) => {
    // arrange
    const questionnaireName = 'FRS2504A';

    const caseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.Completed,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001013',
        outcome: CaseOutcome.Partial,
        assignedTo: 'Julie',
        interviewer: '',
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001014',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'Sarah',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001015',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly',
      },
    ];

    const filteredCaseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.Completed,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001014',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'Sarah',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001015',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly',
      },
    ];

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => caseEditInformationListMockObject);

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.info(`Retrieved ${caseEditInformationListMockObject.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`), Times.once());
    cloudLoggerMock.verify((logger) => logger.info(`Filtered down to ${filteredCaseEditInformationListMockObject.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`), Times.once());
  });

  it.each(validUserRoles)('should return a 200 response with an expected filtered list of case edit details When outcome codes match role', async (userRole) => {
    // arrange
    const questionnaireName = 'FRS2504A';

    const caseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001013',
        outcome: CaseOutcome.Partial,
        assignedTo: 'Julie',
        interviewer: '',
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001014',
        outcome: CaseOutcome.CompletedProxy,
        assignedTo: 'Sarah',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001015',
        outcome: CaseOutcome.Partial,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly',
      },
    ];

    const filteredCaseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001014',
        outcome: CaseOutcome.CompletedProxy,
        assignedTo: 'Sarah',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
      },
    ];

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => caseEditInformationListMockObject);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(filteredCaseEditInformationListMockObject);
    blaiseApiMock.verify((api) => api.getCaseEditInformation(questionnaireName), Times.once());
  });

  it.each(validUserRoles)('should log the number of cases and filtered cases When outcome codes match role', async (userRole) => {
    // arrange
    const questionnaireName = 'FRS2504A';

    const caseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001013',
        outcome: CaseOutcome.Partial,
        assignedTo: 'Julie',
        interviewer: '',
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001014',
        outcome: CaseOutcome.CompletedProxy,
        assignedTo: 'Sarah',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001015',
        outcome: CaseOutcome.Partial,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly',
      },
    ];

    const filteredCaseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001014',
        outcome: CaseOutcome.CompletedProxy,
        assignedTo: 'Sarah',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
      },
    ];

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => caseEditInformationListMockObject);

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.info(`Retrieved ${caseEditInformationListMockObject.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`), Times.once());
    cloudLoggerMock.verify((logger) => logger.info(`Filtered down to ${filteredCaseEditInformationListMockObject.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`), Times.once());
  });

  it.each(validUserRoles)('should return a 200 response with an expected filtered list of case edit details When organisation match role', async (userRole) => {
    // arrange
    const questionnaireName = 'FRS2504A';

    const caseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.NatCen,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001013',
        outcome: CaseOutcome.Partial,
        assignedTo: 'Julie',
        interviewer: '',
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001014',
        outcome: CaseOutcome.CompletedProxy,
        assignedTo: 'Sarah',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.Nisra,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001015',
        outcome: CaseOutcome.Partial,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly',
      },
    ];

    const filteredCaseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
    ];

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => caseEditInformationListMockObject);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(filteredCaseEditInformationListMockObject);
    blaiseApiMock.verify((api) => api.getCaseEditInformation(questionnaireName), Times.once());
  });

  it.each(validUserRoles)('should log the number of cases and filtered cases When organisation match role', async (userRole) => {
    // arrange
    const questionnaireName = 'FRS2504A';

    const caseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.NatCen,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001013',
        outcome: CaseOutcome.Partial,
        assignedTo: 'Julie',
        interviewer: '',
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001014',
        outcome: CaseOutcome.CompletedProxy,
        assignedTo: 'Sarah',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.Nisra,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001015',
        outcome: CaseOutcome.Partial,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly',
      },
    ];

    const filteredCaseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
    ];

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => caseEditInformationListMockObject);

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.info(`Retrieved ${caseEditInformationListMockObject.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`), Times.once());
    cloudLoggerMock.verify((logger) => logger.info(`Filtered down to ${filteredCaseEditInformationListMockObject.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`), Times.once());
  });

  it('should return a 200 response with a list of all case edit details When the Outcome Filter list is empty', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const userRole = 'SVT AllOutcomes';
    const caseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.Completed,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001013',
        outcome: CaseOutcome.Partial,
        assignedTo: 'Julie',
        interviewer: '',
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001014',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'Sarah',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001015',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly',
      },
    ];

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => caseEditInformationListMockObject);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(caseEditInformationListMockObject);
    blaiseApiMock.verify((api) => api.getCaseEditInformation(questionnaireName), Times.once());
  });

  it('should log the number of cases and filtered cases When the Outcome Filter list is empty', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const userRole = 'SVT AllOutcomes';
    const caseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001012',
        outcome: CaseOutcome.Completed,
        assignedTo: 'bob',
        interviewer: '',
        editedStatus: EditedStatus.NotStarted,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001013',
        outcome: CaseOutcome.Partial,
        assignedTo: 'Julie',
        interviewer: '',
        editedStatus: EditedStatus.Query,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001014',
        outcome: CaseOutcome.CompletedNudge,
        assignedTo: 'Sarah',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
      },
      {
        primaryKey: '10001015',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Started,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly',
      },
    ];

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => caseEditInformationListMockObject);

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.info(`Retrieved ${caseEditInformationListMockObject.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`), Times.once());
    cloudLoggerMock.verify((logger) => logger.info(`Filtered down to ${caseEditInformationListMockObject.length} case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`), Times.once());
  });

  it('should return a 500 response if the users role is not configured for the survey', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const userRole = 'SVT NotConfigured'; // configured for LMS questionnaires only
    const caseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
    ];

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => caseEditInformationListMockObject);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('should log a 500 response error if the users role is not configured for the survey', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const userRole = 'SVT NotConfigured'; // configured for LMS questionnaires only
    const error = `Error: No '${questionnaireName.substring(0, 3)}' survey configuration found for Role ${userRole}`;
    const caseEditInformationListMockObject : CaseEditInformation[] = [
      {
        primaryKey: '10001011',
        outcome: CaseOutcome.Completed,
        assignedTo: 'Rich',
        interviewer: '',
        editedStatus: EditedStatus.Finished,
        organisation: Organisation.ONS,
        editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
        readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
      },
    ];

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => caseEditInformationListMockObject);

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`), Times.once());
  });

  it('should return a 500 response when a call is made to retrieve a list of editing details and the rest api is not availiable', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const userRole = 'SVT Editor';

    const axiosError = createAxiosError(500);

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('should log a 500 response error when a call is made to retrieve a list of editing details and the rest api is not availiable', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const userRole = 'SVT Editor';

    const axiosError = createAxiosError(500);

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(() => Promise.reject(axiosError));

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${axiosError}`), Times.once());
  });

  it('should return a 500 response when the api client throws an error', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const userRole = 'SVT Editor';

    const apiClientError = new Error();

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(() => Promise.reject(apiClientError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('should log a 500 response error when the api client throws an error', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const userRole = 'SVT Editor';

    const apiClientError = new Error();

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(() => Promise.reject(apiClientError));

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${apiClientError}`), Times.once());
  });

  it('should return a 500 response when CaseContorller is called without a userRole', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => []);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('should log a 500 response error when CaseContorller is called without a userRole', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const error = 'Error: Role: \'undefined\' not found in Role configuration';

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => []);

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit`);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`), Times.once());
  });

  it.each(['', 'INVALIDROLE'])('should return a 500 response when given an unknown userRole', async (userRoleInvalid) => {
    // arrange
    const questionnaireName = 'FRS2504A';

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => []);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRoleInvalid}`);

    // assert
    expect(response.status).toEqual(500);
  });

  it.each(['', 'INVALIDROLE'])('should log a 500 response error when given an unknown userRole', async (userRoleInvalid) => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const error = `Error: Role: '${userRoleInvalid}' not found in Role configuration`;

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => []);

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRoleInvalid}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`), Times.once());
  });

  it('should return a 404 response when a call is made to retrieve a list of editing details and the client returns a 404 not found', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const userRole = 'SVT Editor';

    const axiosError = createAxiosError(404);

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(404);
  });

  it('should log a 404 response error when a call is made to retrieve a list of editing details and the client returns a 404 not found', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const userRole = 'SVT Editor';

    const axiosError = createAxiosError(404);

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(() => Promise.reject(axiosError));

    // act
    await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get case(s) edit information, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 404 ${axiosError}`), Times.once());
  });
});

describe('allocate cases tests', () => {
  beforeEach(() => {
    blaiseApiMock.reset();
    cloudLoggerMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
    cloudLoggerMock.reset();
  });

  it('It should return a 204 response when cases are allocated', async () => {
    // arrange
    const caseId1: string = '1';
    const caseId2: string = '2';
    const questionnaireName: string = 'TEST111A';
    const editor: string = 'jake';
    const payload = { name: editor, cases: [caseId1, caseId2] };
    const caseFields = { 'QEdit.AssignedTo': editor, 'QEdit.Edited': 1 };

    blaiseApiMock.setup((api) => api.updateCase(questionnaireName, caseId1, caseFields));
    blaiseApiMock.setup((api) => api.updateCase(questionnaireName, caseId2, caseFields));

    // act
    const response: Response = await sut
      .patch(`/api/questionnaires/${questionnaireName}/cases/allocate`).send(payload);

    // assert
    expect(response.status).toEqual(204);
    blaiseApiMock.verify((api) => api.updateCase(questionnaireName, caseId1, caseFields), Times.once());
    blaiseApiMock.verify((api) => api.updateCase(questionnaireName, caseId2, caseFields), Times.once());
  });

  it('It should log when cases are successfully allocated', async () => {
    // arrange
    const caseId1: string = '1';
    const caseId2: string = '2';
    const questionnaireName: string = 'TEST111A';
    const editor: string = 'jake';
    const payload = { name: editor, cases: [caseId1, caseId2] };
    const caseFields = { 'QEdit.AssignedTo': editor, 'QEdit.Edited': 1 };

    blaiseApiMock.setup((api) => api.updateCase(questionnaireName, caseId1, caseFields));
    blaiseApiMock.setup((api) => api.updateCase(questionnaireName, caseId2, caseFields));

    // act
    await sut.patch(`/api/questionnaires/${questionnaireName}/cases/allocate`).send(payload);

    // assert
    cloudLoggerMock.verify((logger) => logger.info(`Allocated ${payload.cases.length} cases to editor: ${payload.name}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`), Times.once());
  });

  it('It should return a 500 response when a call is made to retrieve a case and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const questionnaireName: string = 'TEST111A';
    const payload = { name: 'jake', cases: ['1'] };

    blaiseApiMock.setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny())).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.patch(`/api/questionnaires/${questionnaireName}/cases/allocate`).send(payload);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should log a 500 response error when a call is made to retrieve a case and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const questionnaireName: string = 'TEST111A';
    const payload = { name: 'jake', cases: ['1'] };

    blaiseApiMock.setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny())).returns(() => Promise.reject(axiosError));

    // act
    await sut.patch(`/api/questionnaires/${questionnaireName}/cases/allocate`).send(payload);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to allocate cases to editor: ${payload.name}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${axiosError}`), Times.once());
  });

  it('It should return a 500 response when the api client throws an error', async () => {
    // arrange
    const clientError = new Error();
    const questionnaireName: string = 'TEST111A';
    const payload = { name: 'jake', cases: ['1'] };

    blaiseApiMock.setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny())).returns(() => Promise.reject(clientError));

    // act
    const response: Response = await sut.patch(`/api/questionnaires/${questionnaireName}/cases/allocate`).send(payload);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should log a 500 response error when the api client throws an error', async () => {
    // arrange
    const clientError = new Error();
    const questionnaireName: string = 'TEST111A';
    const payload = { name: 'jake', cases: ['1'] };

    blaiseApiMock.setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny())).returns(() => Promise.reject(clientError));

    // act
    await sut.patch(`/api/questionnaires/${questionnaireName}/cases/allocate`).send(payload);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to allocate cases to editor: ${payload.name}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${clientError}`), Times.once());
  });

  it('It should return a 404 response when a call is made to retrieve a case and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);
    const questionnaireName: string = 'TEST111A';
    const payload = { name: 'jake', cases: ['1'] };

    blaiseApiMock.setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny())).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.patch(`/api/questionnaires/${questionnaireName}/cases/allocate`).send(payload);

    // assert
    expect(response.status).toEqual(404);
  });

  it('It should log a 404 response error when a call is made to retrieve a case and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);
    const questionnaireName: string = 'TEST111A';
    const payload = { name: 'jake', cases: ['1'] };

    blaiseApiMock.setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny())).returns(() => Promise.reject(axiosError));

    // act
    await sut.patch(`/api/questionnaires/${questionnaireName}/cases/allocate`).send(payload);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to allocate cases to editor: ${payload.name}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 404 ${axiosError}`), Times.once());
  });
});

describe('set to update case tests', () => {
  beforeEach(() => {
    blaiseApiMock.reset();
    cloudLoggerMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
    cloudLoggerMock.reset();
  });

  it('It should return a 204 response when cases are set to update', async () => {
    // arrange
    const questionnaireName: string = 'TEST111A';
    const editQuestionnaireName: string = 'TEST111A_EDIT';
    const caseId: string = '9001';
    const caseFields2 = {
      'QEdit.AssignedTo': '', 'QEdit.Edited': '', 'QEdit.LastUpdated': '01-01-1900_00:00',
    };
    blaiseApiMock.setup((api) => api.updateCase(editQuestionnaireName, caseId, caseFields2));
    // act
    const response: Response = await sut
      .patch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`);
    // assert
    expect(response.status).toEqual(204);
    blaiseApiMock.verify((api) => api.updateCase(editQuestionnaireName, caseId, caseFields2), Times.once());
  });

  it('It should log when cases are set to update', async () => {
    // arrange
    const questionnaireName: string = 'TEST111A';
    const editQuestionnaireName: string = 'TEST111A_EDIT';
    const caseId: string = '9001';
    const caseFields2 = {
      'QEdit.AssignedTo': '', 'QEdit.Edited': '', 'QEdit.LastUpdated': '01-01-1900_00:00',
    };
    blaiseApiMock.setup((api) => api.updateCase(editQuestionnaireName, caseId, caseFields2));

    // act
    await sut.patch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`);

    // assert
    cloudLoggerMock.verify((logger) => logger.info(`Set to update edit dataset overnight, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}}`), Times.once());
  });

  it('It should return a 500 response when a call is made to retrieve a case and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const questionnaireName: string = 'TEST111A';
    const caseId: string = '9001';
    blaiseApiMock.setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny())).returns(() => Promise.reject(axiosError));
    // act
    const response: Response = await sut.patch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`);
    // assert
    expect(response.status).toEqual(500);
  });

  it('It should log a 500 response error when a call is made to retrieve a case and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const questionnaireName: string = 'TEST111A';
    const caseId: string = '9001';
    blaiseApiMock.setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny())).returns(() => Promise.reject(axiosError));
    // act
    await sut.patch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`);
    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to set to update edit dataset overnight, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${axiosError}`), Times.once());
  });

  it('It should return a 500 response when the api client throws an error', async () => {
    // arrange
    const clientError = new Error();
    const questionnaireName: string = 'TEST111A';
    const caseId: string = '9001';
    blaiseApiMock.setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny())).returns(() => Promise.reject(clientError));
    // act
    const response: Response = await sut.patch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`);
    // assert
    expect(response.status).toEqual(500);
  });

  it('It should log a 500 response error when the api client throws an error', async () => {
    // arrange
    const clientError = new Error();
    const questionnaireName: string = 'TEST111A';
    const caseId: string = '9001';
    blaiseApiMock.setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny())).returns(() => Promise.reject(clientError));
    // act
    await sut.patch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`);
    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to set to update edit dataset overnight, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 500 ${clientError}`), Times.once());
  });

  it('It should return a 404 response when a call is made to retrieve a case and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);
    const questionnaireName: string = 'TEST111A';
    const caseId: string = '9001';
    blaiseApiMock.setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny())).returns(() => Promise.reject(axiosError));
    // act
    const response: Response = await sut.patch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`);
    // assert
    expect(response.status).toEqual(404);
  });

  it('It should return a 404 response when a call is made to retrieve a case and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);
    const questionnaireName: string = 'TEST111A';
    const caseId: string = '9001';
    blaiseApiMock.setup((api) => api.updateCase(It.isAny(), It.isAny(), It.isAny())).returns(() => Promise.reject(axiosError));
    // act
    await sut.patch(`/api/questionnaires/${questionnaireName}/cases/${caseId}/update`);
    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to set to update edit dataset overnight, case: ${caseId}, questionnaire: ${questionnaireName}, current user: {name: ${user.name}, role: ${user.role}} with 404 ${axiosError}`), Times.once());
  });
});
