import { ICaseStatus } from 'blaise-api-node-client';
import { ICaseDetails } from '../interfaces/case.details.interface';

export default function mapCaseDetails(caseStatusList: ICaseStatus[], questionnaireName:string, externalWebUrl:string): ICaseDetails[] {
  return caseStatusList.map((caseStatus) => ({
    CaseId: caseStatus.primaryKey,
    CaseStatus: caseStatus.outcome,
    CaseLink: `https://${externalWebUrl}/${questionnaireName}?Mode=CAWI&KeyValue=${caseStatus.primaryKey}`,
  }));
}
