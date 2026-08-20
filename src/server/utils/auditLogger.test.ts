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
});
