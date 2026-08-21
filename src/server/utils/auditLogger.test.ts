import { vi } from "vitest";

import AuditLogger from "./auditLogger.js";
import { sanitiseForLogging } from "./sanitisation.js";

describe("AuditLogger", () => {
  it("logs pre-formatted messages for info/error calls", () => {
    const sut = new AuditLogger("proj");
    const reqLog = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Parameters<AuditLogger["info"]>[0];

    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG: hello"));
    sut.error(reqLog, sanitiseForLogging("AUDIT_LOG: boom"));

    expect(reqLog.info).toHaveBeenCalledWith({ auditLogMessage: "AUDIT_LOG: hello" }, "AUDIT_LOG");
    expect(reqLog.error).toHaveBeenCalledWith({ auditLogMessage: "AUDIT_LOG: boom" }, "AUDIT_LOG");
  });

  it("sanitises control characters from log messages", () => {
    const sut = new AuditLogger("proj");
    const reqLog = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Parameters<AuditLogger["info"]>[0];

    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG: message with\nnewline"));
    sut.error(reqLog, sanitiseForLogging("AUDIT_LOG: message with\rcarriage return"));
    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG: message with\ttab"));
    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG:   leading and trailing spaces  "));

    expect(reqLog.info).toHaveBeenNthCalledWith(
      1,
      { auditLogMessage: "AUDIT_LOG: message with newline" },
      "AUDIT_LOG",
    );
    expect(reqLog.error).toHaveBeenCalledWith(
      { auditLogMessage: "AUDIT_LOG: message with carriage return" },
      "AUDIT_LOG",
    );
    expect(reqLog.info).toHaveBeenNthCalledWith(
      2,
      { auditLogMessage: "AUDIT_LOG: message with tab" },
      "AUDIT_LOG",
    );
    expect(reqLog.info).toHaveBeenNthCalledWith(
      3,
      { auditLogMessage: "AUDIT_LOG: leading and trailing spaces" },
      "AUDIT_LOG",
    );
  });

  it("removes all C0 control characters and DEL to prevent log injection", () => {
    const sut = new AuditLogger("proj");
    const reqLog = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Parameters<AuditLogger["info"]>[0];

    // Test C0 control characters (\x00-\x1F)
    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG: alert\x07bell"));
    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG: backspace\x08text"));
    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG: vertical\x0Btab"));
    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG: form\x0Cfeed"));
    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG: shift\x0Eout"));
    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG: escape\x1Bsequence"));

    // Test DEL character (\x7F)
    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG: delete\x7Fchar"));

    // Verify all control chars are replaced with spaces and whitespace is normalised
    expect(reqLog.info).toHaveBeenNthCalledWith(
      1,
      { auditLogMessage: "AUDIT_LOG: alert bell" },
      "AUDIT_LOG",
    );
    expect(reqLog.info).toHaveBeenNthCalledWith(
      2,
      { auditLogMessage: "AUDIT_LOG: backspace text" },
      "AUDIT_LOG",
    );
    expect(reqLog.info).toHaveBeenNthCalledWith(
      3,
      { auditLogMessage: "AUDIT_LOG: vertical tab" },
      "AUDIT_LOG",
    );
    expect(reqLog.info).toHaveBeenNthCalledWith(
      4,
      { auditLogMessage: "AUDIT_LOG: form feed" },
      "AUDIT_LOG",
    );
    expect(reqLog.info).toHaveBeenNthCalledWith(
      5,
      { auditLogMessage: "AUDIT_LOG: shift out" },
      "AUDIT_LOG",
    );
    expect(reqLog.info).toHaveBeenNthCalledWith(
      6,
      { auditLogMessage: "AUDIT_LOG: escape sequence" },
      "AUDIT_LOG",
    );
    expect(reqLog.info).toHaveBeenNthCalledWith(
      7,
      { auditLogMessage: "AUDIT_LOG: delete char" },
      "AUDIT_LOG",
    );
  });

  it("normalises consecutive whitespace in log messages", () => {
    const sut = new AuditLogger("proj");
    const reqLog = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Parameters<AuditLogger["info"]>[0];

    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG: multiple   spaces"));
    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG: mixed\t\n  whitespace"));
    sut.info(reqLog, sanitiseForLogging("AUDIT_LOG:   \t  start and end  \n  "));

    expect(reqLog.info).toHaveBeenNthCalledWith(
      1,
      { auditLogMessage: "AUDIT_LOG: multiple spaces" },
      "AUDIT_LOG",
    );
    expect(reqLog.info).toHaveBeenNthCalledWith(
      2,
      { auditLogMessage: "AUDIT_LOG: mixed whitespace" },
      "AUDIT_LOG",
    );
    expect(reqLog.info).toHaveBeenNthCalledWith(
      3,
      { auditLogMessage: "AUDIT_LOG: start and end" },
      "AUDIT_LOG",
    );
  });
});
