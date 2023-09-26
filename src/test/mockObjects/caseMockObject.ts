import { CaseResponse, CaseStatus } from 'blaise-api-node-client';
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

export const caseStatusListMockObject:CaseStatus[] = [{
  primaryKey: case1PrimaryKey,
  outcome: case1outcome,
}, {
  primaryKey: case2PrimaryKey,
  outcome: case2outcome,
}, {
  primaryKey: case3PrimaryKey,
  outcome: case3outcome,
}];

export const caseDetailsListMockObject:CaseDetails[] = [
  {
    CaseId: case1PrimaryKey,
    CaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=${case1PrimaryKey}`,
    CaseStatus: case1outcome,
    QuestionnaireName: questionnaireName,
  },
  {
    CaseId: case2PrimaryKey,
    CaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=${case2PrimaryKey}`,
    CaseStatus: case2outcome,
    QuestionnaireName: questionnaireName,
  },
  {
    CaseId: case3PrimaryKey,
    CaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=${case3PrimaryKey}`,
    CaseStatus: case3outcome,
    QuestionnaireName: questionnaireName,
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
