export interface Survey {
  name: string,
  questionnaires: QuestionnaireDetails[],
}

export interface QuestionnaireDetails {
  questionnaireName: string,
  numberOfCases: number,
  fieldPeriod: string | null,
  surveyTla: string,
}
