import { render, screen } from "@testing-library/react";
import { beforeEach, vi } from "vitest";

import ErrorPanel from "./errorPanel";

describe("ErrorPanel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders error panel with provided message", () => {
    const message = "An error occurred";

    render(<ErrorPanel message={message} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByTestId("ErrorMessage")).toHaveTextContent(message);
  });

  it("clears message after 5 seconds when setMessage is provided", () => {
    const message = "Test error";
    const setMessage = vi.fn();

    render(
      <ErrorPanel
        message={message}
        setMessage={setMessage}
      />,
    );

    expect(setMessage).not.toHaveBeenCalled();

    vi.advanceTimersByTime(5000);

    expect(setMessage).toHaveBeenCalledWith({
      show: false,
      text: "",
      type: "",
    });
  });

  it("does not set timeout when setMessage is not provided", () => {
    const message = "Test error";
    const setMessage = undefined;

    render(
      <ErrorPanel
        message={message}
        setMessage={setMessage}
      />,
    );

    vi.advanceTimersByTime(5000);

    expect(setMessage).toBeUndefined();
  });

  it("clears timeout on component unmount", () => {
    const message = "Test error";
    const setMessage = vi.fn();
    const { unmount } = render(
      <ErrorPanel
        message={message}
        setMessage={setMessage}
      />,
    );

    unmount();

    vi.advanceTimersByTime(5000);

    expect(setMessage).not.toHaveBeenCalled();
  });
});
