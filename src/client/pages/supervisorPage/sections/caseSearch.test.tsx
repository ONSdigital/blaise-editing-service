import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import UserRole from "../../../types/user.types";

import CaseSearch from "./caseSearch";

const { caseSearchFormSpy } = vi.hoisted(() => ({
  caseSearchFormSpy: vi.fn(),
}));

vi.mock("../../shared/caseSearchForm", () => ({
  default: ({ questionnaireName, userRole }: { questionnaireName: string; userRole: UserRole }) => {
    caseSearchFormSpy({ questionnaireName, userRole });

    return <div data-testid="case-search-form" />;
  },
}));

describe("CaseSearch", () => {
  it("renders the heading and passes expected props", () => {
    render(
      <MemoryRouter initialEntries={["/allocate/FRS2504A_EDIT"]}>
        <Routes>
          <Route
            path="/allocate/:questionnaireName"
            element={<CaseSearch />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "FRS2504A" })).toBeInTheDocument();
    expect(caseSearchFormSpy).toHaveBeenCalledWith({
      questionnaireName: "FRS2504A_EDIT",
      userRole: UserRole.SVT_Supervisor,
    });
  });
});
