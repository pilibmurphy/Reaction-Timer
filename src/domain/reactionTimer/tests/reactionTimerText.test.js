import { describe, expect, it } from "vitest";
import { BlueMessage, ScreenMode } from "../constants";
import { getScreenClassName, getScreenText } from "../reactionTimerText";

describe("reactionTimerText", () => {
  it("getScreenClassName returns correct class for each screen mode", () => {
    expect(getScreenClassName(ScreenMode.BLUE)).toContain("screen--blue");
    expect(getScreenClassName(ScreenMode.RED)).toContain("screen--red");
    expect(getScreenClassName(ScreenMode.GREEN)).toContain("screen--green");
  });

  it("getScreenText returns correct text for RED and GREEN", () => {
    expect(
      getScreenText({
        screenMode: ScreenMode.RED,
        blueMessage: BlueMessage.START,
        attemptsCompleted: 0,
        lastReactionTime: null,
        reactionTimes: [],
        getAverage: () => 0,
      })
    ).toBe("Wait for green…");

    expect(
      getScreenText({
        screenMode: ScreenMode.GREEN,
        blueMessage: BlueMessage.START,
        attemptsCompleted: 0,
        lastReactionTime: null,
        reactionTimes: [],
        getAverage: () => 0,
      })
    ).toBe("CLICK!");
  });

  it("getScreenText returns start and too-soon messages on BLUE", () => {
    expect(
      getScreenText({
        screenMode: ScreenMode.BLUE,
        blueMessage: BlueMessage.START,
        attemptsCompleted: 0,
        lastReactionTime: null,
        reactionTimes: [],
        getAverage: () => 0,
      })
    ).toMatch(/Click to start/i);

    expect(
      getScreenText({
        screenMode: ScreenMode.BLUE,
        blueMessage: BlueMessage.TOO_SOON,
        attemptsCompleted: 0,
        lastReactionTime: null,
        reactionTimes: [],
        getAverage: () => 0,
      })
    ).toMatch(/Clicked too soon/i);
  });

  it("getScreenText returns summary including average and times", () => {
    const text = getScreenText({
      screenMode: ScreenMode.BLUE,
      blueMessage: BlueMessage.SUMMARY,
      attemptsCompleted: 5,
      lastReactionTime: 150,
      reactionTimes: [100, 200, 300, 150, 250],
      getAverage: (values) => Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    });

    expect(text).toMatch(/Average:/);
    expect(text).toMatch(/100, 200, 300, 150, 250/);
  });
});
