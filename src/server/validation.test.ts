import {
  CsvValidationError,
  isValidQuestionnaireName,
  isValidUac,
  isValidUploadedFileName,
  validateQuestionnaireName,
  validateUac,
  validateUploadedFileName,
} from './validation';

describe('CsvValidationError', () => {
  it('should expose a 400 status code', () => {
    const error = new CsvValidationError('Invalid value');

    expect(error.name).toBe('CsvValidationError');
    expect(error.message).toBe('Invalid value');
    expect(error.statusCode).toBe(400);
  });
});

describe('questionnaire name validation', () => {
  it('should accept valid questionnaire names', () => {
    expect(isValidQuestionnaireName('FRS2504A_EDIT')).toBe(true);
    expect(isValidQuestionnaireName('LMS2101_AA1')).toBe(true);
    expect(validateQuestionnaireName('OPN2201A')).toBe('OPN2201A');
  });

  it('should reject invalid questionnaire names', () => {
    expect(isValidQuestionnaireName('frs2504a')).toBe(false);
    expect(isValidQuestionnaireName('FRS-2504A')).toBe(false);
    expect(isValidQuestionnaireName('_FRS2504A')).toBe(false);

    expect(() => validateQuestionnaireName('frs2504a')).toThrow(CsvValidationError);
  });
});

describe('UAC validation', () => {
  it('should accept valid UAC values', () => {
    expect(isValidUac('ABC123')).toBe(true);
    expect(isValidUac('A1B2C3D4E5F6')).toBe(true);
    expect(validateUac('ZXCVBN123456')).toBe('ZXCVBN123456');
  });

  it('should reject invalid UAC values', () => {
    expect(isValidUac('A1B2')).toBe(false);
    expect(isValidUac('ABC 123')).toBe(false);
    expect(isValidUac('ABC-123')).toBe(false);

    expect(() => validateUac('ABC 123')).toThrow(CsvValidationError);
  });
});

describe('uploaded file name validation', () => {
  it('should accept valid upload file names', () => {
    expect(isValidUploadedFileName('cases.csv')).toBe(true);
    expect(isValidUploadedFileName('bes_upload_2026-08-05.csv')).toBe(true);
    expect(validateUploadedFileName('upload.v2.csv')).toBe('upload.v2.csv');
  });

  it('should reject invalid upload file names', () => {
    expect(isValidUploadedFileName('cases.txt')).toBe(false);
    expect(isValidUploadedFileName('../cases.csv')).toBe(false);
    expect(isValidUploadedFileName('folder/cases.csv')).toBe(false);
    expect(isValidUploadedFileName('.env.csv')).toBe(false);

    expect(() => validateUploadedFileName('../cases.csv')).toThrow(CsvValidationError);
  });
});
