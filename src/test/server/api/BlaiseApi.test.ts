import BlaiseApiClient, { CaseResponse, QuestionnaireReport } from 'blaise-api-node-client';
import {
  IMock, It, Mock, Times,
} from 'typemoq';
import BlaiseApi from '../../../server/api/BlaiseApi';
import {
  questionnaire1Mock, questionnaire2Mock, questionnaire3Mock,
  questionnaire4Mock, questionnaireListMockObject,
} from '../../mockObjects/questionnaireListMockObject';
import {
  questionnaireReport1MockObject, questionnaireReport2MockObject, questionnaireReport3MockObject, questionnaireReport4MockObject,
} from '../../mockObjects/questionnaireReportMockObjects';
import { AllocationDetails, QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import { CaseDetails } from '../../../common/interfaces/caseInterface';
import FakeServerConfigurationProvider from '../configuration/FakeServerConfigurationProvider';
import { caseFactsheetMockObject, caseResponseMockObject } from '../../mockObjects/caseMockObject';
import CaseFields from '../../../client/Common/enums/CaseFields';

// create fake config
const configFake = new FakeServerConfigurationProvider();

// mock blaise api client

const blaiseApiClientMock: IMock<BlaiseApiClient> = Mock.ofType(BlaiseApiClient);

// create service under test
const sut = new BlaiseApi(configFake, blaiseApiClientMock.object);

const username: string = 'toby';

describe('getCaseDetails from Blaise', () => {
  const fieldIds: string[] = [CaseFields.Id, CaseFields.Status, CaseFields.AllocatedTo];
  beforeEach(() => {
    blaiseApiClientMock.reset();
  });

  it('Should retrieve a filtered list of case details is a username is supplied', async () => {
    // arrange
    const questionnaireName = 'OPN2201A';

    const questionnaireReport: QuestionnaireReport = {
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

    const expectedCaseDetailsList:CaseDetails[] = [
      {
        CaseId: '9001',
        CaseStatus: 110,
        EditorAllocated: username,
        EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=9001`,
      },
      {
        CaseId: '9003',
        CaseStatus: 210,
        EditorAllocated: username,
        EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=9003`,
      },
    ];

    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaireName, fieldIds))
      .returns(async () => questionnaireReport);

    // act
    const result = await sut.getCaseDetails(questionnaireName, username);

    // assert
    expect(result).toEqual(expectedCaseDetailsList);
  });

  it('Should retrieve a full list of case details is a username is not supplied', async () => {
    // arrange
    const questionnaireName = 'OPN2201A';

    const questionnaireReport: QuestionnaireReport = {
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
          'qserial.serial_number': '9004',
          'qhadmin.hout': 300,
          'allocation.toeditor': 'Mike',
        },
      ],
    };

    const expectedCaseDetailsList:CaseDetails[] = [
      {
        CaseId: '9001',
        CaseStatus: 110,
        EditorAllocated: username,
        EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=9001`,
      },
      {
        CaseId: '9002',
        CaseStatus: 120,
        EditorAllocated: '',
        EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=9002`,
      },
      {
        CaseId: '9004',
        CaseStatus: 300,
        EditorAllocated: 'Mike',
        EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=9004`,
      },
    ];

    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaireName, fieldIds))
      .returns(async () => questionnaireReport);

    // act
    const result = await sut.getCaseDetails(questionnaireName);

    // assert
    expect(result).toEqual(expectedCaseDetailsList);
  });

  it('Should retrieve an empty list of cases if none are allocated to the user when a username is supplied', async () => {
    // arrange
    const questionnaireName = 'OPN2201A';

    const questionnaireReport: QuestionnaireReport = {
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
      ],
    };

    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaireName, fieldIds))
      .returns(async () => questionnaireReport);

    // act
    const result = await sut.getCaseDetails(questionnaireName, username);

    // assert
    expect(result).toEqual([]);
  });

  it('Should retrieve an empty list is questionnaire has no cases', async () => {
    // arrange
    const questionnaireName = 'OPN2201A';

    const questionnaireReport: QuestionnaireReport = {
      questionnaireName,
      questionnaireId: '00000000-0000-0000-0000-000000000000',
      reportingData: [],
    };

    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaireName, fieldIds))
      .returns(async () => questionnaireReport);

    // act
    const result = await sut.getCaseDetails(questionnaireName);

    // assert
    expect(result).toEqual([]);
  });

  it('Should call the getCaseDetails function with the expected parameters', async () => {
    // arrange
    const questionnaireName = 'OPN2201A';

    const questionnaireReport: QuestionnaireReport = {
      questionnaireName,
      questionnaireId: '00000000-0000-0000-0000-000000000000',
      reportingData: [],
    };

    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaireName, fieldIds))
      .returns(async () => questionnaireReport);

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

  it('Should retrieve a case factsheet from blaise', async () => {
    // arrange
    const questionnaireName = 'OPN2201A';
    const caseId = '90001';

    blaiseApiClientMock.setup((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId)).returns(async () => caseResponseMockObject);

    // act
    const result = await sut.getCaseFactsheet(questionnaireName, caseId);

    // assert
    expect(result).toEqual(caseFactsheetMockObject);
  });

  it('Should call the getCaseFactsheet function with the expected parameters', async () => {
    // arrange
    const questionnaireName = 'OPN2201A';
    const caseId = '90001';

    const caseResponseData: CaseResponse = {
      caseId: '9001',
      fieldData: {
        'qiD.Serial_Number': '9001',
        'qDataBag.Prem1': 'Flat 1',
        'qDataBag.Prem2': 'Richmond House',
        'qDataBag.Prem3': 'Rice Road',
        'qDataBag.Prem4': 'Duffrin',
        'qDataBag.District': 'Gwent',
        'qDataBag.PostTown': 'Newport',
        'qDataBag.PostCode': 'NZ11 4PD',
        'qhAdmin.HOut': 110,
        'qhAdmin.Interviewer[1]': 'Rich',
        dmhSize: 1,
        'dmName[1]': 'Bartholomew Edgar',
        'dmDteOfBth[1]': new Date(1995, 5, 11),
      },
    };

    blaiseApiClientMock.setup((client) => client.getCase(It.isAnyString(), It.isAnyString(), It.isAnyString())).returns(async () => caseResponseData);

    // act
    await sut.getCaseFactsheet(questionnaireName, caseId);

    // assert
    blaiseApiClientMock.verify((client) => client.getCase(configFake.ServerPark, questionnaireName, caseId), Times.once());
  });
});

describe('getQuestionnaires from Blaise', () => {
  const fieldIds: string[] = [CaseFields.AllocatedTo];

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

  it('Should return the expected list of questionnaires with allocation details if a username is supplied', async () => {
    // arrange
    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(async () => questionnaireListMockObject);

    // mock questionnaire report data
    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire1Mock.name, fieldIds))
      .returns(async () => questionnaireReport1MockObject);

    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire2Mock.name, fieldIds))
      .returns(async () => questionnaireReport2MockObject);

    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire3Mock.name, fieldIds))
      .returns(async () => questionnaireReport3MockObject);

    // mock questionnaire 4 report data
    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire4Mock.name, fieldIds))
      .returns(async () => questionnaireReport4MockObject);

    const expectedQuestionnaireDetails: QuestionnaireDetails[] = [{
      questionnaireName: questionnaire1Mock.name,
      numberOfCases: questionnaire1Mock.dataRecordCount ?? 0,
      numberOfCasesAllocated: 2,
    },
    {
      questionnaireName: questionnaire2Mock.name,
      numberOfCases: questionnaire2Mock.dataRecordCount ?? 0,
      numberOfCasesAllocated: 0,
    },
    {
      questionnaireName: questionnaire3Mock.name,
      numberOfCases: questionnaire3Mock.dataRecordCount ?? 0,
      numberOfCasesAllocated: 0,
    },
    {
      questionnaireName: questionnaire4Mock.name,
      numberOfCases: questionnaire4Mock.dataRecordCount ?? 0,
      numberOfCasesAllocated: 1,
    }];

    // act
    const result = await sut.getQuestionnaires(username);

    // assert
    expect(result).toEqual(expectedQuestionnaireDetails);
  });

  it('Should return the expected list of questionnaires with allocation details if no username is supplied', async () => {
    // arrange
    blaiseApiClientMock.setup((client) => client.getQuestionnaires(configFake.ServerPark)).returns(async () => questionnaireListMockObject);

    // mock questionnaire report data
    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire1Mock.name, fieldIds))
      .returns(async () => questionnaireReport1MockObject);

    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire2Mock.name, fieldIds))
      .returns(async () => questionnaireReport2MockObject);

    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire3Mock.name, fieldIds))
      .returns(async () => questionnaireReport3MockObject);

    // mock questionnaire 4 report data
    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaire4Mock.name, fieldIds))
      .returns(async () => questionnaireReport4MockObject);

    const expectedQuestionnaireDetails: QuestionnaireDetails[] = [{
      questionnaireName: questionnaire1Mock.name,
      numberOfCases: questionnaire1Mock.dataRecordCount ?? 0,
      numberOfCasesAllocated: 2,
    },
    {
      questionnaireName: questionnaire2Mock.name,
      numberOfCases: questionnaire2Mock.dataRecordCount ?? 0,
      numberOfCasesAllocated: 0,
    },
    {
      questionnaireName: questionnaire3Mock.name,
      numberOfCases: questionnaire3Mock.dataRecordCount ?? 0,
      numberOfCasesAllocated: 0,
    },
    {
      questionnaireName: questionnaire4Mock.name,
      numberOfCases: questionnaire4Mock.dataRecordCount ?? 0,
      numberOfCasesAllocated: 3,
    }];

    // act
    const result = await sut.getQuestionnaires();

    // assert
    expect(result).toEqual(expectedQuestionnaireDetails);
  });
});

describe('getAllocationDetails from Blaise', () => {
  const questionnaireName = questionnaire1Mock.name;
  const fieldIds: string[] = [CaseFields.Id, CaseFields.AllocatedTo];

  beforeEach(() => {
    blaiseApiClientMock.reset();
  });
  it('Should call getQuestionnaire and getQuestionnaireDetails for the questionnaire', async () => {
    // arrange
    blaiseApiClientMock.setup((client) => client.getQuestionnaire(configFake.ServerPark, questionnaireName)).returns(async () => questionnaire1Mock);
    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, It.isAnyString(), fieldIds)).returns(async () => questionnaireReport1MockObject);

    // act
    await sut.getAllocationDetails(questionnaireName);

    // assert
    blaiseApiClientMock.verify((client) => client.getQuestionnaire(configFake.ServerPark, questionnaireName), Times.once());
    blaiseApiClientMock.verify((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaireName, fieldIds), Times.once());
  });

  it('Should return the expected getQuestionnaireDetails for the questionnaire', async () => {
    // arrange
    blaiseApiClientMock.setup((client) => client.getQuestionnaire(configFake.ServerPark, questionnaireName)).returns(async () => questionnaire1Mock);

    // mock questionnaire report data
    blaiseApiClientMock.setup((client) => client.getQuestionnaireReportData(configFake.ServerPark, questionnaireName, fieldIds))
      .returns(async () => questionnaireReport1MockObject);

    const expectedAllocationDetails: AllocationDetails = {
      questionnaireName: questionnaire1Mock.name,
      numberOfCases: questionnaire1Mock.dataRecordCount ?? 0,
      numberOfCasesAllocated: 2,
      editorAllocationDetails: [{
        editor: 'toby',
        cases: ['9001', '9003'],
      },
      ],
    };

    // act
    const result = await sut.getAllocationDetails(questionnaireName);

    // assert
    expect(result).toEqual(expectedAllocationDetails);
  });
});
