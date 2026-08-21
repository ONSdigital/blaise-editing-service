import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";

import CreateRoutes from "./createRoutes";

describe("CreateRoutes", () => {
  it("renders matching child routes when enabled", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <CreateRoutes when>
          <Route
            path="/"
            element={<p>Home page</p>}
          />
        </CreateRoutes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Home page")).toBeInTheDocument();
  });

  it("renders no routes when disabled", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <CreateRoutes when={false}>
          <Route
            path="/"
            element={<p>Home page</p>}
          />
        </CreateRoutes>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Home page")).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a not-found page for unknown routes", () => {
    render(
      <MemoryRouter initialEntries={["/missing-route"]}>
        <CreateRoutes when>
          <Route
            path="/"
            element={<p>Home page</p>}
          />
        </CreateRoutes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByText("The page you're looking for doesn't exist.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return home" })).toHaveAttribute("href", "/");
  });
});
