export interface SupervisorEditorInformation {
  EditorName: string,
  NumberOfCasesAllocated: number,
  NumberOfCasesCompleted: number,
  NumberOfCasesQueried: number
}

export interface SupervisorInformation {
  TotalNumberOfCases: number,
  NumberOfCasesNotAllocated: number,
  NumberOfCasesAllocated: number,
  NumberOfCasesCompleted: number,
  EditorInformation: SupervisorEditorInformation[]
}
