export interface HousingBenefits {
  Amount: string,
  PeriodCode: string,
}

export interface CaseSummaryDetails {
  CaseId: string
  OutcomeCode: string,
  InterviewDate: Date,
  District: string,
  InterviewerName: string,
  NumberOfRespondents: string,
  Household: {
    Accommodation: {
      Main: string,
      Type: string,
    }
    FloorNumber: string,
    Status: string,
    NumberOfBedrooms: string,
    ReceiptOfHousingBenefit: HousingBenefits[],
    CouncilTaxBand: string,
    BusinessRoom: boolean,
    SelfEmployed: boolean,
    SelfEmployedMembers: string[],
    IncomeSupport: boolean,
    IncomeSupportMembers: string[],
    IncomeBasedJaSupport: boolean,
    IncomeBasedJaSupportMembers: string[],

  },
  Respondents: {
    PersonNumber: string,
    RespondentName: string,
    BenefitUnit: string,
    Sex: string,
    DateOfBirth: Date,
    MaritalStatus: string,
    Relationship: string[],
  }[]
}
