import { useEffect, useReducer } from "react";
import { getBoundedTornados } from "../utils/getBoundedTornados";
import { getClusteredTornados } from "../utils/getClusteredTornados";
import { getFitBounds } from "../utils/getFitBounds";
import { useAPI } from "./useAPI";
import { useSearch } from "./useSearch";

type State = {
  clusteredTornados?: ClusteredTornadoEvent[];
  fitBounds?: Common.Bounds;
  status: Common.Status;
  tornadoCount?: number;
};

type Action =
  | {
      type: "cluster";
      payload: {
        clusteredTornados: ClusteredTornadoEvent[];
        tornadoCount: number;
      };
    }
  | { type: "fitBounds"; payload: Common.Bounds }
  | { type: "status"; payload: Common.Status };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "cluster": {
      return {
        ...state,
        ...action.payload,
        status: "done"
      };
    }
    case "fitBounds": {
      return {
        ...state,
        fitBounds: action.payload
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

type Props = {
  screenBounds?: Common.Bounds;
};

export const useTornados = ({ screenBounds }: Props) => {
  const { data, error, load, status: apiStatus } = useAPI("/api/tornados");

  const { results: searchResults, search, status: searchStatus } = useSearch({
    tornados: data
  });

  const [
    { clusteredTornados, fitBounds, status, tornadoCount },
    dispatch
  ] = useReducer(reducer, {
    clusteredTornados: undefined,
    fitBounds: undefined,
    status: "idle",
    tornadoCount: undefined
  });

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const searchMode = searchStatus === "done";

    const tornados = searchMode
      ? searchResults
      : Array.isArray(data)
      ? data
      : undefined;

    if (!Array.isArray(tornados) || tornados.length === 0) {
      return;
    }

    const fitBounds = getFitBounds(tornados);

    if (JSON.stringify(fitBounds[0]) === JSON.stringify(fitBounds[1])) {
      dispatch({
        type: "fitBounds",
        payload: [
          [(fitBounds[0][0] -= 0.1), (fitBounds[0][1] -= 0.1)],
          [(fitBounds[1][0] += 0.1), (fitBounds[1][1] += 0.1)]
        ]
      });

      return;
    }

    dispatch({
      type: "fitBounds",
      payload: fitBounds
    });
  }, [data, searchResults]);

  useEffect(() => {
    if (!fitBounds && !screenBounds) {
      return;
    }

    if (JSON.stringify(fitBounds) === JSON.stringify(screenBounds)) {
      return;
    }

    dispatch({ type: "status", payload: "busy" });
  }, [fitBounds, screenBounds]);

  useEffect(() => {
    switch (status) {
      case "busy": {
        const searchMode = searchStatus === "done";
        const bounds = searchMode ? fitBounds : screenBounds || fitBounds;

        if (!bounds) {
          return;
        }

        const tornados = searchMode ? searchResults : data;

        if (!Array.isArray(tornados)) {
          return;
        }

        const bounded = searchMode
          ? tornados
          : getBoundedTornados({ bounds, tornados });

        dispatch({
          type: "cluster",
          payload: {
            clusteredTornados: getClusteredTornados({ tornados: bounded }),
            tornadoCount: bounded.length
          }
        });

        break;
      }
      default: {
        break;
      }
    }
  }, [status]);

  return {
    apiStatus,
    clusteredTornados,
    error,
    fitBounds,
    search,
    searchStatus,
    tornadoCount
  };
};
