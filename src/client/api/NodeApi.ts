import { CaseEditInformation } from 'blaise-api-node-client/lib/cjs/interfaces/case';
import { User } from 'blaise-api-node-client/lib/cjs/interfaces/user';
import { Survey } from '../../common/interfaces/surveyInterface';
import { SupervisorInformation } from '../Interfaces/supervisorInterface';
import { EditorInformation } from '../Interfaces/editorInterface';
import mapEditorInformation from '../Mappers/editorInformaitionMapper';
import mapSupervisorInformation from '../Mappers/supervisorInformationMapper';
import { CaseSummaryDetails } from '../../common/interfaces/caseInterface';
import mapCasesNotAllocated from '../Mappers/caseAllocationMapper';
import { AllocationDetails } from '../../common/interfaces/allocationInterface';
import { getDataFromNode, patchDataToNode } from './AxiosApi';

export async function getSurveys(userRole: string): Promise<Survey[]> {
  return getDataFromNode(`/api/surveys?userRole=${userRole}`, 'Unable to find surveys, please contact Richmond Rice');
}

export async function getCaseSummary(questionnaireName: string, caseId: string): Promise<CaseSummaryDetails> {
  return getDataFromNode(`/api/questionnaires/${questionnaireName.toUpperCase()}/cases/${caseId}/summary`, 'The questionnaire is no longer available');
}

async function getCaseEditInformation(questionnaireName: string, userRole: string) {
  // TODO Fix the URL upper
  return getDataFromNode<CaseEditInformation[]>(`/api/questionnaires/${questionnaireName.toUpperCase()}/cases/edit?userRole=${userRole}`, 'Unable to find case edit information, please contact Richmond Rice');
}

export async function getEditorInformation(questionnaireName: string, editorUsername:string, editorRole: string): Promise<EditorInformation> {
  const caseEditInformationList = await getCaseEditInformation(questionnaireName, editorRole);
  const caseEditInformationListForEditor = caseEditInformationList.filter((caseEditInformation) => caseEditInformation.assignedTo === editorUsername);

  return mapEditorInformation(caseEditInformationListForEditor);
}

export async function getSupervisorEditorInformation(questionnaireName: string, supervisorRole: string, editorRole: string): Promise<SupervisorInformation> {
  const caseEditInformationList = await getCaseEditInformation(questionnaireName, supervisorRole);
  const editors = await getDataFromNode<User[]>(`/api/users?userRole=${editorRole}`, 'Unable to find user information, please contact Richmond Rice');

  return mapSupervisorInformation(caseEditInformationList, editors);
}

export async function getAllocationDetails(questionnaireName: string, supervisorRole: string, editorRole: string): Promise<AllocationDetails> {
  const caseEditInformationList = await getCaseEditInformation(questionnaireName, supervisorRole);
  const editors = await getDataFromNode<User[]>(`/api/users?userRole=${editorRole}`, 'Unable to find user information, please contact Richmond Rice');

  return mapCasesNotAllocated(caseEditInformationList, editors);
}

export async function updateAllocationDetails(questionnaireName: string, name:string, cases:string[]): Promise<void> {
  const payload = { name, cases };
  await patchDataToNode(`/api/questionnaires/${questionnaireName.toUpperCase()}/cases/`, payload, 'Unable to allocate, please contact Richmond Rice');
}
