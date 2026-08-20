import {
  CsvValidationError,
  isValidQuestionnaireName,
  isValidUac,
  isValidUploadedFileName,
  isValidUserRole,
  validateQuestionnaireName,
  validateUac,
  validateUploadedFileName,
  validateUserRole,
} from "./validation.js";

describe("CsvValidationError", () => {
  it("should expose a 400 status code", () => {
    const error = new CsvValidationError("Invalid value");

    expect(error.name).toBe("CsvValidationError");
    expect(error.message).toBe("Invalid value");
    expect(error.statusCode).toBe(400);
  });
});

describe("questionnaire name validation", () => {
  it("should accept valid questionnaire names", () => {
    expect(isValidQuestionnaireName("FRS2504A_EDIT")).toBe(true);
    expect(isValidQuestionnaireName("LMS2101_AA1")).toBe(true);
    expect(validateQuestionnaireName("OPN2201A")).toBe("OPN2201A");
  });

  it("should reject invalid questionnaire names", () => {
    expect(isValidQuestionnaireName("frs2504a")).toBe(false);
    expect(isValidQuestionnaireName("FRS-2504A")).toBe(false);
    expect(isValidQuestionnaireName("_FRS2504A")).toBe(false);

    expect(() => validateQuestionnaireName("frs2504a")).toThrow(CsvValidationError);
  });
});

describe("user role validation", () => {
  it("should accept valid user role values", () => {
    expect(isValidUserRole("SVT Editor")).toBe(true);
    expect(isValidUserRole("Survey Support")).toBe(true);
    expect(validateUserRole("FRS Researcher")).toBe("FRS Researcher");
  });

  it("should reject invalid user role values", () => {
    expect(isValidUserRole("")).toBe(false);
    expect(isValidUserRole("!admin")).toBe(false);
    expect(isValidUserRole(" role")).toBe(false);

    expect(() => validateUserRole("!admin")).toThrow(CsvValidationError);
  });
});

describe("uac validation", () => {
  it("should accept valid uac values", () => {
    expect(isValidUac("ABC12345")).toBe(true);
    expect(isValidUac("A1B2C3D4E5F6G7H8")).toBe(true);
    expect(validateUac("ZZ99YY88")).toBe("ZZ99YY88");
  });

  it("should reject invalid uac values", () => {
    expect(isValidUac("short")).toBe(false);
    expect(isValidUac("ABC-12345")).toBe(false);
    expect(isValidUac("ABC 12345")).toBe(false);

    expect(() => validateUac("short")).toThrow(CsvValidationError);
  });
});

describe("uploaded filename validation", () => {
  it("should accept valid uploaded csv file names", () => {
    expect(isValidUploadedFileName("cases.csv")).toBe(true);
    expect(isValidUploadedFileName("cases_2026-08-18.csv")).toBe(true);
    expect(validateUploadedFileName("edit-data.v2.csv")).toBe("edit-data.v2.csv");
  });

  it("should reject invalid uploaded file names", () => {
    expect(isValidUploadedFileName("../cases.csv")).toBe(false);
    expect(isValidUploadedFileName("folder/cases.csv")).toBe(false);
    expect(isValidUploadedFileName("cases.txt")).toBe(false);
    expect(isValidUploadedFileName(".env")).toBe(false);

    expect(() => validateUploadedFileName("../cases.csv")).toThrow(CsvValidationError);
  });
});
