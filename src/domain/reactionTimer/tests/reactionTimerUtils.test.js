import { describe, expect, it, vi } from "vitest";
import { getAverage, getRandomDelay } from "../reactionTimerUtils";
import { MAX_DELAY_MS } from "../constants";

describe("reactionTimerUtils", () => {
  it("getAverage returns 0 for empty array", () => {
    expect(getAverage([])).toBe(0);
  });

  it("getAverage returns rounded mean", () => {
    expect(getAverage([100, 200, 301])).toBe(200); // 601 / 3 = 200.333 -> 200
    expect(getAverage([100, 200, 302])).toBe(201); // 602 / 3 = 200.666 -> 201
  });

  it("getRandomDelay returns value within range 0..MAX_DELAY_MS", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getRandomDelay()).toBe(0);

    Math.random.mockReturnValue(0.999999999);
    expect(getRandomDelay()).toBe(MAX_DELAY_MS);

    Math.random.mockRestore();
  });
});
