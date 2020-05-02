export function getClusterStats(tornados: Tornado[]): ClusterStats {
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
  };
}
