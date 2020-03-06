import { useEffect, useReducer } from "react";
import ky from "../ky";

type State = {
  data?: TornadoEvent[];
  loading: boolean;
  error?: Error;
};

type Action =
  | { type: "failure"; error: Error }
  | { type: "request" }
  | { type: "success"; data: any };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "failure": {
      return {
        data: undefined,
        error: action.error,
        loading: false
      };
    }
    case "request": {
      return {
        data: undefined,
        error: undefined,
        loading: true
      };
    }
    case "success": {
      return {
        data: action.data,
        error: undefined,
        loading: false
      };
    }
    default: {
      throw new Error();
    }
  }
}

function parseObject(object) {
  const entries = Object.entries(object).map(([key, value]) => [
    key,
    parseValue(value)
  ]);

  return Object.fromEntries(entries as any);
}

function parseValue(value) {
  if (!value) {
    return value;
  }

  if (typeof value.$date !== "undefined") {
    if (!value.$date) {
      return value.$date;
    }

    return new Date(value.$date);
  }

  return value;
}

export const useAPI = url => {
  const [{ data, error, loading }, dispatch] = useReducer(reducer, {
    data: undefined,
    error: undefined,
    loading: false
  });

  const load = async () => {
    dispatch({ type: "request" });

    try {
      const result = await ky(url).json();

      dispatch({
        type: "success",
        data: Array.isArray(result)
          ? result.map(parseObject)
          : parseObject(result)
      });
    } catch (e) {
      dispatch({ type: "failure", error: e });
    }
  };

  useEffect(() => {
    if (!error) {
      return;
    }

    console.error(error);
  }, [error]);

  return {
    data,
    error,
    load,
    loading
  };
};
