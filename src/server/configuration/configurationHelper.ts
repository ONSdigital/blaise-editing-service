export function getStringOrThrowError(variable: string | undefined, variableName: string) {
  if (variable === undefined || variable.trim() === '') {
    throw ReferenceError(`${variableName} has not been set or is set to an empty string`);
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
