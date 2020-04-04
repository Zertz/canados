import { useEffect, useReducer } from "react";
import ky from "../ky";

type State = {
  data?: TornadoEvent[];
  error?: Error;
  status: Common.Status;
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
        status: "idle",
      };
    }
    case "request": {
      return {
        data: undefined,
        error: undefined,
        status: "busy",
      };
    }
    case "success": {
      return {
        data: action.data,
        error: undefined,
        status: "done",
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
    parseValue(value),
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

export const useAPI = (url) => {
  const [{ data, error, status }, dispatch] = useReducer(reducer, {
    data: undefined,
    error: undefined,
    status: "idle",
  });

  const load = async () => {
    dispatch({ type: "request" });

    try {
      const result = await ky(url).json();

      dispatch({
        type: "success",
        data: Array.isArray(result)
          ? result.map(parseObject)
          : parseObject(result),
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
    status,
  };
};
