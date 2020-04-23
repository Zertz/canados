import { useState } from "react";

type KeyValue = Record<string, string | null>;

const getValues = (params: string[]): KeyValue => {
  const searchParams = new URLSearchParams(location.search);

  return params.reduce(
    (acc, param) => ({
      ...acc,
      [param]: searchParams.get(param),
    }),
    {}
  );
};

const pushValues = (setValues?: (values: KeyValue) => void) => (
  values: KeyValue
) => {
  const searchParams = new URLSearchParams(location.search);

  Object.entries(values).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
  });

  const keys = [...searchParams.keys()];

  if (keys.length === 0) {
    history.pushState({}, "", location.pathname);

    return;
  }

  searchParams.sort();

  history.pushState({}, "", location.pathname + `?${searchParams.toString()}`);

  if (setValues) {
    setValues(getValues(keys));
  }
};

export function useSearchParams(
  initialValues: KeyValue
): [KeyValue, (values: KeyValue) => void] {
  const [values, setValues] = useState(() => {
    if (typeof window === "undefined") {
      return initialValues;
    }

    const values = Object.fromEntries(
      Object.entries(getValues(Object.keys(initialValues)))
        .filter(([key]) => typeof initialValues[key] !== undefined)
        .map(([key, value]) => [key, initialValues[key] || value])
    );

    pushValues()(values);

    return values;
  });

  return [values, pushValues(setValues)];
}
