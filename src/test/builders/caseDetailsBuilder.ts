import { CaseOutcome, CaseStatus } from 'blaise-api-node-client';
import { CaseDetails } from '../../common/interfaces/caseInterface';

export default class CaseDetailsBuilder {
  CaseStatusList: CaseOutcome[] = [CaseOutcome.Completed,
    CaseOutcome.HQRefusal,
    CaseOutcome.DeleteRequested];

  numberOfCases: number;

  questionnaireName: string;

  constructor(numberOfCases: number) {
    this.numberOfCases = numberOfCases;
    this.questionnaireName = 'OPN2201A';
  }

  BuildCaseDetails() {
    const caseDetailsList: CaseDetails[] = [];

    for (let caseNumber = 1; caseNumber <= this.numberOfCases; caseNumber += 1) {
      const caseOutcomeIndex = (caseNumber - 1) % this.CaseStatusList.length;

      caseDetailsList.push({
        CaseId: String(caseNumber),
        CaseStatus: this.CaseStatusList[caseOutcomeIndex] as CaseOutcome,
        CaseLink: `https://cati.blaise.com/${this.questionnaireName}?Mode=CAWI&KeyValue=${caseNumber}`,
        QuestionnaireName: this.questionnaireName,
      });
    }
    return caseDetailsList;
  }

  BuildCaseStatus() {
    const caseStatusList: CaseStatus[] = [];

    for (let caseNumber = 1; caseNumber <= this.numberOfCases; caseNumber += 1) {
      const caseOutcomeIndex = (caseNumber - 1) % this.CaseStatusList.length;

      caseStatusList.push(
        {
          primaryKey: String(caseNumber),
          outcome: this.CaseStatusList[caseOutcomeIndex] as CaseOutcome,
        },
      );
    }
    return caseStatusList;
  }
}
