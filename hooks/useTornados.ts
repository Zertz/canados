import { useEffect, useState } from "react";
import { useAPI } from "./useAPI";

function tokenizeString(input: string) {
  const values = input
    .toLocaleLowerCase()
    .split(/\s/)
    .map(v => v.trim())
    .filter(Boolean);

  const tokens = new Set<string>();

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

function searchStringWithTokens(input: string, tokens: string[]) {
  let value = input.toLocaleLowerCase();

  return tokens
    .map(token => {
      const split = value.split(token);

      value = split
        .filter(v => v !== token)
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

export const useTornados = () => {
  const [tornados, setTornados] = useState<TornadoEvent[] | undefined>();

  const { data, error, load, loading } = useAPI("/api/tornados");

  useEffect(() => {
    setTornados(data);
  }, [data]);

  const search = filter => {
    if (!data) {
      return;
    }

    if (!filter) {
      setTornados(data);

      return;
    }

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

            const tokenMatches = searchStringWithTokens(
              value.toString(),
              tokens
            );

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
      .filter((value, i, arr) => arr[i][1] >= arr[0][1] * 0.125);

    const matches = Object.fromEntries(entriesMatches);
    const matchKeys = Object.keys(matches);

    setTornados(
      data
        .filter(({ id }) => matches[id])
        .sort((a, b) => matchKeys.indexOf(a.id) - matchKeys.indexOf(b.id))
    );
  };

  return {
    error,
    load,
    loading,
    search,
    tornados
  };
};
