export interface Survey {
  name: string,
  questionnaires: QuestionnaireCaseDetails[],
}

export interface QuestionnaireCaseDetails {
  questionnaireName: string,
  numberOfCases: number,
  numberOfCasesAllocated: number
}
