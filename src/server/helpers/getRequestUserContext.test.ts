import { type Auth } from "blaise-login-react-server";

import getRequestUserContext from "./getRequestUserContext.js";

import type { Request } from "express";

describe("getRequestUserContext", () => {
  const request = {} as Request;

  it("returns sanitised values when auth user context is available", () => {
    const auth = {
      getToken: vi.fn().mockReturnValue("token"),
      getUser: vi.fn().mockReturnValue({
        name: "  Test\nUser\t",
        role: "  SVT Editor\r\n",
      }),
    } as unknown as Auth;

    const userContext = getRequestUserContext(request, auth);

    expect(userContext).toEqual({
      username: "Test User",
      role: "SVT Editor",
    });
  });

  it("returns fallback values when auth user context is missing", () => {
    const auth = {
      getToken: vi.fn().mockReturnValue("token"),
      getUser: vi.fn().mockReturnValue(undefined),
    } as unknown as Auth;

    const userContext = getRequestUserContext(request, auth);

    expect(userContext).toEqual({
      username: "Unknown User",
      role: "Unknown Role",
    });
  });

  it("returns fallback values when auth token lookup throws", () => {
    const auth = {
      getToken: vi.fn().mockImplementation(() => {
        throw new Error("token lookup failed");
      }),
      getUser: vi.fn(),
    } as unknown as Auth;

    const userContext = getRequestUserContext(request, auth);

    expect(userContext).toEqual({
      username: "Unknown User",
      role: "Unknown Role",
    });
  });
});
