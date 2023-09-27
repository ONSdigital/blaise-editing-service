import BlaiseApiClient, { QuestionnaireReport } from 'blaise-api-node-client';
import {
  IMock, It, Mock, Times,
} from 'typemoq';
import FakeConfigurationProvider from '../configuration/FakeConfigurationProvider';
import BlaiseApi from '../../../server/api/BlaiseApi';
import {
  questionnaire1Mock, questionnaire2Mock, questionnaire3Mock,
  questionnaire4Mock, questionnaireCaseDetailsListMockObject, questionnaireListMockObject,
} from '../../mockObjects/questionnaireListMockObject';
import {
  questionnaireReport1MockObject, questionnaireReport2MockObject, questionnaireReport3MockObject, questionnaireReport4MockObject,
} from '../../mockObjects/questionnaireReportMockObjects';
import {
  caseFactsheetMockObject, caseResponseMockObject,
} from '../../mockObjects/caseMockObject';
import { CaseDetails } from '../../../common/interfaces/caseInterface';

const questionnaireName = 'OPN2201A';

// create fake config
const configFake = new FakeConfigurationProvider('restapi.blaise.com', 'dist', 5000, 'gusty', 'cati.blaise.com', 'richlikesricecakes', '12h', ['DST']);

// mock blaise api client

const blaiseApiClientMock: IMock<BlaiseApiClient> = Mock.ofType(BlaiseApiClient);

// create service under test
const sut = new BlaiseApi(configFake, blaiseApiClientMock.object);

describe('getCaseStatus from Blaise', () => {
  const username: string = 'toby';
  const fieldIds: string[] = ['qserial.serial_number', 'qhadmin.hout', 'allocation.toeditor'];

  beforeEach(() => {
    blaiseApiClientMock.reset();
  });

  it('Should retrieve a filtered list of case details for the user from blaise', async () => {
    // arrange
    const questionnaireReport1MockObjectLocal: QuestionnaireReport = {
      questionnaireName,
      questionnaireId: '00000000-0000-0000-0000-000000000000',
      reportingData: [
        {
          'qserial.serial_number': '9001',
          'qhadmin.hout': 110,
          'allocation.toeditor': username,
        },
        {
          'qserial.serial_number': '9002',
          'qhadmin.hout': 120,
          'allocation.toeditor': '',
        },
        {
          'qserial.serial_number': '9003',
          'qhadmin.hout': 210,
          'allocation.toeditor': username,
        },
        {
          'qserial.serial_number': '9004',
          'qhadmin.hout': 120,
          'allocation.toeditor': 'Mike',
        },
      ],
    };

    const caseDetailsListMockObject:CaseDetails[] = [
      {
        CaseId: '9001',
        CaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=9001`,
        CaseStatus: 110,
        EditorAllocated: username,
      },
      {
        CaseId: '9003',
        CaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=9003`,
        CaseStatus: 210,
        EditorAllocated: username,
      },
    ];

    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaireName, fieldIds))
      .returns(async () => questionnaireReport1MockObjectLocal);

    // act
    const result = await sut.getCaseDetails(questionnaireName, username);

    // assert
    expect(result).toEqual(caseDetailsListMockObject);
  });

  it('Should retrieve an empty list of cases if none are allocated to the user', async () => {
    // arrange
    const questionnaireReport1MockObjectLocal: QuestionnaireReport = {
      questionnaireName,
      questionnaireId: '00000000-0000-0000-0000-000000000000',
      reportingData: [
        {
          'qserial.serial_number': '9001',
          'qhadmin.hout': 110,
          'allocation.toeditor': 'bob',
        },
        {
          'qserial.serial_number': '9002',
          'qhadmin.hout': 120,
          'allocation.toeditor': '',
        },
        {
          'qserial.serial_number': '9003',
          'qhadmin.hout': 210,
          'allocation.toeditor': 'mike',
        },
        {
          'qserial.serial_number': '9004',
          'qhadmin.hout': 120,
          'allocation.toeditor': 'Mike',
        },
      ],
    };

    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaireName, fieldIds))
      .returns(async () => questionnaireReport1MockObjectLocal);

    // act
    const result = await sut.getCaseDetails(questionnaireName, username);

    // assert
    expect(result).toEqual([]);
  });

  it('Should call the getCaseDetails function with the expected parameters', async () => {
    // arrange
    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaireName, fieldIds))
      .returns(async () => questionnaireReport1MockObject);

    // act
    await sut.getCaseDetails(questionnaireName, username);

    // assert
    blaiseApiClientMock.verify((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaireName, fieldIds), Times.once());
  });
});

describe('getCaseFactsheet from Blaise', () => {
  beforeEach(() => {
    blaiseApiClientMock.reset();
  });

  it('Should retrieve a case from blaise', async () => {
    // arrange
    const caseId = '90001';
    blaiseApiClientMock.setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId)).returns(async () => caseResponseMockObject);

    // act
    const result = await sut.getCaseFactsheet(questionnaireName, caseId);

    // assert
    expect(result).toEqual(caseFactsheetMockObject);
  });

  it('Should call the getCaseFactsheet function with the expected parameters', async () => {
    // arrange
    const caseId = '90001';
    blaiseApiClientMock.setup((client) => client.getCase(It.isAnyString(), It.isAnyString(), It.isAnyString())).returns(async () => caseResponseMockObject);

    // act
    await sut.getCaseFactsheet(questionnaireName, caseId);

    // assert
    blaiseApiClientMock.verify((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId), Times.once());
  });
});

describe('getQuestionnairesWithAllocation from Blaise', () => {
  const fieldIds = ['allocation.toeditor'];

  beforeEach(() => {
    blaiseApiClientMock.reset();
  });
  it('Should call getQuestionnaires and getReportData for all questionnaires in that list', async () => {
    // arrange
    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(async () => questionnaireListMockObject);
    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, It.isAnyString(), fieldIds))
      .returns(async () => questionnaireReport1MockObject);

    // act
    await sut.getQuestionnaires();

    // assert
    blaiseApiClientMock.verify((client) => client.getQuestionnaires(configFake.ServerPark), Times.once());

    questionnaireListMockObject.forEach((questionnaire) => {
      blaiseApiClientMock.verify((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire.name, fieldIds), Times.once());
    });
  });

  it('Should return the expected list of questionnaires with allocation information', async () => {
    // arrange
    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(async () => questionnaireListMockObject);

    // mock questionnaire 1 report data
    const reportdata1Mock = questionnaireReport1MockObject;
    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire1Mock.name, fieldIds)).returns(async () => reportdata1Mock);

    // mock questionnaire 2 report data
    const reportdata2Mock = questionnaireReport2MockObject;
    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire2Mock.name, fieldIds)).returns(async () => reportdata2Mock);

    // mock questionnaire 3 report data
    const reportdata3Mock = questionnaireReport3MockObject;
    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire3Mock.name, fieldIds)).returns(async () => reportdata3Mock);

    // mock questionnaire 4 report data
    const reportdata4Mock = questionnaireReport4MockObject;
    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire4Mock.name, fieldIds)).returns(async () => reportdata4Mock);

    // act
    const result = await sut.getQuestionnaires();

    // assert
    expect(result).toEqual(questionnaireCaseDetailsListMockObject);
  });
});
