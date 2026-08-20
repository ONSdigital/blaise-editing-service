import { vi } from "vitest";

import AuditLogger from "./auditLogger.js";

describe("AuditLogger", () => {
  it("prefixes messages for info/error calls", () => {
    const sut = new AuditLogger("proj");
    const reqLog = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Parameters<AuditLogger["info"]>[0];

    sut.info(reqLog, "hello");
    sut.error(reqLog, "boom");

    expect(reqLog.info).toHaveBeenCalledWith("AUDIT_LOG: hello");
    expect(reqLog.error).toHaveBeenCalledWith("AUDIT_LOG: boom");
  });

  it("sanitises control characters from log messages", () => {
    const sut = new AuditLogger("proj");
    const reqLog = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Parameters<AuditLogger["info"]>[0];

    sut.info(reqLog, "message with\nnewline");
    sut.error(reqLog, "message with\rcarriage return");
    sut.info(reqLog, "message with\ttab");
    sut.info(reqLog, "  leading and trailing spaces  ");

    expect(reqLog.info).toHaveBeenNthCalledWith(1, "AUDIT_LOG: message with newline");
    expect(reqLog.error).toHaveBeenCalledWith("AUDIT_LOG: message with carriage return");
    expect(reqLog.info).toHaveBeenNthCalledWith(2, "AUDIT_LOG: message with tab");
    expect(reqLog.info).toHaveBeenNthCalledWith(3, "AUDIT_LOG: leading and trailing spaces");
  });
});
