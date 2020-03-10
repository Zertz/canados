import { useEffect, useRef, useState } from "react";

export function useDebounce(value, delay: number) {
  const debouncedValue = useRef(value);
  const [update, triggerUpdate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      debouncedValue.current = value;

      triggerUpdate(!update);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, value]);

  return debouncedValue.current;
}
