import { CaseOutcome } from 'blaise-api-node-client';

export interface CaseDetails {
  CaseId: string,
  CaseStatus: CaseOutcome,
  CaseLink: string,
  QuestionnaireName: string
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
