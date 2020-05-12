export function getBounds(tornados: Tornado[]): Common.Bounds {
  const bounds = tornados.reduce(
    ([southWestBounds, northEastBounds], { coordinates_start }) => [
      [
        min(southWestBounds[0], coordinates_start[0]),
        min(southWestBounds[1], coordinates_start[1]),
      ],
      [
        max(northEastBounds[0], coordinates_start[0]),
        max(northEastBounds[1], coordinates_start[1]),
      ],
    ],
    [[], []]
  );

  return bounds as Common.Bounds;
}

function max(...values: any[]): number {
  return values.reduce((acc, value) => (value > acc ? value : acc), -Infinity);
}

function min(...values: any[]): number {
  return values.reduce((acc, value) => (value < acc ? value : acc), Infinity);
}
