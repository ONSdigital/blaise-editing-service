import type { AllocationDetails } from "../../common/types/allocation.types";
import type { CaseEditInformation } from "blaise-api-node-client";
import type { User } from "blaise-api-node-client";

function mapEditorDetails(
  caseEditInformationList: CaseEditInformation[],
  editors: User[],
  allocationDetails: AllocationDetails,
) {
  editors.forEach((editor) => {
    allocationDetails.Editors.push({
      Name: editor.name,
      Cases: [],
    });
  });

  caseEditInformationList.forEach((caseEditInformation) => {
    if (caseEditInformation.assignedTo === "") {
      return;
    }

    const editorItem = allocationDetails.Editors?.find(
      (editor) => editor.Name === caseEditInformation.assignedTo,
    );

    if (editorItem !== undefined) {
      editorItem.Cases.push(caseEditInformation.primaryKey);
    }
  });
}

function mapInterviewerDetails(
  caseEditInformationList: CaseEditInformation[],
  allocationDetails: AllocationDetails,
) {
  caseEditInformationList.forEach((caseEditInformation) => {
    if (caseEditInformation.assignedTo !== "") {
      return;
    }

    const interviewerItem = allocationDetails.Interviewers?.find(
      (interviewer) => interviewer.Name === caseEditInformation.interviewer,
    );

    if (interviewerItem !== undefined) {
      interviewerItem.Cases.push(caseEditInformation.primaryKey);
    } else {
      allocationDetails.Interviewers.push({
        Name: caseEditInformation.interviewer,
        Cases: [caseEditInformation.primaryKey],
      });
    }
  });
}

export default function toAllocationDetails(
  caseEditInformationList: CaseEditInformation[],
  editors: User[],
): AllocationDetails {
  const allocationDetails = <AllocationDetails>{ Editors: [], Interviewers: [] };

  mapEditorDetails(caseEditInformationList, editors, allocationDetails);
  mapInterviewerDetails(caseEditInformationList, allocationDetails);

  return allocationDetails;
}
