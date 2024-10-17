export interface AllocationDetails {
  Editors: UserAllocationDetails[]
  Interviewers: UserAllocationDetails[]
}

export interface UserAllocationDetails {
  Name: string;
  Cases: string[]
}
