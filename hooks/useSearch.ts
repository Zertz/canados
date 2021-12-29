import ky from "ky";
import { useCallback, useEffect, useReducer, useRef } from "react";

type Props = {
  tornados?: Tornado[];
};

type State = {
  queuedQuery?: string;
  results: Tornado[];
  status: Common.Status;
};

type Action =
  | { type: "queue"; payload: string }
  | { type: "results"; payload: Tornado[] }
  | { type: "status"; payload: Common.Status };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "queue": {
      return {
        ...state,
        queuedQuery: action.payload,
      };
    }
    case "results": {
      return {
        ...state,
        results: action.payload,
        status: "ready",
      };
    }
    case "status": {
      return {
        queuedQuery:
          action.payload === "loading" ? undefined : state.queuedQuery,
        results: action.payload === "idle" ? [] : state.results,
        status: action.payload,
      };
    }
    default: {
      throw new Error();
    }
  }
}

export const useSearch = ({ tornados }: Props) => {
  const [{ queuedQuery, results, status }, dispatch] = useReducer(reducer, {
    queuedQuery: undefined,
    results: [],
    status: "idle",
  });

  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(new URL("../workers/search.worker.ts", import.meta.url))

    workerRef.current.onmessage = (e) => {
      if (!e.isTrusted) {
        return;
      }

      if (!Array.isArray(tornados)) {
        return;
      }

      const payload = JSON.parse(e.data);

      dispatch({
        type: "results",
        payload: payload.map(({ date, ...tornado }) => ({
          date: new Date(date),
          ...tornado,
        })),
      });
    };

    return () => {
      if (!workerRef.current) {
        return
      }

      workerRef.current.terminate()
    }
  }, [])

  const send = useCallback((data: { action: "search" | "store"; payload: any }) => {
    if(!workerRef.current) {
      return
    }

    workerRef.current.postMessage(JSON.stringify(data));
  }, []);

  useEffect(() => {
    if (!Array.isArray(tornados)) {
      return;
    }

    send({
      action: "store",
      payload: tornados,
    });

    if (queuedQuery) {
      search(queuedQuery);
    }
  }, [tornados]);

  const search = (query: string) => {
    if (!query) {
      dispatch({ type: "status", payload: "idle" });

      return;
    }

    if (!Array.isArray(tornados)) {
      dispatch({ type: "queue", payload: query });

      return;
    }

    dispatch({ type: "status", payload: "loading" });

    (async () => {
      const payload = await ky(`/api/search?q=${query}`).json();

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
