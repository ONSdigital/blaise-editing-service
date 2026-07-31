/* @vitest-environment node */
import { vi } from "vitest";

describe("createLogger", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("passes config to pino-http and maps severities", async () => {
        vi.resetModules();

        const pinoHttpMock = vi.fn((opts: any) => ({ opts }));
        vi.doMock("pino-http", () => ({
            default: pinoHttpMock,
        }));

        const createLogger = (await import("./pino")).default;
        createLogger({ autoLogging: false, customOpt: true });

        expect(pinoHttpMock).toHaveBeenCalledTimes(1);
        const opts = pinoHttpMock.mock.calls[0][0];

        expect(opts).toMatchObject({
            autoLogging: false,
            customOpt: true,
            messageKey: "message",
        });

        expect(opts.formatters.level("warn", 40)).toEqual({ severity: "WARNING", level: 40 });
        expect(opts.formatters.level("unknown", 30)).toEqual({ severity: "INFO", level: 30 });
        expect(opts.formatters.log({ foo: "bar" } as any)).toEqual({ info: { foo: "bar" } });

        expect(opts.serializers.req({ method: "GET", url: "/x", raw: { user: "me" } })).toEqual({
            method: "GET",
            url: "/x",
            user: "me",
        });
    });
});
