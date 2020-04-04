// @ts-check
function tokenizeString(input) {
  const values = input
    .toLocaleLowerCase()
    .split(/\s/)
    .map((v) => v.trim())
    .filter(Boolean);

  const tokens = new Set();

  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];

    for (let j = 0; j < value.length; j += 1) {
      for (let k = 0; k < value.length - j - 1; k += 1) {
        tokens.add(value.slice(j, value.length - k));
      }
    }
  }

  return [...tokens].sort((a, b) => b.length - a.length || a.localeCompare(b));
}

function searchStringWithTokens(input, tokens) {
  let value = input.toLocaleLowerCase();

  return tokens
    .map((token) => {
      const split = value.split(token);

      value = split
        .filter((v) => v !== token)
        .join("")
        .trim();

      return [token, Math.floor(split.length - 1)];
    })
    .filter(([, value]) => value > 0);
}

function weighTokenMatches(tokenMatches) {
  return tokenMatches.reduce(
    (acc, [token, value]) => (acc += token.length ** token.length * value),
    0
  );
}

let dataCache;

onmessage = function (e) {
  const { action, payload } = JSON.parse(e.data);

  switch (action) {
    case "search": {
      const tokens = tokenizeString(payload);

      const entriesMatches = dataCache
        .reduce((acc, { id, ...rest }) => {
          const matchWeights = Object.values(rest)
            .map((value) => {
              if (!value) {
                return 0;
              }

              if (
                typeof value !== "string" &&
                typeof value.toString !== "function"
              ) {
                return 0;
              }

              const tokenMatches = searchStringWithTokens(
                value.toString(),
                tokens
              );

              return weighTokenMatches(tokenMatches);
            })
            .filter((weight) => weight > 0);

          if (matchWeights.length === 0) {
            return acc;
          }

          return [
            ...acc,
            [id, matchWeights.reduce((acc, weight) => (acc += weight), 0)],
          ];
        }, [])
        .sort(([, a], [, b]) => b - a)
        .filter((value, i, arr) => i < 5 || arr[i][1] >= arr[0][1] * 0.05);

      for (let i = entriesMatches.length - 1; i >= 0; i -= 1) {
        entriesMatches[i][1] =
          (100 * entriesMatches[i][1]) / entriesMatches[0][1];
      }

      const matches = Object.fromEntries(entriesMatches);

      postMessage(JSON.stringify(matches));

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
