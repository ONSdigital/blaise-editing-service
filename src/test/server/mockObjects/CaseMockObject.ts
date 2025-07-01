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
    'QAccomdat.HHStat': '1',
    'QAccomdat.Bedroom': '2',
    'BU[1].QBenefit.QBenef2[1].HBenAmt': '380',
    'BU[1].QBenefit.QBenef2[1].HBenPd': '1',
    'QCounTax.CTBand': '1',
    'BU[1].QBUId.BUNum': '1',
    'BU[1].QSelfJob[1].Adult[1].BusRoom': '1',
    'BU[1].QCurst1.Adult[1].EmpStat': '2',
    'BU[1].QCurst1.Adult[1].Persid': '1',
    'BU[1].QCurst1.Adult[2].EmpStat': '2',
    'BU[1].QCurst1.Adult[2].Persid': '2',
    'BU[1].QBenefit.QWageBen.Adult[1].WageBen[1]': '5',
    'BU[1].QBenefit.QWageBen.Adult[1].Persid': '1',
    'BU[1].QBenefit.QWageBen.Adult[1].JSAType': '2',
    dmhSize: '2', // 'hhsize' in B4, check with BDSS?
    'dmName[1]': 'Richmond Ricecake', // `QNames.M[1].Name` in B4, check with BDSS?
    'hhg.P[1].BenUnit': '1',
    'hhg.P[1].Sex': '1',
    'dmDteOfBth[1]': '1980-01-15', // 'hhg.P[1].DoB' in B4, check with BDSS?
    'hhg.p[1].livewith': '1',
    'hhg.P[1].QRel[1].R': '97',
    'hhg.P[1].QRel[2].R': '1',
    'dmName[2]': 'Betty Bettison', // `QNames.M[2].Name` in B4, check with BDSS?
    'hhg.P[2].BenUnit': '1',
    'hhg.P[2].Sex': '2',
    'dmDteOfBth[2]': '1995-06-11', // 'hhg.P[2].DoB' in B4, check with BDSS?
    'hhg.p[2].livewith': '1',
    'hhg.P[2].QRel[1].R': '1',
    'hhg.P[2].QRel[2].R': '97',
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
