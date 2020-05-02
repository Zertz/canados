export function getClusterStats(
  tornados: Tornado[],
  { smallest, largest } = { smallest: 0, largest: 0 }
): ClusterStats {
  return {
    coordinates: [
      tornados.reduce(
        (acc, { coordinates_start }) => acc + coordinates_start[0],
        0
      ) / tornados.length,
      tornados.reduce(
        (acc, { coordinates_start }) => acc + coordinates_start[1],
        0
      ) / tornados.length,
    ],
    maxFujita: tornados
      .filter(({ fujita }) => fujita >= 0)
      .reduce((acc, { fujita }) => Math.max(acc, fujita), 0),
    relativeSize:
      smallest && largest
        ? ((1 - 0) / (largest - smallest)) * (tornados.length - smallest) + 0
        : 0,
  };
}
