/* @vitest-environment node */
import fs from "fs";
import path from "path";

import { type Auth } from "blaise-login-react-server";
import supertest from "supertest";
import { Mock } from "typemoq";
import { vi } from "vitest";

import NodeServer from "./server.js";
import FakeServerConfigurationProvider from "./test-utils/fakeServerConfigurationProvider.mock.js";
import BlaiseApi from "./utils/blaiseApi.js";

import type { Request } from "express";
import type { IMock } from "typemoq";

const configFake = new FakeServerConfigurationProvider();

const mockBlaiseApi: IMock<BlaiseApi> = Mock.ofType(BlaiseApi);

const server = NodeServer(configFake, undefined, { blaiseApi: mockBlaiseApi.object });

function createRequest(pathValue: string, forwardedHeader?: string, ip = "127.0.0.1"): Request {
  return {
    path: pathValue,
    ip,
    header: (name: string) => (name.toLowerCase() === "forwarded" ? forwardedHeader : undefined),
  } as unknown as Request;
}

async function buildServerWithMockedRateLimit(auth?: Auth) {
  vi.resetModules();

  type RateLimitOptions = {
    skip: (request: Request) => boolean;
    keyGenerator: (request: Request) => string;
  };

  const mockRateLimit = vi.fn(
    (_options: RateLimitOptions) => (_req: unknown, _res: unknown, next: () => void) => next(),
  );

  vi.doMock("express-rate-limit", () => ({
    rateLimit: mockRateLimit,
  }));

  const { default: nodeServer } = await import("./server.js");

  nodeServer(configFake, undefined as unknown as never, {
    blaiseApi: mockBlaiseApi.object,
    ...(auth != null ? { auth } : {}),
  });

  return mockRateLimit;
}

describe("Core routes", () => {
  it("returns healthy status for health endpoint", async () => {
    const sut = supertest(server);

    const result = await sut.get("/bes-ui/v1/health");

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({ healthy: true });
  });

  it("returns 404 json for unknown api endpoint", async () => {
    const sut = supertest(server);

    const result = await sut.get("/api/unknown-endpoint");

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Resource not found",
      },
    });
  });
});

describe("Render react pages as default route", () => {
  it("should render the home page", async () => {
    const sut = supertest(server);

    const result = await sut.get("/");

    expect(result.error).toBeFalsy();
    expect(result.statusCode).toEqual(200);
    expect(result.type).toEqual("text/html");
    expect(result.text).toContain('<div id="root"></div>');
    expect(result.text).toContain(`"projectId":"${configFake.ProjectId}"`);
    expect(result.text).toContain(`"urlDomain":"${configFake.UrlDomain}"`);
    expect(result.text).not.toContain(
      "<%- typeof appConfigJson === 'string' ? appConfigJson : '' %>",
    );
  });
});

describe("500 Error Handling Middleware", () => {
  it("ships a server 500 error page template", () => {
    const errorPagePath = path.resolve(process.cwd(), "src/server/views/500.html");
    const errorPage = fs.readFileSync(errorPagePath, "utf-8");

    expect(errorPage).toContain("Server Error (500)");
    expect(errorPage).toContain("Return to home");
  });
});

describe("server rate limiting configuration", () => {
  afterEach(() => {
    vi.doUnmock("express-rate-limit");
    vi.resetModules();
  });

  it("registers page and api rate limiters with route-aware skip logic", async () => {
    const mockRateLimit = await buildServerWithMockedRateLimit();

    expect(mockRateLimit).toHaveBeenCalledTimes(2);

    const pageOptions = mockRateLimit.mock.calls[0][0] as {
      skip: (request: Request) => boolean;
    };
    const apiOptions = mockRateLimit.mock.calls[1][0] as {
      skip: (request: Request) => boolean;
    };

    expect(pageOptions.skip(createRequest("/api/surveys"))).toBe(true);
    expect(pageOptions.skip(createRequest("/"))).toBe(false);
    expect(apiOptions.skip(createRequest("/api/surveys"))).toBe(false);
    expect(apiOptions.skip(createRequest("/"))).toBe(true);
  });

  it("uses request ip for page limiter key", async () => {
    const mockRateLimit = await buildServerWithMockedRateLimit();

    const pageOptions = mockRateLimit.mock.calls[0][0] as {
      keyGenerator: (request: Request) => string;
    };

    const key = pageOptions.keyGenerator(createRequest("/", 'for="203.0.113.9:1234"', "10.0.0.1"));

    expect(key).toBe("ip:10.0.0.1");
  });

  it("uses authenticated username for api limiter key and falls back to ip when unavailable", async () => {
    const mockAuth = {
      getToken: vi.fn(() => "token"),
      getUser: vi.fn(() => ({ name: "Editor.User" })),
      middleware: (_req: unknown, _res: unknown, next: () => void) => next(),
    } as unknown as Auth;

    const mockRateLimit = await buildServerWithMockedRateLimit(mockAuth);

    const apiOptions = mockRateLimit.mock.calls[1][0] as {
      keyGenerator: (request: Request) => string;
    };

    const userKey = apiOptions.keyGenerator(createRequest("/api/surveys", undefined, "10.0.0.1"));

    expect(userKey).toBe("user:editor.user");

    mockAuth.getToken = vi.fn(() => {
      throw new Error("no token");
    }) as unknown as Auth["getToken"];

    const fallbackKey = apiOptions.keyGenerator(
      createRequest("/api/surveys", "for=198.51.100.7", "10.0.0.1"),
    );

    expect(fallbackKey).toBe("ip:10.0.0.1");
  });
});
