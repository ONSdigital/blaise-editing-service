import type { RoleConfiguration } from "../roleConfiguration.js";

export function getStringOrThrowError(variable: string | undefined, variableName: string) {
  if (variable === undefined || variable.trim() === "" || variable.trim() === `_${variableName}`) {
    throw ReferenceError(`${variableName} has not been set or is set to an empty string`);
  }

  return variable;
}

export function fixUrl(url: string): string {
  if (url.startsWith("http")) {
    return url;
  }

  return `http://${url}`;
}

export function getSurveysForRole(roleConfiguration: RoleConfiguration[], userRole: string) {
  const roleConfig = roleConfiguration.find(({ Role }) => Role === userRole);

  if (roleConfig === undefined) {
    throw new Error(`Role ${userRole} not found in Role configuration`);
  }

  const surveys: string[] = [];

  roleConfig.Surveys.forEach(({ Survey }) => {
    if (surveys.indexOf(Survey) === -1) surveys.push(Survey);
  });

  return surveys;
}

export function getSurveyConfigForRole(
  roleConfiguration: RoleConfiguration[],
  surveyTla: string,
  userRole: string,
) {
  const roleConfig = roleConfiguration.find(({ Role }) => Role === userRole);

  if (roleConfig === undefined) {
    throw new Error(`Role: '${userRole}' not found in Role configuration`);
  }

  const surveyConfig = roleConfig.Surveys.find((survey) => survey.Survey === surveyTla);

  if (surveyConfig === undefined) {
    throw new Error(`No '${surveyTla}' survey configuration found for Role ${userRole}`);
  }

  return surveyConfig;
}
