import haversine from "fast-haversine";
import { SEARCH_DISTANCE } from "../constants";

const ctx: Worker = self as any;

let dataCache: Tornado[];

ctx.addEventListener("message", (e) => {
  const { action, payload } = JSON.parse(e.data);

  switch (action) {
    case "search": {
      const filteredResults = dataCache.filter(({ coordinates_start }) =>
        payload.some(
          ([lat, lon]) =>
            haversine(
              { lat: coordinates_start[0], lon: coordinates_start[1] },
              { lat, lon }
            ) <= SEARCH_DISTANCE
        )
      );

      ctx.postMessage(JSON.stringify(filteredResults));

      break;
    }
    case "store": {
      dataCache = payload;

      break;
    }
    default: {
      throw new Error("Unsupported action");
    }
  }
});
