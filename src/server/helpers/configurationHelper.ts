import crypto from 'crypto';
import { RoleConfiguration } from '../interfaces/roleConfigurationInterface';

export function getStringOrThrowError(variable: string | undefined, variableName: string) {
  if (variable === undefined || variable.trim() === '') {
    throw ReferenceError(`${variableName} has not been set or is set to an empty string`);
  }
  return variable;
}

export function getStringOrSetDefault(variable: string | undefined, defaultValue: string): string {
  if (variable === undefined || variable.trim() === '') {
    return defaultValue;
  }
  return variable;
}

export function getNumberOrThrowError(variable: string | undefined, variableName: string) {
  const value = getStringOrThrowError(variable, variableName);

  if (Number.isNaN(+value)) {
    throw new TypeError(`${variableName} is not set to a valid number`);
  }
  return +value;
}

export function GetListOrSetDefault(variable: string | undefined, defaultValues: string[]): string[] {
  if (!variable || variable === '' || variable.startsWith('_')) {
    return defaultValues;
  }
  return variable.split(',');
}

export function generateSessionSecret(secret: string | undefined): string {
  if (!secret || secret === '' || secret === '_SESSION_SECRET') {
    return crypto.randomBytes(20).toString('hex');
  }
  return secret;
}

export function fixUrl(url: string): string {
  if (url.startsWith('http')) {
    return url;
  }
  return `http://${url}`;
}

export function getRoles(roles: RoleConfiguration[]): string[] {
  return roles.map((r) => r.Role);
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

export function getSurveyConfigForRole(roleConfiguration: RoleConfiguration[], surveyTla: string, userRole: string) {
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
