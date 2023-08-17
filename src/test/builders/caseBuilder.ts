import { CaseResponse } from 'blaise-api-node-client';
import { CaseFactsheetDetails } from '../../common/interfaces/caseInterface';

export default class CaseBuilder {
  caseId: string;

  addressLine1: string;

  addressLine2: string;

  addressLine3: string;

  addressLine4: string;

  county: string;

  town: string;

  postcode: string;

  outcomeCode: number;

  numberOfRespondents: number;

  interviewerName: string;

  respondentNames: string[];

  respondentDateOfBirths: Date[];

  names: string[] = [
    'Richmond Ricecake',
    'Bartholomew Edgar',
    'Sariha Smith',
    'George Thompson',
    'Tina Pipes',
    'Steve Doe',
    'Debra Oak',
    'Margret Keys',
    'Tim Lemmings',
    "Becky O'Light",
    'Ben Simmons',
    'Iona South-West',
  ];

  dateOfBirths: Date[] = [
    new Date(1980, 1, 15),
    new Date(1995, 5, 11),
    new Date(1991, 1, 1),
    new Date(1994, 12, 25),
    new Date(1999, 11, 7),
    new Date(1973, 7, 9),
    new Date(1982, 2, 23),
    new Date(1990, 9, 13),
    new Date(1996, 1, 24),
    new Date(1954, 7, 30),
  ];

  constructor(numberOfRespondents: number) {
    this.numberOfRespondents = numberOfRespondents;

    this.caseId = '90001';
    this.addressLine1 = 'Flat 1';
    this.addressLine2 = 'Richmond House';
    this.addressLine3 = 'Rice Road';
    this.addressLine4 = 'Duffrin';
    this.county = 'Gwent';
    this.town = 'Newport';
    this.postcode = 'NZ11 4PD';
    this.outcomeCode = 110;
    this.interviewerName = 'Rich';
    this.respondentNames = [];
    this.respondentDateOfBirths = [];

    for (let respondentNumber = 0; respondentNumber < this.numberOfRespondents; respondentNumber += 1) {
      this.respondentNames.push(String(this.names[respondentNumber]));
      this.respondentDateOfBirths.push(this.dateOfBirths[respondentNumber] as Date);
    }
  }

  buildCaseResponse():CaseResponse {
    const caseResponse: CaseResponse = {
      caseId: `${this.caseId}`,
      fieldData: {
        'qiD.Serial_Number': this.caseId,
        'qDataBag.Prem1': this.addressLine1,
        'qDataBag.Prem2': this.addressLine2,
        'qDataBag.Prem3': this.addressLine3,
        'qDataBag.Prem4': this.addressLine4,
        'qDataBag.District': this.county,
        'qDataBag.PostTown': this.town,
        'qDataBag.PostCode': this.postcode,
        'qhAdmin.HOut': this.outcomeCode,
        'qhAdmin.Interviewer[1]': this.interviewerName,
        dmhSize: this.numberOfRespondents,
      },
    };

    for (let respondentNumber = 0; respondentNumber < this.numberOfRespondents; respondentNumber += 1) {
      caseResponse.fieldData[`dmName[${respondentNumber + 1}]`] = this.respondentNames[respondentNumber];
      caseResponse.fieldData[`dmDteOfBth[${respondentNumber + 1}]`] = this.respondentDateOfBirths[respondentNumber];
    }
    return caseResponse;
  }

  buildCaseFactsheet():CaseFactsheetDetails {
    const caseFactsheet: CaseFactsheetDetails = {
      CaseId: this.caseId,
      OutcomeCode: this.outcomeCode,
      InterviewerName: this.interviewerName,
      NumberOfRespondents: this.numberOfRespondents,
      Address: {
        AddressLine1: this.addressLine1,
        AddressLine2: this.addressLine2,
        AddressLine3: this.addressLine3,
        AddressLine4: this.addressLine4,
        County: this.county,
        Town: this.town,
        Postcode: this.postcode,
      },
      Respondents: [],
    };

    for (let respondentNumber = 0; respondentNumber < this.numberOfRespondents; respondentNumber += 1) {
      caseFactsheet.Respondents.push({
        RespondentName: this.respondentNames[respondentNumber] as string,
        DateOfBirth: this.respondentDateOfBirths[respondentNumber] as Date,
      });
    }
    return caseFactsheet;
  }
}
