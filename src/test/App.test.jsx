import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../app/App";

describe("Reaction Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Date, "now").mockImplementation(() => 1_000);
    vi.spyOn(Math, "random").mockReturnValue(0); // delay = 0ms
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function getScreenButton() {
    return screen.getAllByRole("button")[0];
  }

  it("starts on blue screen with start text", () => {
    render(<App />);
    expect(screen.getByText("Click to start")).toBeInTheDocument();
  });

  it("clicking blue starts an attempt (goes red)", () => {
    render(<App />);

    fireEvent.click(getScreenButton());

    expect(screen.getByText("Wait for green…")).toBeInTheDocument();
  });

  it("turns green after the delay", async () => {
    render(<App />);

    fireEvent.click(getScreenButton()); // BLUE -> RED (effect schedules timeout)

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(screen.getByText("CLICK!")).toBeInTheDocument();
  });

  it("clicking too early shows too-soon message", () => {
    render(<App />);

    // Force delay to be long so we can click early
    Math.random.mockReturnValue(1); // delay = 10_000ms

    fireEvent.click(getScreenButton()); // BLUE -> RED
    fireEvent.click(getScreenButton()); // click while still RED

    expect(screen.getByText(/Clicked too soon/i)).toBeInTheDocument();
  });

  it("records a reaction time when clicking green", async () => {
    render(<App />);

    fireEvent.click(getScreenButton()); // BLUE -> RED

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    Date.now.mockImplementation(() => 1_123);

    fireEvent.click(getScreenButton()); // GREEN -> BLUE result

    expect(screen.getByText(/ms/)).toBeInTheDocument();
  });

  it("shows summary after five successful attempts", async () => {
    render(<App />);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      fireEvent.click(getScreenButton()); // BLUE -> RED

      await act(async () => {
        await vi.runOnlyPendingTimersAsync();
      });

      Date.now.mockImplementation(() => 1_000 + attempt * 100);

      fireEvent.click(getScreenButton()); // GREEN -> BLUE result/summary
    }

    expect(screen.getByText(/Average:/)).toBeInTheDocument();
  });
});
