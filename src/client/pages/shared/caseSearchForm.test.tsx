import { fireEvent, render, screen } from "@testing-library/react";

import UserRole from "../../types/user.types";

import CaseSearchForm from "./caseSearchForm";

vi.mock("./caseSearchDetails", () => ({
  default: ({
    questionnaireName,
    caseId,
    role,
  }: {
    questionnaireName: string;
    caseId: string;
    role: UserRole;
  }) => <div data-testid="case-search-details">{`${questionnaireName}|${caseId}|${role}`}</div>,
}));

describe("CaseSearchForm", () => {
  const questionnaireName = "FRS2504A_EDIT";
  const role = UserRole.SVT_Supervisor;

  it("renders a disabled search button with spacing below the input", () => {
    render(
      <CaseSearchForm
        questionnaireName={questionnaireName}
        userRole={role}
      />,
    );

    const searchButton = screen.getByRole("button", { name: "Search" });

    expect(searchButton).toBeDisabled();
    expect(searchButton.parentElement).toHaveClass("ons-u-mt-s");
  });

  it("keeps typed text visible and enables search for non-whitespace values", () => {
    render(
      <CaseSearchForm
        questionnaireName={questionnaireName}
        userRole={role}
      />,
    );

    const input = screen.getByTestId("caseid-input");
    const searchButton = screen.getByRole("button", { name: "Search" });

    fireEvent.change(input, { target: { value: "9002" } });

    expect(input).toHaveValue("9002");
    expect(searchButton).not.toBeDisabled();
  });

  it("keeps search disabled when only whitespace is entered", () => {
    render(
      <CaseSearchForm
        questionnaireName={questionnaireName}
        userRole={role}
      />,
    );

    const input = screen.getByTestId("caseid-input");
    const searchButton = screen.getByRole("button", { name: "Search" });

    fireEvent.change(input, { target: { value: "   " } });

    expect(input).toHaveValue("   ");
    expect(searchButton).toBeDisabled();
  });

  it("renders case search details using the submitted case ID", async () => {
    render(
      <CaseSearchForm
        questionnaireName={questionnaireName}
        userRole={role}
      />,
    );

    const input = screen.getByTestId("caseid-input");
    const searchButton = screen.getByRole("button", { name: "Search" });

    expect(screen.queryByTestId("case-search-details")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "10001011" } });
    fireEvent.click(searchButton);

    const details = await screen.findByTestId("case-search-details");

    expect(details).toHaveTextContent(`${questionnaireName}|10001011|${role}`);
  });
});
