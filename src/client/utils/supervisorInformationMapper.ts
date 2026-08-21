import type { SupervisorEditorInformation, SupervisorInformation } from "../types/supervisor.types";
import type { CaseEditInformation, User } from "blaise-api-node-client";

const EDITED_STATUS = {
  Query: 2,
  Finished: 3,
} as const;

function mapEditors(
  caseEditInformationList: CaseEditInformation[],
  editors: User[],
): SupervisorEditorInformation[] {
  const editorInformation: SupervisorEditorInformation[] = [];

  editors.forEach((editor) => {
    const casesAssignedToEditor = caseEditInformationList.filter(
      (caseEditInformation) => caseEditInformation.assignedTo === editor.name,
    );

    editorInformation.push({
      EditorName: editor.name,
      NumberOfCasesAllocated: casesAssignedToEditor.length,
      NumberOfCasesCompleted: casesAssignedToEditor.filter(
        (caseEditInformation) => caseEditInformation.editedStatus === EDITED_STATUS.Finished,
      ).length,
      NumberOfCasesQueried: casesAssignedToEditor.filter(
        (caseEditInformation) => caseEditInformation.editedStatus === EDITED_STATUS.Query,
      ).length,
    });
  });

  return editorInformation;
}

export default function toSupervisorInformation(
  caseEditInformationList: CaseEditInformation[],
  editors: User[],
): SupervisorInformation {
  return {
    TotalNumberOfCases: caseEditInformationList.length,
    NumberOfCasesNotAllocated: caseEditInformationList.filter(
      (caseEditInformation) => caseEditInformation.assignedTo === "",
    ).length,
    NumberOfCasesAllocated: caseEditInformationList.filter(
      (caseEditInformation) => caseEditInformation.assignedTo !== "",
    ).length,
    NumberOfCasesCompleted: caseEditInformationList.filter(
      (caseEditInformation) => caseEditInformation.editedStatus === EDITED_STATUS.Finished,
    ).length,
    EditorInformation: mapEditors(caseEditInformationList, editors),
  };
}
