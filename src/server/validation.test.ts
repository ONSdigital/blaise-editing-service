import {
  CsvValidationError,
  isValidQuestionnaireName,
  isValidUserRole,
  validateQuestionnaireName,
  validateUserRole,
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

describe('user role validation', () => {
  it('should accept valid user role values', () => {
    expect(isValidUserRole('SVT Editor')).toBe(true);
    expect(isValidUserRole('Survey Support')).toBe(true);
    expect(validateUserRole('FRS Researcher')).toBe('FRS Researcher');
  });

  it('should reject invalid user role values', () => {
    expect(isValidUserRole('')).toBe(false);
    expect(isValidUserRole('!admin')).toBe(false);
    expect(isValidUserRole(' role')).toBe(false);

    expect(() => validateUserRole('!admin')).toThrow(CsvValidationError);
  });
});

