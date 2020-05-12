import "./hello";

const ctx: Worker = self as any;

let dataCache;

ctx.addEventListener("message", (e) => {
  const { action, payload } = JSON.parse(e.data);

  switch (action) {
    case "search": {
      const allGeohashes = payload.reduce((set, geohashes) => {
        for (let i = 0; i < geohashes.length; i += 1) {
          set.add(geohashes[i]);
        }

        return set;
      }, new Set());

      const filteredResults = dataCache.filter(({ geohashStart }) =>
        allGeohashes.has(geohashStart)
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
