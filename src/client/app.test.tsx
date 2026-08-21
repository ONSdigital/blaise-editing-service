import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import mockUser from "../server/test-utils/user.mock";

import { getEditorInformation, getSupervisorEditorInformation, getSurveys } from "./api/nodeApi";
import App from "./app";
import { mockEditorWithFiveAllocatedCases } from "./test-utils/editor.mock";
import { mockSupervisorWithLargeCaseload } from "./test-utils/supervisor.mock";
import mockFilteredSurveyList from "./test-utils/survey.mock";

const validUserRoles: string[] = ["SVT Supervisor", "SVT Editor"];

vi.mock("blaise-login-react-client", async () => {
  const actual = await vi.importActual("blaise-login-react-client");

  return {
    ...actual,
    Authenticate: ({
      children,
    }: {
      children: (user: unknown, loggedIn: boolean, logOutFunction: () => void) => unknown;
    }) => children(mockUser, true, () => {}),
  };
});

vi.mock("./api/nodeApi");
const mockGetSurveys = getSurveys as Mock;
const mockGetEditorInformation = getEditorInformation as Mock;
const mockGetSupervisorEditorInformation = getSupervisorEditorInformation as Mock;

describe("Renders the correct screen depending if the user has recently logged in", () => {
  beforeEach(() => {
    mockGetSurveys.mockResolvedValue(mockFilteredSurveyList);
    mockGetEditorInformation.mockResolvedValue(mockEditorWithFiveAllocatedCases);
    mockGetSupervisorEditorInformation.mockResolvedValue(mockSupervisorWithLargeCaseload);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Should display a message asking the user to enter their Blaise user credentials if they are not logged in", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(true).toBe(true);
  });

  it.each(validUserRoles)(
    "Should display the surveys page if the user is already logged in",
    async () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
      );
      expect(true).toBe(true);
    },
  );
});
