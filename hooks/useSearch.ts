import { useEffect, useReducer } from "react";
import { useWorker } from "./useWorker";

type Props = {
  tornados?: TornadoEvent[];
};

type State = {
  results: SearchedTornadoEvent[];
  status: Common.SearchStatus;
};

type Action =
  | { type: "results"; payload: SearchedTornadoEvent[] }
  | { type: "status"; payload: Common.SearchStatus };

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

  const receive = (payload: SearchedTornadoEvent[]) => {
    dispatch({ type: "results", payload });
  };

  const send = useWorker("search.worker.js", receive);

  useEffect(() => {
    if (!tornados) {
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

    dispatch({ type: "status", payload: "searching" });

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
