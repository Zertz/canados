import { useState } from "react";

type Key = string;
type Encode<T> = (v?: T) => string | undefined;
type Decode<T> = (v?: string) => T | undefined;

const getValue = (key: Key) => {
  const searchParams = new URLSearchParams(location.search);

  return searchParams.get(key) || undefined;
};

function pushValue<T>(key: Key, value?: string) {
  const searchParams = new URLSearchParams(location.search);

  if (!value) {
    searchParams.delete(key);

    if ([...searchParams.keys()].length === 0) {
      history.pushState({}, "", location.pathname);
    }

    return;
  }

  searchParams.set(key, value);
  searchParams.sort();

  history.pushState({}, "", location.pathname + `?${searchParams.toString()}`);
}

export function useSearchParamState<T>(
  key: string,
  encode: Encode<T>,
  decode: Decode<T>
): [T | undefined, (value?: T) => void] {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") {
      return;
    }

    return getValue(key);
  });

  const setSearchParam = (value?: T) => {
    const encodedValue = encode(value);

    pushValue(key, encodedValue);

    setValue(encodedValue);
  };

  return [decode(value), setSearchParam];
}
