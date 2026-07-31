/* @vitest-environment node */
import { vi } from "vitest";

describe("server entrypoint", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("loads env, creates config, builds server and listens", async () => {
        vi.resetModules();

        const dotenvConfigMock = vi.fn();
        const listenMock = vi.fn((_port: number, cb?: () => void) => cb?.());
        const serverMock = {
            listen: listenMock,
        };
        const nodeServerMock = vi.fn(() => serverMock);
        const configInstance = { Port: 5678 };
        const configProviderMock = vi.fn().mockImplementation(function (this: any) {
            return configInstance;
        });

        const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        vi.doMock("dotenv", () => ({
            default: {
                config: dotenvConfigMock,
            },
        }));
        vi.doMock("../../server/server", () => ({
            default: nodeServerMock,
        }));
        vi.doMock("../../server/configuration/ServerConfigurationProvider", () => ({
            default: configProviderMock,
        }));

        await import("../../server/index");

        expect(dotenvConfigMock).toHaveBeenCalledTimes(1);
        expect(configProviderMock).toHaveBeenCalledTimes(1);
        expect(nodeServerMock).toHaveBeenCalledWith(configInstance);
        expect(listenMock).toHaveBeenCalledWith(configInstance.Port, expect.any(Function));
        expect(consoleSpy).toHaveBeenCalledWith(`Blaise Editing Service running on port ${configInstance.Port}`);
    });
});
