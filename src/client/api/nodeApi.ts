import mapCasesNotAllocated from "../utils/caseAllocationMapper";
import toEditorInformation from "../utils/editorInformationMapper";
import toSupervisorInformation from "../utils/supervisorInformationMapper";

import { getDataFromNode, patchDataToNode } from "./axiosApi";

import type { AllocationDetails } from "../../common/types/allocation.types";
import type { CaseSummaryDetails } from "../../common/types/case.types";
import type { Survey } from "../../common/types/survey.types";
import type { EditorInformation } from "../types/editor.types";
import type { SupervisorInformation } from "../types/supervisor.types";
import type { CaseEditInformation, User } from "blaise-api-node-client";

function normaliseQuestionnaireNameForPath(questionnaireName: string): string {
  return questionnaireName.trim().toUpperCase();
}

function questionnaireApiPath(questionnaireName: string): string {
  return `/api/questionnaires/${normaliseQuestionnaireNameForPath(questionnaireName)}`;
}

export async function getSurveys(userRole: string): Promise<Survey[]> {
  return getDataFromNode(
    `/api/surveys?userRole=${userRole}`,
    "Unable to find surveys, please raise this on service desk stating the time and date of failure",
  );
}

export async function getCaseSummary(
  questionnaireName: string,
  caseId: string,
): Promise<CaseSummaryDetails> {
  return getDataFromNode(
    `${questionnaireApiPath(questionnaireName)}/cases/${caseId}/summary`,
    "The questionnaire is no longer available",
  );
}

async function getCaseEditInformation(questionnaireName: string, userRole: string) {
  return getDataFromNode<CaseEditInformation[]>(
    `${questionnaireApiPath(questionnaireName)}/cases/edit?userRole=${userRole}`,
    "Unable to find case edit information, please raise this on service desk stating the time and date of failure",
  );
}

export async function getEditorInformation(
  questionnaireName: string,
  editorUsername: string,
  editorRole: string,
): Promise<EditorInformation> {
  const caseEditInformationList = await getCaseEditInformation(questionnaireName, editorRole);
  const caseEditInformationListForEditor = caseEditInformationList.filter(
    (caseEditInformation) => caseEditInformation.assignedTo === editorUsername,
  );

  return toEditorInformation(caseEditInformationListForEditor);
}

export async function getSupervisorEditorInformation(
  questionnaireName: string,
  supervisorRole: string,
  editorRole: string,
): Promise<SupervisorInformation> {
  const caseEditInformationList = await getCaseEditInformation(questionnaireName, supervisorRole);
  const editors = await getDataFromNode<User[]>(
    `/api/users?userRole=${editorRole}`,
    "Unable to find user information, please raise this on service desk stating the time and date of failure",
  );

  return toSupervisorInformation(caseEditInformationList, editors);
}

export async function getAllocationDetails(
  questionnaireName: string,
  supervisorRole: string,
  editorRole: string,
): Promise<AllocationDetails> {
  const caseEditInformationList = await getCaseEditInformation(questionnaireName, supervisorRole);
  const editors = await getDataFromNode<User[]>(
    `/api/users?userRole=${editorRole}`,
    "Unable to find user information, please raise this on service desk stating the time and date of failure",
  );

  return mapCasesNotAllocated(caseEditInformationList, editors);
}

export async function updateAllocationDetails(
  questionnaireName: string,
  name: string,
  cases: string[],
): Promise<void> {
  const payload = { name, cases };

  await patchDataToNode(
    `${questionnaireApiPath(questionnaireName)}/cases/allocate`,
    payload,
    "Unable to allocate, please raise this on service desk stating the time and date of failure",
  );
}

export async function getCaseSearchResults(
  questionnaireName: string,
  caseId: string,
  role: string,
): Promise<CaseEditInformation[]> {
  const caseEditInformationList = await getCaseEditInformation(questionnaireName, role);

  return caseEditInformationList.filter((caseEditInformation) =>
    caseEditInformation.primaryKey.startsWith(caseId),
  );
}

export async function getSpecificCaseEditInformation(
  questionnaireName: string,
  caseId: string,
  role: string,
): Promise<CaseEditInformation> {
  const caseEditInformationList = await getCaseEditInformation(questionnaireName, role);
  const caseEditInformation = caseEditInformationList.find(
    (caseDetails) => caseDetails.primaryKey === caseId,
  );

  if (!caseEditInformation) {
    throw new Error(`Case details not found with case ID: ${caseId}`);
  }

  return caseEditInformation;
}

export async function setCaseToUpdate(questionnaireName: string, caseId: string): Promise<number> {
  const responseStatus = await patchDataToNode(
    `${questionnaireApiPath(questionnaireName)}/cases/${caseId}/update`,
    {},
    "Unable to set case to update, please raise this on service desk stating the time and date of failure",
  );

  return responseStatus;
}
