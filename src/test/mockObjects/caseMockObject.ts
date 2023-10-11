import { CaseData, CaseResponse } from 'blaise-api-node-client';
import { CaseDetails, CaseFactsheetDetails } from '../../common/interfaces/caseInterface';

const questionnaireName = 'OPN2201A';
const case1PrimaryKey = '1';
const case2PrimaryKey = '2';
const case3PrimaryKey = '3';

const case1outcome = 110;
const case2outcome = 310;
const case3outcome = 0;

const person1Name = 'Richmond Ricecake';
const person2Name = 'Bartholomew Edgar';

const person1Dob = new Date(1980, 1, 15);
const person2Dob = new Date(1995, 5, 11);

const blaiseUser1 = 'rrice';
const blaiseUser2 = 'bedgar';

export const caseDataListMockObject: CaseData[] = [
  {
    'qserial.serial_number': case1PrimaryKey,
    'qhadmin.hout': case1outcome,
    'allocation.toeditor': blaiseUser1,
  },
  {
    'qserial.serial_number': case2PrimaryKey,
    'qhadmin.hout': case2outcome,
    'allocation.toeditor': '',
  },
  {
    'qserial.serial_number': case3PrimaryKey,
    'qhadmin.hout': case3outcome,
    'allocation.toeditor': blaiseUser2,
  },
];

export const caseDetailsListMockObject:CaseDetails[] = [
  {
    CaseId: case1PrimaryKey,
    EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=${case1PrimaryKey}`,
    CaseStatus: case1outcome,
    EditorAllocated: blaiseUser1,
  },
  {
    CaseId: case2PrimaryKey,
    EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=${case2PrimaryKey}`,
    CaseStatus: case2outcome,
    EditorAllocated: '',
  },
  {
    CaseId: case3PrimaryKey,
    EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=${case3PrimaryKey}`,
    CaseStatus: case3outcome,
    EditorAllocated: blaiseUser2,
  },
];

export const allocatedCaseDetailsListMockObject:CaseDetails[] = [
  {
    CaseId: case1PrimaryKey,
    EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=${case1PrimaryKey}`,
    CaseStatus: case1outcome,
    EditorAllocated: blaiseUser1,
  },
  {
    CaseId: case3PrimaryKey,
    EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=${case3PrimaryKey}`,
    CaseStatus: case3outcome,
    EditorAllocated: blaiseUser2,
  },
];

export const unallocatedCaseDetailsListMockObject:CaseDetails[] = [
  {
    CaseId: case2PrimaryKey,
    EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=${case2PrimaryKey}`,
    CaseStatus: case2outcome,
    EditorAllocated: '',
  },
];

export const caseResponseMockObject: CaseResponse = {
  caseId: case1PrimaryKey,
  fieldData: {
    'qiD.Serial_Number': case1PrimaryKey,
    'qDataBag.Prem1': 'Flat 1',
    'qDataBag.Prem2': 'Richmond House',
    'qDataBag.Prem3': 'Rice Road',
    'qDataBag.Prem4': 'Duffrin',
    'qDataBag.District': 'Gwent',
    'qDataBag.PostTown': 'Newport',
    'qDataBag.PostCode': 'NZ11 4PD',
    'qhAdmin.HOut': case1outcome,
    'qhAdmin.Interviewer[1]': 'Rich',
    dmhSize: 2,
    'dmName[1]': person1Name,
    'dmDteOfBth[1]': person1Dob,
    'dmName[2]': person2Name,
    'dmDteOfBth[2]': person2Dob,
  },
};

export const caseFactsheetMockObject:CaseFactsheetDetails = {
  CaseId: case1PrimaryKey,
  OutcomeCode: case1outcome,
  InterviewerName: 'Rich',
  NumberOfRespondents: 2,
  Address: {
    AddressLine1: 'Flat 1',
    AddressLine2: 'Richmond House',
    AddressLine3: 'Rice Road',
    AddressLine4: 'Duffrin',
    County: 'Gwent',
    Town: 'Newport',
    Postcode: 'NZ11 4PD',
  },
  Respondents: [
    {
      RespondentName: person1Name,
      DateOfBirth: person1Dob,
    },
    {
      RespondentName: person2Name,
      DateOfBirth: person2Dob,
    },
  ],
};
