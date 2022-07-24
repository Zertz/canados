import haversine from "fast-haversine";
import { useContext, useMemo } from "react";
import { DataContext } from "../pages";

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

export const useAPI = () => {
  const preloadedData = useContext(DataContext);

  const data = useMemo<Tornado[]>(() => {
    if (!preloadedData) {
      return [];
    }

    return preloadedData.map(
      ([
        id,
        coordinates_start,
        coordinates_end,
        date,
        fujita,
        country_code,
        region_code,
      ]) => {
        const hasEnd =
          typeof coordinates_end[0] === "number" &&
          typeof coordinates_end[1] === "number";

        const length_m = hasEnd
          ? (haversine(
              { lat: coordinates_start[0], lon: coordinates_start[1] },
              { lat: coordinates_end[0], lon: coordinates_end[1] }
            ) as number)
          : undefined;

        return {
          id,
          coordinates_start,
          coordinates_end: [
            typeof coordinates_end[0] === "number" ? coordinates_end[0] : null,
            typeof coordinates_end[1] === "number" ? coordinates_end[1] : null,
          ],
          date: new Date(date),
          fujita,
          length_m,
          country_code,
          region_code,
        };
      }
    );
  }, [preloadedData]);

  return {
    data,
  };
};
