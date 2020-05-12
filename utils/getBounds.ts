export function getBounds(tornados: Tornado[]): Common.Bounds {
  const bounds = tornados.reduce(
    ([southWestBounds, northEastBounds], { coordinates_start }) => [
      [
        Math.min(southWestBounds[0], coordinates_start[0]),
        Math.min(southWestBounds[1], coordinates_start[1]),
      ],
      [
        Math.max(northEastBounds[0], coordinates_start[0]),
        Math.max(northEastBounds[1], coordinates_start[1]),
      ],
    ],
    [
      [Infinity, Infinity],
      [-Infinity, -Infinity],
    ]
  );

  return bounds as Common.Bounds;
}
