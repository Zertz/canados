import { useEffect, useReducer } from "react";
import ky from "../ky";

type State = {
  data?: Tornado[];
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

export const useAPI = url => {
  const [{ data, error, loading }, dispatch] = useReducer(reducer, {
    data: undefined,
    error: undefined,
    loading: false
  });

  const load = async () => {
    dispatch({ type: "request" });

    try {
      const data = await ky(url).json();

      dispatch({ type: "success", data });
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
