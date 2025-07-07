import {
  CaseOutcome, CaseEditInformation, EditedStatus, CaseResponse,
} from 'blaise-api-node-client';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import { CaseSummaryDetails } from '../../../common/interfaces/caseInterface';

export const caseEditInformationMockObject1: CaseEditInformation = {
  primaryKey: '10001011',
  outcome: CaseOutcome.Completed,
  assignedTo: 'Rich',
  interviewer: 'rich',
  editedStatus: EditedStatus.Finished,
  organisation: Organisation.ONS,
  editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
  readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011&DataEntrySettings=ReadOnly',
};
export const caseEditInformationMockObject2: CaseEditInformation = {
  primaryKey: '10001012',
  outcome: CaseOutcome.Completed,
  assignedTo: 'bob',
  interviewer: '',
  editedStatus: EditedStatus.NotStarted,
  organisation: Organisation.ONS,
  editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
  readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012&DataEntrySettings=ReadOnly',
};
export const caseEditInformationMockObject3: CaseEditInformation = {
  primaryKey: '10001013',
  outcome: CaseOutcome.Partial,
  assignedTo: 'Julie',
  interviewer: '',
  editedStatus: EditedStatus.Query,
  organisation: Organisation.ONS,
  editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
  readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013&DataEntrySettings=ReadOnly',
};
export const caseEditInformationMockObject4: CaseEditInformation = {
  primaryKey: '10001014',
  outcome: CaseOutcome.CompletedNudge,
  assignedTo: 'Sarah',
  interviewer: '',
  editedStatus: EditedStatus.Started,
  organisation: Organisation.ONS,
  editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
  readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014&DataEntrySettings=ReadOnly',
};
export const caseEditInformationMockObject5: CaseEditInformation = {
  primaryKey: '10001015',
  outcome: CaseOutcome.Completed,
  assignedTo: 'Rich',
  interviewer: '',
  editedStatus: EditedStatus.Started,
  organisation: Organisation.ONS,
  editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
  readOnlyUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015&DataEntrySettings=ReadOnly',
};

export const CaseEditInformationListMockObject: CaseEditInformation[] = [
  caseEditInformationMockObject1,
  caseEditInformationMockObject2,
  caseEditInformationMockObject3,
  caseEditInformationMockObject4,
  caseEditInformationMockObject5,
];

export const caseResponseMockObject: CaseResponse = {
  caseId: '9001',
  fieldData: {
    'qiD.Serial_Number': '9001',
    'qSignIn.StartDat': '11-05-2024',
    'qDataBag.District': 'Gwent',
    'qhAdmin.HOut': '110',
    'qhAdmin.QObsSheet.MainAcD': '1',
    'qhAdmin.QObsSheet.TypAcDV': '1',
    'qhAdmin.QObsSheet.FloorN': '2',
    'qhAdmin.Interviewer[1]': 'Rich',
    'qAccomdat.HHStat': '1',
    'qAccomdat.Bedroom': '2',
    'bU[1].QBenefit.QBenef2[1].HBenAmt': '380',
    'bU[1].QBenefit.QBenef2[1].HBenPd': '1',
    'qCounTax.CTBand': '1',
    'bU[1].QBUId.BUNum': '1',
    'bU[1].QSelfJob[1].Adult[1].BusRoom': '1',
    'bU[1].QCurSt1.Adult[1].EmpStat': '2',
    'bU[1].QCurSt1.Adult[1].PersId': '1',
    'bU[1].QCurSt1.Adult[2].EmpStat': '2',
    'bU[1].QCurSt1.Adult[2].PersId': '2',
    'bU[1].QBenefit.QWageBen.Adult[1].WageBen': '5-6',
    'bU[1].QBenefit.QWageBen.Adult[1].PersId': '1',
    'bU[1].QBenefit.QWageBen.Adult[1].JSAType': '2',
    'dmhSize': '2',
    'dmName[1]': 'Richmond Ricecake',
    'qHousehold.QHHold.Person[1].BenUnit': '1',
    'qHousehold.QHHold.Person[1].Sex': '1',
    'qHousehold.QHHold.Person[1].DoB': '15-01-1980',
    'qHousehold.QHHold.Person[1].livewith': '1',
    'qHousehold.QHHold.Person[1].QRel[1].R': '97',
    'qHousehold.QHHold.Person[1].QRel[2].R': '1',
    'dmName[2]': 'Betty Bettison',
    'qHousehold.QHHold.Person[2].BenUnit': '1',
    'qHousehold.QHHold.Person[2].Sex': '2',
    'qHousehold.QHHold.Person[2].DoB': '11-06-1995',
    'qHousehold.QHHold.Person[2].livewith': '1',
    'qHousehold.QHHold.Person[2].QRel[1].R': '1',
    'qHousehold.QHHold.Person[2].QRel[2].R': '97',
  },
};

export const caseSummaryDetailsMockObject: CaseSummaryDetails = {
  CaseId: '9001',
  OutcomeCode: '110',
  InterviewDate: new Date('2024-05-11'),
  District: 'Gwent',
  InterviewerName: 'Rich',
  NumberOfRespondents: '2',
  Household: {
    Accommodation: {
      Main: 'House/Bungalow',
      Type: 'Detached',
    },
    FloorNumber: '2',
    Status: 'Conventional',
    NumberOfBedrooms: '2',
    ReceiptOfHousingBenefit: [{
      Amount: '380',
      PeriodCode: 'One week',
    }],
    CouncilTaxBand: 'Band A',
    BusinessRoom: true,
    SelfEmployed: true,
    SelfEmployedMembers: ['1', '2'],
    IncomeSupport: true,
    IncomeSupportMembers: ['1'],
    IncomeBasedJaSupport: true,
    IncomeBasedJaSupportMembers: ['1'],
  },
  Respondents: [
    {
      PersonNumber: '1',
      RespondentName: 'Richmond Ricecake',
      BenefitUnit: '1',
      Sex: 'M',
      DateOfBirth: new Date('1980-01-15'),
      MaritalStatus: 'COH',
      Relationship: ['*', '1'],
    },
    {
      PersonNumber: '2',
      RespondentName: 'Betty Bettison',
      BenefitUnit: '1',
      Sex: 'F',
      DateOfBirth: new Date('1995-06-11'),
      MaritalStatus: 'COH',
      Relationship: ['1', '*'],
    },
  ],
};
