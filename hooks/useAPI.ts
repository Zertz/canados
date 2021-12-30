import haversine from "fast-haversine";
import ky from "ky";
import { useEffect, useReducer } from "react";

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
        status: "error",
      };
    }
    case "request": {
      return {
        data: undefined,
        error: undefined,
        status: "loading",
      };
    }
    case "success": {
      return {
        data: action.data,
        error: undefined,
        status: "ready",
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

export const useAPI = (url: string) => {
  const [{ data, error, status }, dispatch] = useReducer(reducer, {
    data: undefined,
    error: undefined,
    status: "idle",
  });

  const load = async () => {
    dispatch({ type: "request" });

    try {
      const countries = {
        CA: {
          nextPage: 1,
        },
        "CA-NTP": {
          nextPage: 1,
        },
        US: {
          nextPage: 1,
        },
      };

      let data: TupleTornado[] = [];

      do {
        const response = await Promise.all(
          Object.entries(countries).map(([country, meta]) =>
            Number.isInteger(meta.nextPage)
              ? ky(`${url}?country=${country}&page=${meta.nextPage}`).json()
              : [meta]
          )
        );

        const [
          [canadaMeta, ...canadaData],
          [canadaNTPMeta, ...canadaNTPData],
          [unitedStatesMeta, ...unitedStatesData],
        ] = response as [
          { nextPage: number; total: number },
          ...TupleTornado[]
        ][];

        countries.CA = canadaMeta;
        countries["CA-NTP"] = canadaNTPMeta;
        countries.US = unitedStatesMeta;

        data = data.concat(canadaData, canadaNTPData, unitedStatesData);
      } while (
        Object.values(countries).some(({ nextPage }) =>
          Number.isInteger(nextPage)
        )
      );

      const results = data.map(
        ([
          id,
          coordinates_start,
          coordinates_end,
          $date,
          fujita,
          country_code,
          region_code,
        ]) => {
          const hasEnd =
            typeof coordinates_end[0] === "number" &&
            typeof coordinates_end[1] === "number";

          const length_m = hasEnd
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
            length_m,
            country_code,
            region_code,
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
