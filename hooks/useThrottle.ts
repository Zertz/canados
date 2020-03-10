import { useEffect, useRef, useState } from "react";

export const useThrottle = (value, delay: number) => {
  const lastRun = useRef(performance.now());
  const throttledValue = useRef(value);
  const [update, triggerUpdate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const now = performance.now();

      if (now - lastRun.current >= delay) {
        throttledValue.current = value;
        lastRun.current = now;

        triggerUpdate(!update);
      }
    }, delay - (performance.now() - lastRun.current));

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return throttledValue.current;
};
