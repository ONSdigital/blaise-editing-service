import { vi } from "vitest";

vi.mock("../../client/clientLog", () => ({
    sendClientLog: vi.fn().mockResolvedValue(undefined),
}));

import { sendClientLog } from "../../client/clientLog";
import { clientLogger } from "../../client/logger";

describe("clientLogger", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("forwards to sendClientLog with correct levels", () => {
        clientLogger.debug("d");
        clientLogger.info("i", 1);
        clientLogger.warn("w", { x: 1 });
        clientLogger.error("e", new Error("boom"));

        expect(sendClientLog).toHaveBeenCalledWith("debug", "d");
        expect(sendClientLog).toHaveBeenCalledWith("info", "i", 1);
        expect(sendClientLog).toHaveBeenCalledWith("warn", "w", { x: 1 });
        expect(sendClientLog).toHaveBeenCalledWith("error", "e", expect.any(Error));
    });
});
