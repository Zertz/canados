import { GEOHASH_LENGTH, MAXIMUM_DISPLAYED_TORNADOS } from "../constants";

export function getClusteredTornados({
  tornados
}: {
  tornados: TornadoEvent[];
}) {
  if (tornados.length <= MAXIMUM_DISPLAYED_TORNADOS) {
    return tornados.map(tornado => ({
      ...tornado,
      cluster: []
    }));
  }

  const clusteredTornadoIds: TornadoId[] = [];
  const clusters: TornadoEvent[][] = [];

  for (let i = GEOHASH_LENGTH; i > 0; i -= 1) {
    const geohashClusters: { [key: string]: TornadoEvent[] } = {};

    for (let j = 0; j < tornados.length; j += 1) {
      if (clusteredTornadoIds.includes(tornados[j].id)) {
        continue;
      }

      const geohash = tornados[j].geohash.substring(0, i);

      if (!Array.isArray(geohashClusters[geohash])) {
        geohashClusters[geohash] = [];
      }

      geohashClusters[geohash].push(tornados[j]);
    }

    const currentClusters = Object.values(geohashClusters).filter(
      cluster => cluster.length > 3
    );

    for (let j = 0; j < currentClusters.length - 1; j += 1) {
      clusteredTornadoIds.push(...currentClusters[j].map(({ id }) => id));

      if (
        clusters.length + tornados.length - clusteredTornadoIds.length <=
        MAXIMUM_DISPLAYED_TORNADOS
      ) {
        clusters.push(...currentClusters[j].map(cluster => [cluster]));
      } else {
        clusters.push(currentClusters[j]);
      }
    }
  }

  return clusters.map(cluster => ({
    ...cluster[0],
    cluster: cluster.slice(1)
  }));
}
