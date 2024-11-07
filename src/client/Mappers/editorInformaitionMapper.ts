import { CaseEditInformation } from 'blaise-api-node-client/lib/cjs/interfaces/case';
import { EditorInformation } from '../Interfaces/editorInterface';

export default function mapEditorInformation(caseEditInformationList: CaseEditInformation[]): EditorInformation {
  const editorInformation = <EditorInformation>{ numberOfCasesAllocated: 0, Cases: [] };

  caseEditInformationList.forEach((caseEditInformation) => {
    editorInformation.Cases.push({
      CaseId: caseEditInformation.primaryKey,
      EditUrl: caseEditInformation.editUrl,
    });
  });

  editorInformation.numberOfCasesAllocated = editorInformation.Cases.length;

  return editorInformation;
}
