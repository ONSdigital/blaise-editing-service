export default interface QuestionnaireAllocationDetails {
  name: string,
  allocation: AllocationDetails[]
}

export interface AllocationDetails {
  editor: string,
  cases: string[]
}
