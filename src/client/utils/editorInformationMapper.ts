import type { EditorInformation } from "../types/editor.types";
import type { CaseEditInformation } from "blaise-api-node-client";

const EDITED_STATUS = {
  NotStarted: 0,
  Started: 1,
  Query: 2,
  Finished: 3,
} as const;

const editedStatusDescription = new Map<number, string>([
  [EDITED_STATUS.NotStarted, "Not started"],
  [EDITED_STATUS.Started, "In progress"],
  [EDITED_STATUS.Query, "Queried"],
  [EDITED_STATUS.Finished, "Completed"],
]);

export default function toEditorInformation(
  caseEditInformationList: CaseEditInformation[],
): EditorInformation {
  const editorInformation = <EditorInformation>{ numberOfCasesAllocated: 0, Cases: [] };

  caseEditInformationList.forEach((caseEditInformation) => {
    editorInformation.Cases.push({
      CaseId: caseEditInformation.primaryKey,
      EditStatus: editedStatusDescription.get(caseEditInformation.editedStatus) ?? "N/A",
      EditUrl: caseEditInformation.editUrl,
    });
  });

  editorInformation.numberOfCasesAllocated = editorInformation.Cases.length;

  return editorInformation;
}
