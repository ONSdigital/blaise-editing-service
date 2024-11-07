import { CaseEditInformation } from 'blaise-api-node-client/lib/cjs/interfaces/case';
import { Survey } from '../../common/interfaces/surveyInterface';
import { SupervisorInformation } from '../Interfaces/supervisorInterface';
import { EditorInformation } from '../Interfaces/editorInterface';
import mapEditorInformation from '../Mappers/editorInformaitionMapper';
import mapSupervisorInformation from '../Mappers/supervisorInformationMapper';
import { CaseSummaryDetails } from '../../common/interfaces/caseInterface';
import { getDataFromNode } from './AxiosApi';

export async function getSurveys(): Promise<Survey[]> {
  return getDataFromNode('/api/surveys}', 'Unable to find surveys, please contact Richmond Rice');
}

export async function getCaseSummary(questionnaireName: string, caseId: string): Promise<CaseSummaryDetails> {
  return getDataFromNode(`/api/questionnaires/${questionnaireName.toUpperCase()}/cases/${caseId}/summary`, 'The questionnaire is no longer available');
}

async function getCaseEditInformation(questionnaireName: string) {
  // TODO Fix the URL upper
  return getDataFromNode<CaseEditInformation[]>(`/api/questionnaires/${questionnaireName.toUpperCase()}/cases/edit`, 'Unable to find case edit information, please contact Richmond Rice');
}

export async function getEditorInformation(questionnaireName: string): Promise<EditorInformation> {
  const caseEditInformationList = await getCaseEditInformation(questionnaireName);

  return mapEditorInformation(caseEditInformationList);
}

export async function getSupervisorEditorInformation(questionnaireName: string): Promise<SupervisorInformation> {
  const caseEditInformationList = await getCaseEditInformation(questionnaireName);

  return mapSupervisorInformation(caseEditInformationList);
}
