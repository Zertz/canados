import haversine from "fast-haversine";
import geohash from "ngeohash";
import { useEffect, useReducer } from "react";
import { GEOHASH_LENGTH } from "../constants";
import ky from "../ky";

type State = {
  data?: Tornado[];
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
    key.startsWith("$") ? key.substring(1) : key,
    key.startsWith("$") && value ? new Date(value as string) : value,
  ]);

  return Object.fromEntries(entries as any);
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
      const [resultCanada, resultUnitedStates] = await Promise.all<
        TupleTornado[],
        TupleTornado[]
      >([
        ky(`${url}?country=ca`, {
          timeout: 60000,
        }).json(),
        ky(`${url}?country=us`, {
          timeout: 60000,
        }).json(),
      ]);

      const results = [...resultCanada, ...resultUnitedStates].map(
        ([id, coordinates_start, coordinates_end, $date, fujita, location]) => {
          const length_m =
            typeof coordinates_end[0] === "number" &&
            typeof coordinates_end[1] === "number"
              ? haversine(
                  { lat: coordinates_start[0], lon: coordinates_start[1] },
                  { lat: coordinates_end[0], lon: coordinates_end[1] }
                )
              : undefined;

          return {
            id,
            coordinates_start,
            coordinates_end,
            $date,
            fujita,
            geohash: geohash.encode(
              coordinates_start[0],
              coordinates_start[1],
              GEOHASH_LENGTH
            ),
            length_m,
            location,
          };
        }
      );

      dispatch({
        type: "success",
        data: results.map(parseObject),
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
