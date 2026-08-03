import axios from "axios";
import { vi } from "vitest";

import { sendClientLog } from "./clientLog";

vi.mock("./api/AxiosApi", () => ({
    default: () => ({
        headers: { "X-Test": "1" },
    }),
}));

describe("sendClientLog", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));

        window.history.pushState({}, "", "/unit-test?page=1");
        Object.defineProperty(navigator, "userAgent", {
            value: "unit-test-agent",
            configurable: true,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it("posts a structured payload including stack when an Error is present", async () => {
        const postSpy = vi.spyOn(axios, "post").mockResolvedValue({} as any);

        const err = new Error("boom");
        err.stack = "STACK_TRACE";

        await sendClientLog("error", { hello: "world" }, err, 123);

        expect(postSpy).toHaveBeenCalledTimes(1);
        const [url, payload, config] = postSpy.mock.calls[0];

        expect(url).toBe("/api/client-log");
        expect(config).toEqual({ headers: { "X-Test": "1" } });

        expect(payload).toMatchObject({
            level: "error",
            message: JSON.stringify({ hello: "world" }),
            timestamp: "2025-01-01T00:00:00.000Z",
            pathname: "/unit-test",
            userAgent: "unit-test-agent",
            stack: "STACK_TRACE",
        });

        expect(payload.href).toContain("/unit-test?page=1");
        expect(payload.args).toEqual(["STACK_TRACE", "123"]);
    });

    it("handles circular values by falling back to String(value)", async () => {
        const postSpy = vi.spyOn(axios, "post").mockResolvedValue({} as any);

        const circular: any = { name: "c" };
        circular.self = circular;

        await sendClientLog("info", circular);

        expect(postSpy).toHaveBeenCalledTimes(1);
        const [, payload] = postSpy.mock.calls[0];
        expect(payload.message).toBe("[object Object]");
    });

    it("swallows axios errors", async () => {
        vi.spyOn(axios, "post").mockRejectedValue(new Error("network"));

        await expect(sendClientLog("warn", "hello")).resolves.toBeUndefined();
    });
});
