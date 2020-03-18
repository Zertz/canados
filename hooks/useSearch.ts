import { useEffect, useReducer, useCallback } from "react";
import { useWorker } from "./useWorker";

type Props = {
  tornados?: TornadoEvent[];
};

type State = {
  results: SearchedTornadoEvent[];
  status: Common.Status;
};

type Action =
  | { type: "results"; payload: SearchedTornadoEvent[] }
  | { type: "status"; payload: Common.Status };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "results": {
      return {
        ...state,
        results: action.payload,
        status: "done"
      };
    }
    case "status": {
      return {
        ...state,
        status: action.payload
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
    status: "idle"
  });

  const receive = useCallback(
    data => {
      if (!Array.isArray(tornados)) {
        return;
      }

      const matches = JSON.parse(data);
      const matchKeys = Object.keys(matches);

      const payload = tornados
        .filter(({ id }) => matches[id])
        .sort((a, b) => matchKeys.indexOf(a.id) - matchKeys.indexOf(b.id))
        .map(result => ({
          ...result,
          relevance: matches[result.id]
        }));

      dispatch({ type: "results", payload });
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
      payload: tornados
    });
  }, [tornados]);

  const search = filter => {
    if (!Array.isArray(tornados) || !filter) {
      dispatch({ type: "status", payload: "idle" });

      return;
    }

    dispatch({ type: "status", payload: "busy" });

    setTimeout(() => {
      send({
        action: "search",
        payload: filter
      });
    });
  };

  return {
    results,
    search,
    status
  };
};
