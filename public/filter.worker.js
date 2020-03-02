// @ts-check
function tokenizeString(string) {
  const values = string
    .toLocaleLowerCase()
    .split(/\s/)
    .map(v => v.trim())
    .filter(Boolean);

  const tokens = [];

  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];

    for (let j = 0; j < value.length; j += 1) {
      for (let k = 0; k < value.length - j - 1; k += 1) {
        tokens.push(value.slice(j, value.length - k));
      }
    }
  }

  return tokens;
}

function searchStringWithTokens(string, tokens) {
  const value = string.toString().toLocaleLowerCase();

  return tokens
    .map(token => [token, Math.floor(value.split(token).length - 1)])
    .filter(([, value]) => value > 0);
}

function weighTokenMatches(tokenMatches) {
  return tokenMatches.reduce(
    (acc, [token, value]) => (acc += token.length ** token.length * value),
    0
  );
}

const store = {};

onmessage = function(e) {
  console.time("onmessage");
  const { action, payload } = JSON.parse(e.data);

  switch (action) {
    case "filter": {
      const { filter, type } = payload;
      const data = store[type];

      const tokens = tokenizeString(filter);

      const entriesMatches = data
        .reduce((acc, { id, ...tornado }) => {
          const matchWeights = Object.values(tornado)
            .map(value => {
              if (!value) {
                return 0;
              }

              if (
                typeof value !== "string" &&
                typeof value.toString !== "function"
              ) {
                return 0;
              }

              const tokenMatches = searchStringWithTokens(value, tokens);

              return weighTokenMatches(tokenMatches);
            })
            .filter(weight => weight > 0);

          if (matchWeights.length === 0) {
            return acc;
          }

          return [
            ...acc,
            [id, matchWeights.reduce((acc, weight) => (acc += weight), 0)]
          ];
        }, [])
        .sort(([, a], [, b]) => b - a)
        .filter((value, i, arr) => i < 25 || arr[i][1] === arr[24][1]);

      const matches = Object.fromEntries(entriesMatches);
      const matchKeys = Object.keys(matches);

      const filteredData = data
        .filter(({ id }) => matches[id])
        .sort((a, b) => matchKeys.indexOf(a.id) - matchKeys.indexOf(b.id));

      postMessage(JSON.stringify(filteredData));

      break;
    }
    case "store": {
      store[payload.type] = payload.data;

      break;
    }
    default: {
      throw new Error("Unsupported action");
    }
  }
  console.timeEnd("onmessage");
};
