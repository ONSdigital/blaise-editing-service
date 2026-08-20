import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

import reportWebVitals from "./reportWebVitals";

vi.mock("web-vitals", () => ({
  onCLS: vi.fn(),
  onFCP: vi.fn(),
  onINP: vi.fn(),
  onLCP: vi.fn(),
  onTTFB: vi.fn(),
}));

const mockOnCLS = vi.mocked(onCLS);
const mockOnFCP = vi.mocked(onFCP);
const mockOnINP = vi.mocked(onINP);
const mockOnLCP = vi.mocked(onLCP);
const mockOnTTFB = vi.mocked(onTTFB);

describe("reportWebVitals", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("registers all web-vitals callbacks when a handler is provided", () => {
    const onPerfEntry = vi.fn();

    reportWebVitals(onPerfEntry);

    expect(mockOnCLS).toHaveBeenCalledWith(onPerfEntry);
    expect(mockOnFCP).toHaveBeenCalledWith(onPerfEntry);
    expect(mockOnINP).toHaveBeenCalledWith(onPerfEntry);
    expect(mockOnLCP).toHaveBeenCalledWith(onPerfEntry);
    expect(mockOnTTFB).toHaveBeenCalledWith(onPerfEntry);
  });

  it("does not register web-vitals callbacks when no handler is provided", () => {
    reportWebVitals();

    expect(mockOnCLS).not.toHaveBeenCalled();
    expect(mockOnFCP).not.toHaveBeenCalled();
    expect(mockOnINP).not.toHaveBeenCalled();
    expect(mockOnLCP).not.toHaveBeenCalled();
    expect(mockOnTTFB).not.toHaveBeenCalled();
  });
});
