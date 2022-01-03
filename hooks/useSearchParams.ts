import { useCallback, useEffect, useState } from "react";

export function useSearchParams<T extends Record<string, string>>(
  defaultValue: T
): [
  searchParams: T,
  setSearchParams: (partialSearchParams: Partial<T>) => void
] {
  const [searchParams, setSearchParams] = useState<T>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    const currentSearchParams = Object.fromEntries(
      new URLSearchParams(window.location.search).entries()
    );

    return {
      ...defaultValue,
      ...currentSearchParams,
    } as T;
  });

  const _setSearchParams = useCallback(
    (partialSearchParams: Partial<T>) => {
      const currentSearchParams = Object.fromEntries(
        new URLSearchParams(window.location.search).entries()
      );

      setSearchParams({
        ...defaultValue,
        ...currentSearchParams,
        ...partialSearchParams,
      });
    },
    [defaultValue]
  );

  useEffect(() => {
    history.pushState(
      {},
      "",
      location.pathname + `?${new URLSearchParams(searchParams).toString()}`
    );
  }, [searchParams]);

  return [searchParams, _setSearchParams];
}
