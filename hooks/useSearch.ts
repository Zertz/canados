import { useCallback, useEffect, useReducer } from "react";
import { useWorker } from "./useWorker";
import ky from "../ky";

type Props = {
  tornados?: Tornado[];
};

type State = {
  results: Tornado[];
  status: Common.Status;
};

type Action =
  | { type: "results"; payload: Tornado[] }
  | { type: "status"; payload: Common.Status };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "results": {
      return {
        ...state,
        results: action.payload,
        status: "ready",
      };
    }
    case "status": {
      return {
        ...state,
        status: action.payload,
      };
    }
    default: {
      throw new Error();
    }
  }
}

export const useSearch = ({ tornados }: Props) => {
  const [{ results, status }, dispatch] = useReducer(reducer, {
    results: [],
    status: "idle",
  });

  const receive = useCallback(
    (data) => {
      if (!Array.isArray(tornados)) {
        return;
      }

      const payload = JSON.parse(data);

      dispatch({
        type: "results",
        payload: payload.map(({ date, ...tornado }) => ({
          date: new Date(date),
          ...tornado,
        })),
      });
    },
    [tornados]
  );

  const send = useWorker("search.worker.js", receive);

  useEffect(() => {
    if (!Array.isArray(tornados)) {
      return;
    }

    send({
      action: "store",
      payload: tornados,
    });
  }, [tornados]);

  const search = (filter) => {
    if (!Array.isArray(tornados) || !filter) {
      dispatch({ type: "status", payload: "idle" });

      return;
    }

    dispatch({ type: "status", payload: "loading" });

    (async () => {
      const payload = await ky(`/api/search?q=${filter}`).json();

      send({
        action: "search",
        payload,
      });
    })();
  };

  return {
    results,
    search,
    status,
  };
};
