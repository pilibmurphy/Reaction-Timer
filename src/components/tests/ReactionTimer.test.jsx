import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ReactionTimer from "../ReactionTimer";

describe("ReactionTimer (component)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Date, "now").mockImplementation(() => 1_000);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function getScreenButton() {
    return screen.getAllByRole("button")[0];
  }

  async function flushAllTimersAndReact() {
    await act(async () => {
      vi.runAllTimers();
    });
  }

  async function startAttemptAndTurnGreen() {
    fireEvent.click(getScreenButton()); // BLUE -> RED
    expect(screen.getByText("Wait for green…")).toBeInTheDocument();

    await flushAllTimersAndReact(); // RED -> GREEN
    expect(screen.getByText("CLICK!")).toBeInTheDocument();
  }

  it("starts on blue with start text", () => {
    render(<ReactionTimer getDelayMs={() => 0} />);
    expect(screen.getByText("Click to start")).toBeInTheDocument();
  });

  it("goes to green after starting and timers flush", async () => {
    render(<ReactionTimer getDelayMs={() => 0} />);

    fireEvent.click(getScreenButton()); // BLUE -> RED
    expect(screen.getByText("Wait for green…")).toBeInTheDocument();

    await flushAllTimersAndReact();

    expect(screen.getByText("CLICK!")).toBeInTheDocument();
  });

  it("records a reaction and shows result", async () => {
    render(<ReactionTimer getDelayMs={() => 0} />);

    await startAttemptAndTurnGreen();

    Date.now.mockImplementation(() => 1_123);
    fireEvent.click(getScreenButton()); // GREEN -> BLUE result

    expect(screen.getByText(/ms/)).toBeInTheDocument();
  });
});
