import { CaseOutcome } from 'blaise-api-node-client';

export interface EditorInformation {
  numberOfCasesAllocated: number,
  Cases: {
    CaseId: string,
    EditStatus: string
  }[]

}

export interface CaseDetails {
  CaseId: string,
  CaseStatus: CaseOutcome,
  EditorAllocated: string
  EditCaseLink: string;
}

export interface CaseFactsheetDetails {
  CaseId: string
  OutcomeCode: number,
  InterviewerName: string,
  NumberOfRespondents: number,
  Address: {
    AddressLine1: string,
    AddressLine2: string,
    AddressLine3: string,
    AddressLine4: string,
    County: string,
    Town: string,
    Postcode: string,
  },
  Respondents: {
    RespondentName: string,
    DateOfBirth: Date,
  }[]
}
