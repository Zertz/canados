import { useEffect, useState } from "react";

function getFitBounds(filteredTornados: TornadoEvent[]): Common.Bounds {
  const fitBounds = filteredTornados.reduce(
    (
      [southWestBounds, northEastBounds],
      { coordinates_end, coordinates_start }
    ) => [
      [
        min(southWestBounds[0], coordinates_start[0], coordinates_end[0]),
        min(southWestBounds[1], coordinates_start[1], coordinates_end[1])
      ],
      [
        max(northEastBounds[0], coordinates_start[0], coordinates_end[0]),
        max(northEastBounds[1], coordinates_start[1], coordinates_end[1])
      ]
    ],
    [[], []]
  );

  return fitBounds as Common.Bounds;
}

function max(...values: any[]): number {
  return values.reduce(
    (acc, value) => (typeof value === "number" && value > acc ? value : acc),
    -Infinity
  );
}

function min(...values: any[]): number {
  return values.reduce(
    (acc, value) => (typeof value === "number" && value < acc ? value : acc),
    Infinity
  );
}

type Props = {
  tornados?: TornadoEvent[];
};

export const useFitBounds = ({ tornados }: Props) => {
  const [fitBounds, setFitBounds] = useState<Common.Bounds>();

  useEffect(() => {
    if (!Array.isArray(tornados) || tornados.length === 0) {
      setFitBounds(undefined);

      return;
    }

    const fitBounds = getFitBounds(tornados);

    if (JSON.stringify(fitBounds[0]) === JSON.stringify(fitBounds[1])) {
      setFitBounds([
        [(fitBounds[0][0] -= 0.1), (fitBounds[0][1] -= 0.1)],
        [(fitBounds[1][0] += 0.1), (fitBounds[1][1] += 0.1)]
      ]);

      return;
    }

    setFitBounds(fitBounds);
  }, [tornados]);

  return fitBounds;
};
