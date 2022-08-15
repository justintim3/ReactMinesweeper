import { useCallback, useEffect, useRef, useState } from "react";

const MAX_TIME = 999;
const TICK_DURATION = 1000;

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const timerId = useRef<ReturnType<typeof setInterval> | undefined>();

  const stopTimer = useCallback(() => {
    if (timerId.current !== undefined) {
      clearInterval(timerId.current);
      timerId.current = undefined;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerId.current = setInterval(
      () =>
        setTime((time) => {
          if (time === MAX_TIME) {
            stopTimer();
            return time;
          }
          return time + 1;
        }),
      TICK_DURATION
    );
  }, [stopTimer]);

  // Clean up timer
  useEffect(() => () => stopTimer(), [stopTimer]);

  return { setTime, startTimer, stopTimer, time };
};
