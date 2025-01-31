import BlaiseApiClient, { CaseEditInformationListMockObject, Questionnaire } from 'blaise-api-node-client';
import {
  IMock, Mock, Times,
} from 'typemoq';
import BlaiseApi from '../../../server/api/BlaiseApi';
import { questionnaireListMockObject } from '../mockObjects/questionnaireListMockObject';
import FakeServerConfigurationProvider from '../configuration/FakeServerConfigurationProvider';
import userMockObject from '../mockObjects/userMockObject';
import { caseResponseMockObject } from '../mockObjects/CaseMockObject';
import GoogleCloudLogger from '../../../server/logger/googleCloudLogger';

// polyfill for setImmediate (when testing with logger)
global.setImmediate = global.setImmediate || ((fn: () => void) => setTimeout(fn, 0));

// create fake config
const configFake = new FakeServerConfigurationProvider();

// mock blaise api client and cloud logger
const blaiseApiClientMock: IMock<BlaiseApiClient> = Mock.ofType(BlaiseApiClient);
const cloudLoggerMock: IMock<GoogleCloudLogger> = Mock.ofType(GoogleCloudLogger);

// create service under test
const sut = new BlaiseApi(configFake, blaiseApiClientMock.object, cloudLoggerMock.object);

describe('getQuestionnaires from Blaise', () => {
  beforeEach(() => {
    blaiseApiClientMock.reset();
    cloudLoggerMock.reset();
  });

  it('Should call getQuestionnaires for the correct serverpark', async () => {
    // arrange
    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(async () => questionnaireListMockObject);

    // act
    await sut.getQuestionnaires();

    // assert
    blaiseApiClientMock.verify((client) => client.getQuestionnaires(configFake.ServerPark), Times.once());
  });

  it('Should return an expected list of questionnaires', async () => {
    // arrange
    const questionnaireList: Questionnaire[] = [
      {
        name: 'FRS2408B',
        serverParkName: 'gusty',
        installDate: '2021-03-15T15:26:43.4233454+00:00',
        fieldPeriod: '2024-08-01T00:00:00',
        surveyTla: 'FRS',
        status: 'Active',
        dataRecordCount: 0,
        hasData: false,
        active: false,
      },
      {
        name: 'FRS2408B_EDIT',
        serverParkName: 'gusty',
        installDate: '2021-03-15T15:26:43.4233454+00:00',
        fieldPeriod: '2024-08-01T00:00:00',
        surveyTla: 'FRS',
        status: 'Active',
        dataRecordCount: 0,
        hasData: false,
        active: false,
      },
    ];

    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(async () => questionnaireList);

    // act
    const result = await sut.getQuestionnaires();

    // assert
    expect(result.length).toEqual(2);
    expect(result[0]?.questionnaireName).toEqual('FRS2408B');
    expect(result[1]?.questionnaireName).toEqual('FRS2408B_EDIT');
  });
});

describe('getCase from Blaise', () => {
  beforeEach(() => {
    blaiseApiClientMock.reset();
  });

  it('Should call getCase with the expected parameters', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const caseId = '9001';

    blaiseApiClientMock.setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId)).returns(async () => caseResponseMockObject);

    // act
    await sut.getCase(questionnaireName, caseId);

    // assert
    blaiseApiClientMock.verify((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId), Times.once());
  });

  it('Should retrieve an extpected case from blaise', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    const caseId = '9001';

    blaiseApiClientMock.setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId)).returns(async () => caseResponseMockObject);

    // act
    const result = await sut.getCase(questionnaireName, caseId);

    // assert
    expect(result).toEqual(caseResponseMockObject);
  });
});

describe('updateCase from Blaise', () => {
  beforeEach(() => {
    blaiseApiClientMock.reset();
  });

  it('Should call the update function with the expected parameters', async () => {
    // arrange
    const questionnaireName = 'FRS2504A_EDIT';
    const caseId = '9001';
    const caseFields = {};

    blaiseApiClientMock.setup((client) => client.updateCase(configFake.ServerPark, questionnaireName, caseId, caseFields)).returns(async () => null);

    // act
    await sut.updateCase(questionnaireName, caseId, caseFields);

    // assert
    blaiseApiClientMock.verify((client) => client.updateCase(configFake.ServerPark, questionnaireName, caseId, caseFields), Times.once());
  });
});

describe('getCaseEditInformation from Blaise', () => {
  beforeEach(() => {
    blaiseApiClientMock.reset();
  });

  it('Should call getCaseEditInformation for a given questionnaire', async () => {
    // arrange
    const questionnaireName = 'FRS2504A_EDIT';
    blaiseApiClientMock.setup((client) => client.getCaseEditInformation(configFake.ServerPark, questionnaireName)).returns(async () => CaseEditInformationListMockObject);

    // act
    await sut.getCaseEditInformation(questionnaireName);

    // assert
    blaiseApiClientMock.verify((client) => client.getCaseEditInformation(configFake.ServerPark, questionnaireName), Times.once());
  });

  it('Should return an expected list of Cases for editing', async () => {
    // arrange
    const questionnaireName = 'FRS2504A_EDIT';
    const expectedEditUrlBase = `https://${configFake.ExternalWebUrl}/${questionnaireName}?KeyValue=`;
    blaiseApiClientMock.setup((client) => client.getCaseEditInformation(configFake.ServerPark, questionnaireName)).returns(async () => CaseEditInformationListMockObject);

    // act
    const caseEditInformationList = await sut.getCaseEditInformation(questionnaireName);

    // assert
    caseEditInformationList.forEach((caseEditInformation, index) => {
      expect(caseEditInformation.primaryKey).toEqual(CaseEditInformationListMockObject[index]?.primaryKey);
      expect(caseEditInformation.outcome).toEqual(CaseEditInformationListMockObject[index]?.outcome);
      expect(caseEditInformation.assignedTo).toEqual(CaseEditInformationListMockObject[index]?.assignedTo);
      expect(caseEditInformation.editedStatus).toEqual(CaseEditInformationListMockObject[index]?.editedStatus);
      expect(caseEditInformation.interviewer).toEqual(CaseEditInformationListMockObject[index]?.interviewer);
      expect(caseEditInformation.editUrl).toEqual(`${expectedEditUrlBase}${caseEditInformation.primaryKey}`);
      expect(caseEditInformation.readOnlyUrl).toEqual(`${expectedEditUrlBase}${caseEditInformation.primaryKey}&DataEntrySettings=ReadOnly`);
    });
  });
});

describe('getUsers from Blaise', () => {
  beforeEach(() => {
    blaiseApiClientMock.reset();
  });

  it('Should call getCaseEditInformation for a given questionnaire', async () => {
    // arrange
    blaiseApiClientMock.setup((client) => client.getUsers()).returns(async () => [userMockObject]);

    // act
    await sut.getUsers();

    // assert
    blaiseApiClientMock.verify((client) => client.getUsers(), Times.once());
  });

  it('Should call getCaseEditInformation for a given questionnaire', async () => {
    // arrange
    blaiseApiClientMock.setup((client) => client.getUsers()).returns(async () => [userMockObject]);

    // act
    const result = await sut.getUsers();

    // assert
    expect(result).toEqual([userMockObject]);
  });
});
