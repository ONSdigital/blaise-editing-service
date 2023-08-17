import { CaseResponse, CaseStatus } from 'blaise-api-node-client';
import { CaseDetails, CaseFactsheetDetails } from '../../common/interfaces/caseInterface';

export function mapCaseDetails(caseStatusList: CaseStatus[], questionnaireName:string, externalWebUrl:string): CaseDetails[] {
  return caseStatusList.map((caseStatus) => ({
    CaseId: caseStatus.primaryKey,
    CaseStatus: caseStatus.outcome,
    CaseLink: `https://${externalWebUrl}/${questionnaireName}?Mode=CAWI&KeyValue=${caseStatus.primaryKey}`,
    QuestionnaireName: questionnaireName,
  }));
}

export function mapCaseFactsheet(caseResponse: CaseResponse): CaseFactsheetDetails {
  const caseFactSheet: CaseFactsheetDetails = {
    CaseId: caseResponse.caseId,
    OutcomeCode: caseResponse.fieldData['qhAdmin.HOut'],
    InterviewerName: caseResponse.fieldData['qhAdmin.Interviewer[1]'],
    NumberOfRespondents: caseResponse.fieldData['dmhSize'],
    Address: {
      AddressLine1: caseResponse.fieldData['qDataBag.Prem1'],
      AddressLine2: caseResponse.fieldData['qDataBag.Prem2'],
      AddressLine3: caseResponse.fieldData['qDataBag.Prem3'],
      AddressLine4: caseResponse.fieldData['qDataBag.Prem4'],
      County: caseResponse.fieldData['qDataBag.District'],
      Town: caseResponse.fieldData['qDataBag.PostTown'],
      Postcode: caseResponse.fieldData['qDataBag.PostCode'],
    },
    Respondents: [],
  };

  const numberOfRespondents = +caseFactSheet.NumberOfRespondents;

  if (Number.isNaN(numberOfRespondents) || numberOfRespondents === 0) {
    throw new Error('Number of responents not specified');
  }

  for (let respondentNumber = 1; respondentNumber <= numberOfRespondents; respondentNumber += 1) {
    caseFactSheet.Respondents.push({
      RespondentName: caseResponse.fieldData[`dmName[${respondentNumber}]`],
      DateOfBirth: caseResponse.fieldData[`dmDteOfBth[${respondentNumber}]`],
    });
  }

  return caseFactSheet;
}
