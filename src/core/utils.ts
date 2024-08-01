export const genId = (() => {
  let count = 0;
  return () => {
    return (++count).toString();
  };
})();

import { useEffect, useRef } from 'react';

type IntervalOptions =
  /** Default mode, it will execute after initial delay */
  | { mode: 'running' }
  /** Runs callback immediately then setup interval */
  | { mode: 'immediate' }
  /* Pauses running interval */
  | { mode: 'paused' };

export function useInterval(
  callback: () => void,
  delay: number,
  options: IntervalOptions = { mode: 'running' }
) {
  const savedCallback = useRef(callback);
  const intervalId = useRef<number | null>(null);

  const clearActiveInterval = () => {
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  useEffect(
    function makeSureNoStaleCallback() {
      // avoids resetting interval, but keeps callback fresh
      savedCallback.current = callback;
    },
    [callback]
  );

  useEffect(() => {
    const tick = () => savedCallback.current();

    clearActiveInterval();

    if (options.mode === 'paused') {
      return;
    }

    if (options.mode === 'immediate') {
      tick();
    }

    intervalId.current = setInterval(tick, delay);

    return clearActiveInterval;
  }, [delay, options.mode]);
}
