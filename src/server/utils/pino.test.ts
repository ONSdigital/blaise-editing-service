/* @vitest-environment node */
import { vi } from "vitest";

type CapturedPinoOptions = {
  autoLogging?: boolean;
  quietReqLogger?: boolean;
  messageKey: string;
  formatters: {
    level: (label: string, number: number) => { severity: string; level: number };
    log: (info: Record<string, unknown>) => { info: Record<string, unknown> };
  };
  serializers: {
    req: (request: unknown) => { method?: string; url?: string; user?: unknown };
  };
};

describe("createLogger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("passes config to pino-http and maps severities", async () => {
    vi.resetModules();

    const mockPinoHttp = vi.fn((opts: CapturedPinoOptions) => ({ opts }));

    vi.doMock("pino-http", () => ({
      pinoHttp: mockPinoHttp,
    }));

    const createLogger = (await import("./pino.js")).default;

    createLogger({ autoLogging: false, quietReqLogger: true });

    expect(mockPinoHttp).toHaveBeenCalledTimes(1);
    const opts = mockPinoHttp.mock.calls[0][0];

    expect(opts).toMatchObject({
      autoLogging: false,
      quietReqLogger: true,
      messageKey: "message",
    });

    expect(opts.formatters.level("warn", 40)).toEqual({ severity: "WARNING", level: 40 });
    expect(opts.formatters.level("unknown", 30)).toEqual({ severity: "INFO", level: 30 });
    expect(opts.formatters.log({ foo: "bar" } as { foo: string })).toEqual({
      info: { foo: "bar" },
    });

    expect(opts.serializers.req({ method: "GET", url: "/x", raw: { user: "me" } })).toEqual({
      method: "GET",
      url: "/x",
      user: "me",
    });
  });
});
