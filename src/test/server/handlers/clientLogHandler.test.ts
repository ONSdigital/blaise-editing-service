/* @vitest-environment node */
import express from "express";
import supertest from "supertest";
import { vi } from "vitest";

import clientLogHandler from "../../../server/handlers/clientLogHandler";

function createTestApp() {
    const app = express();
    app.use(express.json());

    const requestLog = {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
    };

    app.use((req, _res, next) => {
        (req as any).log = requestLog;
        next();
    });

    const auth = {
        Middleware: (_req: any, _res: any, next: any) => next(),
    } as any;

    app.use(clientLogHandler(auth));

    return { app, requestLog };
}

describe("clientLogHandler", () => {
    it("returns 400 when level is missing", async () => {
        const { app, requestLog } = createTestApp();
        const sut = supertest(app);

        const result = await sut.post("/api/client-log").send({ message: "hello" });

        expect(result.status).toBe(400);
        expect(result.body).toEqual({ error: "Missing level" });
        expect(requestLog.info).not.toHaveBeenCalled();
        expect(requestLog.warn).not.toHaveBeenCalled();
        expect(requestLog.error).not.toHaveBeenCalled();
        expect(requestLog.debug).not.toHaveBeenCalled();
    });

    it("returns 400 when level is invalid", async () => {
        const { app } = createTestApp();
        const sut = supertest(app);

        const result = await sut.post("/api/client-log").send({ level: "nope", message: "hello" });

        expect(result.status).toBe(400);
        expect(result.body).toEqual({ error: "Invalid level" });
    });

    it("returns 400 when message is missing", async () => {
        const { app } = createTestApp();
        const sut = supertest(app);

        const result = await sut.post("/api/client-log").send({ level: "info" });

        expect(result.status).toBe(400);
        expect(result.body).toEqual({ error: "Missing message" });
    });

    it("normalises 'log' to info, clamps values, and emits a 204", async () => {
        const { app, requestLog } = createTestApp();
        const sut = supertest(app);

        const longMessage = "m".repeat(2500);
        const args = Array.from({ length: 25 }, (_, i) => (i === 0 ? "x".repeat(1100) : `a${i}`));

        const result = await sut
            .post("/api/client-log")
            .set("user-agent", "test-agent")
            .send({
                level: "log",
                message: longMessage,
                args,
                pathname: "/some/" + "p".repeat(600),
                href: "https://example.com/" + "h".repeat(1500),
            });

        expect(result.status).toBe(204);

        expect(requestLog.info).toHaveBeenCalledTimes(1);
        const [loggedObj, loggedMsg] = requestLog.info.mock.calls[0];

        expect(loggedMsg).toBe(`CLIENT_LOG: ${"m".repeat(2000)}`);
        expect(loggedObj.clientLog.level).toBe("log");
        expect(loggedObj.clientLog.message).toBe("m".repeat(2000));
        expect(loggedObj.clientLog.userAgent).toBe("test-agent");

        expect(loggedObj.clientLog.args).toHaveLength(20);
        expect(loggedObj.clientLog.args[0]).toBe("x".repeat(1000));

        expect(loggedObj.clientLog.pathname).toHaveLength(500);
        expect(loggedObj.clientLog.href).toHaveLength(1000);
    });

    it.each([
        ["warn", "warn"],
        ["error", "error"],
        ["debug", "debug"],
    ] as const)("logs using req.log.%s for level=%s", async (inputLevel, expectedMethod) => {
        const { app, requestLog } = createTestApp();
        const sut = supertest(app);

        const result = await sut.post("/api/client-log").send({ level: inputLevel, message: "hello" });

        expect(result.status).toBe(204);
        expect((requestLog as any)[expectedMethod]).toHaveBeenCalledTimes(1);
    });
});
