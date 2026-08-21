import { vi } from "vitest";

describe("server entrypoint", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads env, creates config, builds server and listens", async () => {
    vi.resetModules();

    const mockDotenvConfig = vi.fn();
    const mockOn = vi.fn();
    const mockListen = vi.fn((_port: number, cb?: () => void) => {
      cb?.();

      return { on: mockOn };
    });
    const mockServer = {
      listen: mockListen,
    };
    const mockNodeServer = vi.fn(() => mockServer);
    const configInstance = { Port: 5678 };
    const mockConfigProvider = vi.fn().mockImplementation(function MockConfigProvider() {
      return configInstance;
    });

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    vi.doMock("dotenv", () => ({
      default: {
        config: mockDotenvConfig,
      },
    }));
    vi.doMock("./server.js", () => ({
      default: mockNodeServer,
    }));
    vi.doMock("./utils/serverConfigurationProvider.js", () => ({
      default: mockConfigProvider,
    }));

    await import("./index.js");

    expect(mockDotenvConfig).toHaveBeenCalledTimes(1);
    expect(mockConfigProvider).toHaveBeenCalledTimes(1);
    expect(mockNodeServer).toHaveBeenCalledWith(configInstance);
    expect(mockListen).toHaveBeenCalledWith(configInstance.Port, expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith("error", expect.any(Function));
    expect(consoleSpy).toHaveBeenCalledWith(
      `Blaise Editing Service running on port ${configInstance.Port}`,
    );
  });

  it("logs and exits when startup fails", async () => {
    vi.resetModules();

    const startupError = new Error("Unable to start");
    const mockDotenvConfig = vi.fn();
    const mockOn = vi.fn((eventName: string, cb: (error: Error) => void) => {
      if (eventName === "error") {
        cb(startupError);
      }

      return { on: mockOn };
    });
    const mockListen = vi.fn(() => ({ on: mockOn }));
    const mockServer = {
      listen: mockListen,
    };
    const mockNodeServer = vi.fn(() => mockServer);
    const configInstance = { Port: 9001 };
    const mockConfigProvider = vi.fn().mockImplementation(function MockConfigProvider() {
      return configInstance;
    });

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const processExitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

    vi.doMock("dotenv", () => ({
      default: {
        config: mockDotenvConfig,
      },
    }));
    vi.doMock("./server.js", () => ({
      default: mockNodeServer,
    }));
    vi.doMock("./utils/serverConfigurationProvider.js", () => ({
      default: mockConfigProvider,
    }));

    await import("./index.js");

    expect(mockListen).toHaveBeenCalledWith(configInstance.Port, expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith("error", expect.any(Function));
    expect(consoleErrorSpy).toHaveBeenCalledWith(startupError, "Failed to start server");
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
