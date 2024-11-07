import { CaseEditInformation } from 'blaise-api-node-client/lib/cjs/interfaces/case';
import EditedStatus from 'blaise-api-node-client/lib/cjs/enums/editedStatus';
import { SupervisorInformation } from '../Interfaces/supervisorInterface';

export default function mapSupervisorInformation(caseEditInformationList: CaseEditInformation[]): SupervisorInformation {
  return {
    TotalNumberOfCases: caseEditInformationList.length,
    NumberOfCasesNotAllocated: caseEditInformationList.filter((caseEditInformation) => caseEditInformation.assignedTo === '').length,
    NumberOfCasesAllocated: caseEditInformationList.filter((caseEditInformation) => caseEditInformation.assignedTo !== '').length,
    NumberOfCasesCompleted: caseEditInformationList.filter((caseEditInformation) => caseEditInformation.editedStatus === EditedStatus.Finished).length,
    EditorInformation: [],
  };
}
