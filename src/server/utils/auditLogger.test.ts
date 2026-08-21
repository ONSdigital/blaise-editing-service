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

    expect(reqLog.info).toHaveBeenCalledWith("AUDIT_LOG: hello");
    expect(reqLog.error).toHaveBeenCalledWith("AUDIT_LOG: boom");
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

    expect(reqLog.info).toHaveBeenNthCalledWith(1, "AUDIT_LOG: message with newline");
    expect(reqLog.error).toHaveBeenCalledWith("AUDIT_LOG: message with carriage return");
    expect(reqLog.info).toHaveBeenNthCalledWith(2, "AUDIT_LOG: message with tab");
    expect(reqLog.info).toHaveBeenNthCalledWith(3, "AUDIT_LOG: leading and trailing spaces");
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
    expect(reqLog.info).toHaveBeenNthCalledWith(1, "AUDIT_LOG: alert bell");
    expect(reqLog.info).toHaveBeenNthCalledWith(2, "AUDIT_LOG: backspace text");
    expect(reqLog.info).toHaveBeenNthCalledWith(3, "AUDIT_LOG: vertical tab");
    expect(reqLog.info).toHaveBeenNthCalledWith(4, "AUDIT_LOG: form feed");
    expect(reqLog.info).toHaveBeenNthCalledWith(5, "AUDIT_LOG: shift out");
    expect(reqLog.info).toHaveBeenNthCalledWith(6, "AUDIT_LOG: escape sequence");
    expect(reqLog.info).toHaveBeenNthCalledWith(7, "AUDIT_LOG: delete char");
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

    expect(reqLog.info).toHaveBeenNthCalledWith(1, "AUDIT_LOG: multiple spaces");
    expect(reqLog.info).toHaveBeenNthCalledWith(2, "AUDIT_LOG: mixed whitespace");
    expect(reqLog.info).toHaveBeenNthCalledWith(3, "AUDIT_LOG: start and end");
  });
});
