export default interface QuestionnaireAllocationDetails {
  name: string,
  allocation: OldAllocationDetails[]
}

export interface OldAllocationDetails {
  editor: string,
  cases: string[]
}
