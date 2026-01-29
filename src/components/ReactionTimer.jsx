import { useEffect, useMemo, useRef, useState } from "react";
import "./ReactionTimer.css";
import { BlueMessage, MAX_ATTEMPTS, ScreenMode } from "../domain/reactionTimer/constants";
import { getAverage, getRandomDelay } from "../domain/reactionTimer/reactionTimerUtils";
import { getScreenClassName, getScreenText } from "../domain/reactionTimer/reactionTimerText";

export default function ReactionTimer() {
  const [screenMode, setScreenMode] = useState(ScreenMode.BLUE);
  const [blueMessage, setBlueMessage] = useState(BlueMessage.START);

  const [reactionTimes, setReactionTimes] = useState([]);
  const [lastReactionTime, setLastReactionTime] = useState(null);

  const waitingTimeoutIdRef = useRef(null);
  const greenStartTimestampRef = useRef(null);

  const attemptsCompleted = reactionTimes.length;
  const isFinished = attemptsCompleted >= MAX_ATTEMPTS;

  useEffect(() => {
    switch (screenMode) {
      case ScreenMode.RED: {
        const delayMs = getRandomDelay();

        waitingTimeoutIdRef.current = window.setTimeout(() => {
          greenStartTimestampRef.current = Date.now();
          setScreenMode(ScreenMode.GREEN);
          waitingTimeoutIdRef.current = null;
        }, delayMs);

        return () => {
          if (waitingTimeoutIdRef.current !== null) {
            clearTimeout(waitingTimeoutIdRef.current);
            waitingTimeoutIdRef.current = null;
          }
        };
      }

      default:
        return undefined;
    }
  }, [screenMode]);

  const screenText = useMemo(() => {
    return getScreenText({
      screenMode,
      blueMessage,
      attemptsCompleted,
      lastReactionTime,
      reactionTimes,
      getAverage,
    });
  }, [attemptsCompleted, blueMessage, lastReactionTime, reactionTimes, screenMode]);

  const screenClassName = useMemo(() => {
    return getScreenClassName(screenMode);
  }, [screenMode]);

  function clearWaitingTimer() {
    if (waitingTimeoutIdRef.current !== null) {
      clearTimeout(waitingTimeoutIdRef.current);
      waitingTimeoutIdRef.current = null;
    }
  }

  function resetAll() {
    clearWaitingTimer();
    greenStartTimestampRef.current = null;
    setReactionTimes([]);
    setLastReactionTime(null);
    setBlueMessage(BlueMessage.START);
    setScreenMode(ScreenMode.BLUE);
  }

  function startAttempt() {
    setScreenMode(ScreenMode.RED);
  }

  function handleScreenClick() {
    switch (screenMode) {
      case ScreenMode.BLUE: {
        if (isFinished && blueMessage === BlueMessage.SUMMARY) {
          resetAll();
          return;
        }

        startAttempt();
        return;
      }

      case ScreenMode.RED: {
        clearWaitingTimer();
        greenStartTimestampRef.current = null;
        setBlueMessage(BlueMessage.TOO_SOON);
        setScreenMode(ScreenMode.BLUE);
        return;
      }

      case ScreenMode.GREEN: {
        const startTimestamp = greenStartTimestampRef.current;

        if (startTimestamp !== null) {
          const reactionTimeMs = Date.now() - startTimestamp;
          setLastReactionTime(reactionTimeMs);
          setReactionTimes((previous) => [...previous, reactionTimeMs]);
        }

        greenStartTimestampRef.current = null;

        const nextAttemptCount = attemptsCompleted + 1;

        if (nextAttemptCount >= MAX_ATTEMPTS) {
          setBlueMessage(BlueMessage.SUMMARY);
        } else {
          setBlueMessage(BlueMessage.RESULT);
        }

        setScreenMode(ScreenMode.BLUE);
        return;
      }

      default:
        setScreenMode(ScreenMode.BLUE);
    }
  }

  return (
    <div
      className={screenClassName}
      role="button"
      tabIndex={0}
      onClick={handleScreenClick}
      onKeyDown={(keyboardEvent) => {
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          handleScreenClick();
        }
      }}
    >
      <h1 className="title">Reaction Timer</h1>
      <p className="hint" style={{ whiteSpace: "pre-line" }}>
        {screenText}
      </p>
    </div>
  );
}
