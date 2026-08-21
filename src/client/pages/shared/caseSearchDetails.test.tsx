import { render, screen, waitFor } from "@testing-library/react";

import { mockCaseAllocatedToRich } from "../../../server/test-utils/case.mock";
import { getCaseSearchResults } from "../../api/nodeApi";
import UserRole from "../../types/user.types";

import CaseSearchDetails from "./caseSearchDetails";

vi.mock("../../api/nodeApi", () => ({
  getCaseSearchResults: vi.fn(),
}));

vi.mock("./caseSearchLinks", () => ({
  default: ({
    questionnaireName,
    caseDetails,
    role,
  }: {
    questionnaireName: string;
    caseDetails: { primaryKey: string };
    role: UserRole;
  }) => (
    <span data-testid="case-search-links">{`${questionnaireName}:${caseDetails.primaryKey}:${role}`}</span>
  ),
}));

const mockGetCaseSearchResults = vi.mocked(getCaseSearchResults);

describe("CaseSearchDetails", () => {
  const questionnaireName = "FRS2504A_EDIT";
  const role = UserRole.SVT_Supervisor;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("requests case results and renders a table when matches exist", async () => {
    mockGetCaseSearchResults.mockResolvedValue([mockCaseAllocatedToRich]);

    render(
      <CaseSearchDetails
        questionnaireName={questionnaireName}
        caseId="10001011"
        role={role}
      />,
    );

    await waitFor(() => {
      expect(mockGetCaseSearchResults).toHaveBeenCalledWith(questionnaireName, "10001011", role);
    });

    expect(await screen.findByLabelText(`${questionnaireName}-CaseID`)).toHaveTextContent(
      mockCaseAllocatedToRich.primaryKey,
    );
    expect(screen.getByLabelText(`${questionnaireName}-Outcome`)).toHaveTextContent(
      String(mockCaseAllocatedToRich.outcome),
    );
    expect(screen.getByLabelText(`${questionnaireName}-Interviewer`)).toHaveTextContent(
      mockCaseAllocatedToRich.interviewer,
    );
    expect(screen.getByLabelText(`${questionnaireName}-Organisation`)).toHaveTextContent(
      String(mockCaseAllocatedToRich.organisation),
    );
    expect(screen.getByTestId("case-search-links")).toHaveTextContent(
      `${questionnaireName}:${mockCaseAllocatedToRich.primaryKey}:${role}`,
    );
  });

  it("shows an info panel when no matching cases are found", async () => {
    mockGetCaseSearchResults.mockResolvedValue([]);

    render(
      <CaseSearchDetails
        questionnaireName={questionnaireName}
        caseId="no-match"
        role={role}
      />,
    );

    expect(await screen.findByText("No results found for this case ID.")).toBeInTheDocument();
  });

  it("shows an error panel when the case search request fails", async () => {
    mockGetCaseSearchResults.mockRejectedValue(new Error("Case search failed"));

    render(
      <CaseSearchDetails
        questionnaireName={questionnaireName}
        caseId="error"
        role={role}
      />,
    );

    expect(await screen.findByTestId("ErrorMessage")).toHaveTextContent("Case search failed");
  });
});
