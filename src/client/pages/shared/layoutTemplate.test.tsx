import { render, screen } from "@testing-library/react";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { beforeEach, vi } from "vitest";

import LayoutTemplate from "./layoutTemplate";

vi.mock("blaise-design-system-react-components", () => ({
  DefaultErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
  Footer: () => <footer data-testid="footer">Footer</footer>,
  Header: ({
    title,
    signOutButton,
    signOutFunction,
  }: {
    title: string;
    signOutButton: boolean;
    signOutFunction: () => void;
  }) => (
    <header data-testid="header">
      <h1>{title}</h1>
      {signOutButton && (
        <button
          data-testid="sign-out-button"
          onClick={signOutFunction}
        >
          Sign Out
        </button>
      )}
    </header>
  ),
}));

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

const mockUseNavigate = vi.mocked(useNavigate);
const mockUseLocation = vi.mocked(useLocation);

describe("LayoutTemplate", () => {
  const mockNavigate = vi.fn();
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseLocation.mockReturnValue({
      pathname: "/",
      search: "",
      hash: "",
      key: "default",
      state: null,
    });
  });

  it("renders header with title", () => {
    render(
      <BrowserRouter>
        <LayoutTemplate
          showSignOutButton={false}
          signOut={mockSignOut}
        >
          <div>Test Content</div>
        </LayoutTemplate>
      </BrowserRouter>,
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Blaise Editing Service" })).toBeInTheDocument();
  });

  it("renders children within error boundary", () => {
    const testContent = "Test Child Content";

    render(
      <BrowserRouter>
        <LayoutTemplate
          showSignOutButton={false}
          signOut={mockSignOut}
        >
          <div>{testContent}</div>
        </LayoutTemplate>
      </BrowserRouter>,
    );

    expect(screen.getByTestId("error-boundary")).toHaveTextContent(testContent);
  });

  it("renders footer", () => {
    render(
      <BrowserRouter>
        <LayoutTemplate
          showSignOutButton={false}
          signOut={mockSignOut}
        >
          <div>Content</div>
        </LayoutTemplate>
      </BrowserRouter>,
    );

    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("shows sign out button when showSignOutButton is true", () => {
    render(
      <BrowserRouter>
        <LayoutTemplate
          showSignOutButton={true}
          signOut={mockSignOut}
        >
          <div>Content</div>
        </LayoutTemplate>
      </BrowserRouter>,
    );

    expect(screen.getByTestId("sign-out-button")).toBeInTheDocument();
  });

  it("calls signOut and navigates to home when sign out button is clicked", () => {
    render(
      <BrowserRouter>
        <LayoutTemplate
          showSignOutButton={true}
          signOut={mockSignOut}
        >
          <div>Content</div>
        </LayoutTemplate>
      </BrowserRouter>,
    );

    const signOutButton = screen.getByTestId("sign-out-button");

    signOutButton.click();

    expect(mockSignOut).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("hides sign out button when showSignOutButton is false", () => {
    render(
      <BrowserRouter>
        <LayoutTemplate
          showSignOutButton={false}
          signOut={mockSignOut}
        >
          <div>Content</div>
        </LayoutTemplate>
      </BrowserRouter>,
    );

    expect(screen.queryByTestId("sign-out-button")).not.toBeInTheDocument();
  });

  it("renders content in correct container with data-testid", () => {
    render(
      <BrowserRouter>
        <LayoutTemplate
          showSignOutButton={false}
          signOut={mockSignOut}
        >
          <span>Test Content</span>
        </LayoutTemplate>
      </BrowserRouter>,
    );

    expect(screen.getByTestId("app-content")).toHaveTextContent("Test Content");
  });
});
