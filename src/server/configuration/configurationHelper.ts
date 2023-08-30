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

export function loadRoles(roles: string | undefined): string[] {
  if (!roles || roles === '' || roles === '_ROLES') {
    return ['DST', 'BDSS', 'Researcher'];
  }
  return roles.split(',');
}

export function sessionSecret(secret: string | undefined): string {
  if (!secret || secret === '' || secret === '_SESSION_SECRET') {
    return crypto.randomBytes(20).toString('hex');
  }
  return secret;
}
