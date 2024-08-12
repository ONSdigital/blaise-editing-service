import crypto from 'crypto';

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
