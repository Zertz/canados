// @ts-check
let dataCache;

onmessage = function (e) {
  const { action, payload } = JSON.parse(e.data);

  switch (action) {
    case "search": {
      postMessage(JSON.stringify(dataCache));

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
};
