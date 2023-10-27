import { CaseData, CaseResponse } from 'blaise-api-node-client';
import { CaseDetails, CaseFactsheetDetails } from '../../common/interfaces/caseInterface';
import CaseFields from '../../client/Common/enums/CaseFields';
import { EditorAllocationDetails } from '../../common/interfaces/surveyInterface';
import stringIsNullOrEmpty from '../../common/helpers/stringHelper';

export function mapCaseDetails(caseDataList: CaseData[], questionnaireName:string, externalWebUrl:string): CaseDetails[] {
  return caseDataList.map((caseData) => ({
    CaseId: caseData[CaseFields.Id],
    CaseStatus: caseData[CaseFields.Status],
    EditorAllocated: caseData[CaseFields.AllocatedTo],
    EditCaseLink: `https://${externalWebUrl}/${questionnaireName}?Mode=CAWI&KeyValue=${caseData[CaseFields.Id]}`,
  }));
}

export function mapEditorAllocationDetails(caseDataList: CaseData[]): EditorAllocationDetails[] {
  const editorAllocationDetails: EditorAllocationDetails[] = [];
  const casesAssigned = caseDataList.filter((cases) => !stringIsNullOrEmpty(cases[CaseFields.AllocatedTo]));

  casesAssigned.forEach((caseAssigned) => {
    const editor:string = caseAssigned[CaseFields.AllocatedTo];
    const caseId:string = caseAssigned[CaseFields.Id];
    const existingEditorAllocation = editorAllocationDetails.find((allocationDetails) => allocationDetails.editor === editor);

    if (existingEditorAllocation) {
      existingEditorAllocation.cases.push(caseId);
      return;
    }

    editorAllocationDetails.push({ editor, cases: [caseId] });
  });

  return editorAllocationDetails;
}

export function mapCaseFactsheet(caseResponse: CaseResponse): CaseFactsheetDetails {
  const caseFactSheet: CaseFactsheetDetails = {
    CaseId: caseResponse.caseId,
    OutcomeCode: Number(caseResponse.fieldData['qhAdmin.HOut']),
    InterviewerName: caseResponse.fieldData['qhAdmin.Interviewer[1]'],
    NumberOfRespondents: Number(caseResponse.fieldData['dmhSize']),
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
      DateOfBirth: new Date(caseResponse.fieldData[`dmDteOfBth[${respondentNumber}]`]),
    });
  }

  return caseFactSheet;
}
