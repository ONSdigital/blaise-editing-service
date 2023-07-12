import { Outcome } from 'blaise-api-node-client';

export interface ICaseDetails {
  CaseId: string,
  CaseStatus: Outcome,
  CaseLink: string
}
