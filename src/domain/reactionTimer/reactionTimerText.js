import { BlueMessage, MAX_ATTEMPTS, ScreenMode } from "./constants";

export function getScreenClassName(screenMode) {
  switch (screenMode) {
    case ScreenMode.RED:
      return "screen screen--red";
    case ScreenMode.GREEN:
      return "screen screen--green";
    case ScreenMode.BLUE:
    default:
      return "screen screen--blue";
  }
}

export function getScreenText({
  screenMode,
  blueMessage,
  attemptsCompleted,
  lastReactionTime,
  reactionTimes,
  getAverage,
}) {
  switch (screenMode) {
    case ScreenMode.RED:
      return "Wait for green…";

    case ScreenMode.GREEN:
      return "CLICK!";

    case ScreenMode.BLUE: {
      switch (blueMessage) {
        case BlueMessage.START:
          return "Click to start";

        case BlueMessage.TOO_SOON:
          return "Clicked too soon.\n\nClick to try again";

        case BlueMessage.RESULT:
          return `Attempt ${attemptsCompleted}/${MAX_ATTEMPTS}\n\n${lastReactionTime} ms\n\nClick to continue`;

        case BlueMessage.SUMMARY: {
          const averageMs = getAverage(reactionTimes);
          return `Done.\n\nAverage: ${averageMs} ms\n\nTimes:\n${reactionTimes.join(
            ", "
          )}\n\nClick to reset`;
        }

        default:
          return "";
      }
    }

    default:
      return "";
  }
}
