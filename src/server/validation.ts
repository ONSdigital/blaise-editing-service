const QUESTIONNAIRE_NAME_REGEX = /^[A-Z0-9](?:[A-Z0-9_]{1,62}[A-Z0-9])?$/;
const UAC_REGEX = /^[A-Za-z0-9]{6,32}$/;
const UPLOADED_FILE_NAME_REGEX = /^[A-Za-z0-9](?:[A-Za-z0-9._-]{0,126}[A-Za-z0-9])?\.csv$/i;

export class CsvValidationError extends Error {
  readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'CsvValidationError';
    this.statusCode = 400;
  }
}

function throwValidationError(fieldName: string): never {
  throw new CsvValidationError(`Invalid ${fieldName}`);
}

export function isValidQuestionnaireName(value: string): boolean {
  return QUESTIONNAIRE_NAME_REGEX.test(value);
}

export function validateQuestionnaireName(value: string, fieldName = 'questionnaire name'): string {
  if (!isValidQuestionnaireName(value)) {
    throwValidationError(fieldName);
  }

  return value;
}

export function isValidUac(value: string): boolean {
  return UAC_REGEX.test(value);
}

export function validateUac(value: string, fieldName = 'UAC'): string {
  if (!isValidUac(value)) {
    throwValidationError(fieldName);
  }

  return value;
}

export function isValidUploadedFileName(value: string): boolean {
  if (!UPLOADED_FILE_NAME_REGEX.test(value)) {
    return false;
  }

  if (value.includes('..')) {
    return false;
  }

  if (value.includes('/') || value.includes('\\')) {
    return false;
  }

  return true;
}

export function validateUploadedFileName(value: string, fieldName = 'uploaded file name'): string {
  if (!isValidUploadedFileName(value)) {
    throwValidationError(fieldName);
  }

  return value;
}
