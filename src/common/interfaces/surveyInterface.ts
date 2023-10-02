import { CaseDetails } from './caseInterface';

export interface Survey {
  name: string,
  questionnaires: QuestionnaireDetails[],
}

export interface QuestionnaireDetails {
  questionnaireName: string,
  numberOfCases: number,
  numberOfCasesAllocated: number,
}

export interface AllocationDetails {
  casesAllocated: CaseDetails[]
  casesNotAllocated: CaseDetails[]
}
