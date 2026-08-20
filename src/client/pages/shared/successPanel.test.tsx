import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import SuccessPanel from "./successPanel";

describe("SuccessPanel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders success panel with provided message", () => {
    const message = "Operation completed successfully";

    render(<SuccessPanel message={message} />);

    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByTestId("SuccessMessage")).toHaveTextContent(message);
  });

  it("clears message after 5 seconds when setMessage is provided", () => {
    const message = "Test success";
    const setMessage = vi.fn();

    render(
      <SuccessPanel
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
    const message = "Test success";
    const setMessage = undefined;

    render(
      <SuccessPanel
        message={message}
        setMessage={setMessage}
      />,
    );

    vi.advanceTimersByTime(5000);

    expect(setMessage).toBeUndefined();
  });

  it("clears timeout on component unmount", () => {
    const message = "Test success";
    const setMessage = vi.fn();
    const { unmount } = render(
      <SuccessPanel
        message={message}
        setMessage={setMessage}
      />,
    );

    unmount();

    vi.advanceTimersByTime(5000);

    expect(setMessage).not.toHaveBeenCalled();
  });
});
