export interface EditorInformation {
  numberOfCasesAllocated: number,
  Cases: {
    CaseId: string,
    EditStatus: string,
    EditUrl: string
  }[]
}
