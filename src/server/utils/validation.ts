const QUESTIONNAIRE_NAME_REGEX = /^[A-Z0-9](?:[A-Z0-9_]{1,62}[A-Z0-9])?$/;
const USER_ROLE_REGEX = /^[A-Za-z][A-Za-z0-9 _-]{1,63}$/;
const UAC_REGEX = /^[A-Za-z0-9]{8,64}$/;
const UPLOADED_FILE_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9._-]{0,254}$/;

export class CsvValidationError extends Error {
  readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "CsvValidationError";
    this.statusCode = 400;
  }
}

function throwValidationError(fieldName: string): never {
  throw new CsvValidationError(`Invalid ${fieldName}`);
}

export function isValidQuestionnaireName(value: string): boolean {
  return QUESTIONNAIRE_NAME_REGEX.test(value);
}

export function validateQuestionnaireName(value: string, fieldName = "questionnaire name"): string {
  if (!isValidQuestionnaireName(value)) {
    throwValidationError(fieldName);
  }

  return value;
}

export function isValidUserRole(value: unknown): value is string {
  return typeof value === "string" && USER_ROLE_REGEX.test(value);
}

export function validateUserRole(value: unknown, fieldName = "user role"): string {
  if (!isValidUserRole(value)) {
    throwValidationError(fieldName);
  }

  return value;
}

export function isValidUac(value: unknown): value is string {
  return typeof value === "string" && UAC_REGEX.test(value);
}

export function validateUac(value: unknown, fieldName = "uac"): string {
  if (!isValidUac(value)) {
    throwValidationError(fieldName);
  }

  return value;
}

export function isValidUploadedFileName(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  if (!UPLOADED_FILE_NAME_REGEX.test(value)) {
    return false;
  }

  if (value.includes("/") || value.includes("\\") || value.includes("..")) {
    return false;
  }

  return value.toLowerCase().endsWith(".csv");
}

export function validateUploadedFileName(value: unknown, fieldName = "uploaded file name"): string {
  if (!isValidUploadedFileName(value)) {
    throwValidationError(fieldName);
  }

  return value;
}
