import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";

import { mockCaseSummaryDetails } from "../../../server/test-utils/case.mock";
import { getCaseSummary } from "../../api/nodeApi";
import toCaseSummaryText from "../../utils/caseSummaryTextMapper";
import { clientLogger } from "../../utils/logger";

import { DownloadCaseSummaryLink, type Props } from "./downloadCaseSummaryLink";

vi.mock("../../api/nodeApi", () => ({
  getCaseSummary: vi.fn(),
}));

vi.mock("../../utils/caseSummaryTextMapper", () => ({ default: vi.fn() }));

vi.mock("../../utils/logger", () => ({
  clientLogger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));
const mockGetCaseSummary = vi.mocked(getCaseSummary);
const mockMapCaseSummaryText = vi.mocked(toCaseSummaryText);

describe("Given a user needs to download a case summary", () => {
  const defaultProps: Props = {
    caseId: "12345",
    questionnaireName: "FRS1337",
  };

  let mockLinkClick: ReturnType<typeof vi.spyOn>;
  let mockCreateObjectURL: ReturnType<typeof vi.spyOn>;
  let mockRevokeObjectURL: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();

    if (!("createObjectURL" in URL)) {
      Object.defineProperty(URL, "createObjectURL", {
        value: () => "",
        configurable: true,
      });
    }

    if (!("revokeObjectURL" in URL)) {
      Object.defineProperty(URL, "revokeObjectURL", {
        value: () => {},
        configurable: true,
      });
    }

    mockLinkClick = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    mockCreateObjectURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    mockRevokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockFileContent = "Case ID: 12345\nStatus: Completed";

  it("renders correctly with default props", () => {
    render(
      <DownloadCaseSummaryLink
        caseId={defaultProps.caseId}
        questionnaireName={defaultProps.questionnaireName}
      />,
    );

    const linkElement = screen.getByRole("link", { name: "Download case summary" });

    expect(linkElement).toBeInTheDocument();
  });

  it("handles successful download on click", async () => {
    mockGetCaseSummary.mockResolvedValue(mockCaseSummaryDetails);
    mockMapCaseSummaryText.mockReturnValue(mockFileContent);

    render(
      <DownloadCaseSummaryLink
        caseId={defaultProps.caseId}
        questionnaireName={defaultProps.questionnaireName}
      />,
    );
    const linkElement = screen.getByRole("link", { name: "Download case summary" });

    fireEvent.click(linkElement);

    expect(screen.getByText("Downloading...")).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("aria-disabled", "true");

    await waitFor(() => {
      expect(mockGetCaseSummary).toHaveBeenCalledWith(
        defaultProps.questionnaireName,
        defaultProps.caseId,
      );
    });

    expect(mockMapCaseSummaryText).toHaveBeenCalledWith(mockCaseSummaryDetails);
    expect(mockCreateObjectURL).toHaveBeenCalledOnce();
    expect(mockLinkClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    await waitFor(() => expect(screen.getByText("Download case summary")).toBeInTheDocument());
    expect(linkElement).toHaveAttribute("aria-disabled", "false");
  });

  it("handles successful download on Enter key press", async () => {
    mockGetCaseSummary.mockResolvedValue(mockCaseSummaryDetails);
    mockMapCaseSummaryText.mockReturnValue(mockFileContent);
    render(
      <DownloadCaseSummaryLink
        caseId={defaultProps.caseId}
        questionnaireName={defaultProps.questionnaireName}
      />,
    );
    const linkElement = screen.getByRole("link", { name: "Download case summary" });

    fireEvent.keyDown(linkElement, { key: "Enter", code: "Enter" });

    expect(screen.getByText("Downloading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetCaseSummary).toHaveBeenCalledWith(
        defaultProps.questionnaireName,
        defaultProps.caseId,
      );
    });
    expect(mockLinkClick).toHaveBeenCalled();

    await waitFor(() => expect(screen.getByText("Download case summary")).toBeInTheDocument());
  });

  it("handles failed download and calls onError callback", async () => {
    const errorMessage = "Failed download";

    mockGetCaseSummary.mockRejectedValue(new Error(errorMessage));
    const mockOnError = vi.fn();
    const propsWithOnError = { ...defaultProps, onError: mockOnError };

    render(
      <DownloadCaseSummaryLink
        caseId={propsWithOnError.caseId}
        questionnaireName={propsWithOnError.questionnaireName}
        onError={propsWithOnError.onError}
      />,
    );
    const linkElement = screen.getByRole("link", { name: "Download case summary" });

    fireEvent.click(linkElement);

    expect(screen.getByText("Downloading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetCaseSummary).toHaveBeenCalledWith(
        defaultProps.questionnaireName,
        defaultProps.caseId,
      );
    });
    expect(mockOnError).toHaveBeenCalledWith(
      "Failed to download case summary. Please try again later or contact support for assistance.",
    );

    expect(clientLogger.error).toHaveBeenCalledWith(
      `Failed to export summary for caseId: ${defaultProps.caseId}:`,
      expect.any(Error),
    );
    await waitFor(() => expect(screen.getByText("Download case summary")).toBeInTheDocument());
    expect(linkElement).toHaveAttribute("aria-disabled", "false");
  });

  it("does not trigger download if already downloading", async () => {
    mockGetCaseSummary.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockCaseSummaryDetails), 50);
        }),
    );
    mockMapCaseSummaryText.mockReturnValue(mockFileContent);

    render(
      <DownloadCaseSummaryLink
        caseId={defaultProps.caseId}
        questionnaireName={defaultProps.questionnaireName}
      />,
    );
    const linkElement = screen.getByRole("link", { name: "Download case summary" });

    fireEvent.click(linkElement);
    expect(screen.getByText("Downloading...")).toBeInTheDocument();
    fireEvent.click(linkElement);

    await waitFor(() => {
      expect(mockGetCaseSummary).toHaveBeenCalledTimes(1);
      expect(mockLinkClick).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => expect(screen.getByText("Download case summary")).toBeInTheDocument());
  });
});
