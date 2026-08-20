import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { mockCaseAllocatedToRich } from "../../../server/test-utils/case.mock";
import UserRole from "../../types/user.types";

import CaseSearchLinks from "./caseSearchLinks";

describe("CaseSearchLinks", () => {
  const questionnaireName = "FRS2504A_EDIT";

  function renderLinks(role: UserRole) {
    return render(
      <BrowserRouter>
        <CaseSearchLinks
          questionnaireName={questionnaireName}
          caseDetails={mockCaseAllocatedToRich}
          role={role}
        />
      </BrowserRouter>,
    );
  }

  it.each([UserRole.SVT_Supervisor, UserRole.FRS_Researcher])(
    "renders edit and view links for %s",
    (role) => {
      renderLinks(role);

      expect(screen.getByRole("link", { name: "Edit case" })).toHaveAttribute(
        "href",
        `/questionnaires/${questionnaireName}/cases/${mockCaseAllocatedToRich.primaryKey}/editcase`,
      );
      expect(screen.getByRole("link", { name: /View case/ })).toHaveAttribute(
        "href",
        mockCaseAllocatedToRich.readOnlyUrl,
      );
    },
  );

  it("renders interviewer-specific links for survey support users", () => {
    renderLinks(UserRole.Survey_Support);

    expect(screen.getByRole("link", { name: "Edit interviewer case" })).toHaveAttribute(
      "href",
      `/questionnaires/${questionnaireName}/cases/${mockCaseAllocatedToRich.primaryKey}/editcase`,
    );
    expect(screen.getByRole("link", { name: /View interviewer case/ })).toHaveAttribute(
      "href",
      mockCaseAllocatedToRich.readOnlyUrl,
    );
  });

  it("renders no links for roles without search actions", () => {
    renderLinks(UserRole.SVT_Editor);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
