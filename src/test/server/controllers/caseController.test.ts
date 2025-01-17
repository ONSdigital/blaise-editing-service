import supertest, { Response } from 'supertest';
import {
  IMock, It, Mock, Times,
} from 'typemoq';
import { CaseEditInformation, CaseOutcome, EditedStatus } from 'blaise-api-node-client';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import { Auth } from 'blaise-login-react-server';
import nodeServer from '../../../server/server';
import createAxiosError from './axiosTestHelper';
import BlaiseApi from '../../../server/api/BlaiseApi';
import FakeServerConfigurationProvider from '../configuration/FakeServerConfigurationProvider';
import { caseResponseMockObject, caseSummaryDetailsMockObject } from '../mockObjects/CaseMockObject';

// create fake config
const configFake = new FakeServerConfigurationProvider();

// mock auth
Auth.prototype.ValidateToken = jest.fn().mockReturnValue(true);

// mock blaise api client
const blaiseApiMock: IMock<BlaiseApi> = Mock.ofType(BlaiseApi);

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
  });

  afterAll(() => {
    blaiseApiMock.reset();
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
});

describe('Get case edit information tests', () => {
  beforeEach(() => {
    blaiseApiMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
  });

  it.each(validUserRoles)('should return a 200 response with an expected filtered list of case edit details When given a valid quetsionnaire and userRole', async (userRole) => {
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

  it('should return a 500 response when CaseContorller is called without a userRole', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';

    blaiseApiMock.setup((api) => api.getCaseEditInformation(questionnaireName)).returns(async () => []);

    // act
    const response: Response = await sut.get(`/api/questionnaires/${questionnaireName}/cases/edit`);

    // assert
    expect(response.status).toEqual(500);
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
});

describe('allocate cases tests', () => {
  beforeEach(() => {
    blaiseApiMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
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
});
