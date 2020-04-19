import { useEffect, useReducer } from "react";
import { getBoundedTornados } from "../utils/getBoundedTornados";
import { getClusteredTornados } from "../utils/getClusteredTornados";
import { getFilteredTornados } from "../utils/getFilteredTornados";
import { getFitBounds } from "../utils/getFitBounds";
import { useAPI } from "./useAPI";
import { useSearch } from "./useSearch";

type State = {
  boundedTornados?: Tornado[];
  filteredTornados?: Tornado[];
  clusteredTornados?: ClusteredTornado[];
  fitBounds?: Common.Bounds;
  status: Common.Status;
  tornadoCount?: number;
};

type Action =
  | {
      type: "cluster";
      payload: {
        boundedTornados: Tornado[];
        filteredTornados: Tornado[];
        clusteredTornados: ClusteredTornado[];
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
        status: "ready",
      };
    }
    case "fitBounds": {
      return {
        ...state,
        fitBounds: action.payload,
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

type Props = {
  fujitaFilter: [number, number];
  screenBounds?: Common.Bounds;
};

export const useTornados = ({ fujitaFilter, screenBounds }: Props) => {
  const { data, error, load, status: apiStatus } = useAPI("/api/tornados");

  const { results: searchResults, search, status: searchStatus } = useSearch({
    tornados: data,
  });

  const [
    {
      boundedTornados,
      clusteredTornados,
      filteredTornados,
      fitBounds,
      status,
      tornadoCount,
    },
    dispatch,
  ] = useReducer(reducer, {
    boundedTornados: undefined,
    clusteredTornados: undefined,
    filteredTornados: undefined,
    fitBounds: undefined,
    status: "idle",
    tornadoCount: undefined,
  });

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (apiStatus === "loading") {
      return;
    }

    if (searchStatus === "loading") {
      return;
    }

    const searchMode = searchStatus === "ready";

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
          [(fitBounds[1][0] += 0.1), (fitBounds[1][1] += 0.1)],
        ],
      });

      return;
    }

    dispatch({
      type: "fitBounds",
      payload: fitBounds,
    });
  }, [apiStatus, searchStatus]);

  useEffect(() => {
    if (!fitBounds && !screenBounds) {
      return;
    }

    if (JSON.stringify(fitBounds) === JSON.stringify(screenBounds)) {
      return;
    }

    dispatch({ type: "status", payload: "loading" });
  }, [fitBounds, screenBounds]);

  useEffect(() => {
    switch (status) {
      case "loading": {
        const searchMode = searchStatus === "ready";
        const bounds = searchMode ? fitBounds : screenBounds || fitBounds;

        if (!bounds) {
          return;
        }

        const tornados = searchMode ? searchResults : data;

        if (!Array.isArray(tornados)) {
          return;
        }

        const boundedTornados = searchMode
          ? tornados
          : getBoundedTornados({ bounds, tornados });

        const filteredTornados = getFilteredTornados({
          filters: { fujita: fujitaFilter },
          tornados: boundedTornados,
        });

        dispatch({
          type: "cluster",
          payload: {
            boundedTornados,
            clusteredTornados: getClusteredTornados({
              tornados: filteredTornados,
            }),
            filteredTornados,
            tornadoCount: filteredTornados.length,
          },
        });

        break;
      }
      default: {
        break;
      }
    }
  }, [status]);

  useEffect(() => {
    if (!boundedTornados) {
      return;
    }

    const filteredTornados = getFilteredTornados({
      filters: { fujita: fujitaFilter },
      tornados: boundedTornados,
    });

    dispatch({
      type: "cluster",
      payload: {
        boundedTornados,
        clusteredTornados: getClusteredTornados({
          tornados: filteredTornados,
        }),
        filteredTornados,
        tornadoCount: filteredTornados.length,
      },
    });
  }, [fujitaFilter]);

  return {
    apiStatus,
    clusteredTornados,
    error,
    fitBounds,
    search,
    searchStatus,
    tornadoCount,
    tornados: filteredTornados,
  };
};
