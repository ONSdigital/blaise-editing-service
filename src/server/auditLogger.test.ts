/* @vitest-environment node */
import { vi } from "vitest";

const gcpLoggingMocks = vi.hoisted(() => {
    const getEntriesMock = vi.fn();
    const logMock = vi.fn(() => ({
        getEntries: getEntriesMock,
    }));
    const LoggingMock = vi.fn().mockImplementation(function () {
        return {
            log: logMock,
        };
    });

    return { getEntriesMock, logMock, LoggingMock };
});

vi.mock("@google-cloud/logging", () => ({
    Logging: gcpLoggingMocks.LoggingMock,
}));

import AuditLogger from "./auditLogger";

describe("AuditLogger", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

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

    it("fetches and maps audit logs from google logging", async () => {
        const now = new Date("2025-02-02T03:04:05.000Z");
        gcpLoggingMocks.getEntriesMock.mockResolvedValue([
            [
                {
                    metadata: {
                        insertId: "abc",
                        timestamp: now,
                        severity: "ERROR",
                    },
                    data: {
                        message: "AUDIT_LOG: first",
                    },
                },
                {
                    metadata: {},
                    data: {
                        message: "AUDIT_LOG: second",
                    },
                },
            ],
        ]);

        const sut = new AuditLogger("proj");
        const logs = await sut.getLogs();

        expect(gcpLoggingMocks.LoggingMock).toHaveBeenCalledWith({ projectId: "proj" });
        expect(gcpLoggingMocks.logMock).toHaveBeenCalledWith("projects/proj/logs/stdout");
        expect(gcpLoggingMocks.getEntriesMock).toHaveBeenCalledWith(
            expect.objectContaining({
                maxResults: 50,
                filter: expect.stringContaining("^AUDIT_LOG: "),
            }),
        );

        expect(logs).toEqual([
            {
                id: "abc",
                timestamp: now.toString(),
                message: "first",
                severity: "ERROR",
            },
            {
                id: "",
                timestamp: "",
                message: "second",
                severity: "INFO",
            },
        ]);
    });
});
