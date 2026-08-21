import { beforeEach, describe, expect, it, vi } from "vitest";

const { createRootSpy, renderSpy, reportWebVitalsSpy } = vi.hoisted(() => {
  const renderSpy = vi.fn();

  return {
    createRootSpy: vi.fn(() => ({ render: renderSpy })),
    renderSpy,
    reportWebVitalsSpy: vi.fn(),
  };
});

vi.mock("react-dom/client", () => ({
  createRoot: createRootSpy,
  default: {
    createRoot: createRootSpy,
  },
}));

vi.mock("./utils/reportWebVitals", () => ({
  default: reportWebVitalsSpy,
}));

vi.mock("./app", () => ({
  default: function MockApp() {
    return null;
  },
}));

describe("client entrypoint", () => {
  beforeEach(() => {
    vi.resetModules();
    createRootSpy.mockClear();
    renderSpy.mockClear();
    reportWebVitalsSpy.mockClear();
    document.body.innerHTML = '<div id="root"></div>';
  });

  it("creates the root, renders app, and reports web vitals", async () => {
    await import("./index");

    expect(createRootSpy).toHaveBeenCalledWith(document.getElementById("root"));
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(reportWebVitalsSpy).toHaveBeenCalledTimes(1);
  });
});
