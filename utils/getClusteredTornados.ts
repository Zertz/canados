import { GEOHASH_LENGTH, MAXIMUM_DISPLAYED_TORNADOS } from "../constants";
import { shuffle } from "./shuffle";

export function getClusteredTornados({
  tornados,
}: {
  tornados: TornadoEvent[];
}) {
  if (tornados.length <= MAXIMUM_DISPLAYED_TORNADOS) {
    return tornados.map((tornado) => ({
      ...tornado,
      cluster: [],
    }));
  }

  const clusteredTornadoIds = new Set<TornadoId>();
  const clusters: TornadoEvent[][] = [];

  // Cluster tornados by their geohash, from closest to furthest
  for (let i = GEOHASH_LENGTH; i > 0; i -= 1) {
    const geohashClusters: { [key: string]: TornadoEvent[] } = {};

    for (let j = 0; j < tornados.length; j += 1) {
      if (clusteredTornadoIds.has(tornados[j].id)) {
        continue;
      }

      const geohash = tornados[j].geohash.substring(0, i);

      if (!Array.isArray(geohashClusters[geohash])) {
        geohashClusters[geohash] = [];
      }

      geohashClusters[geohash].push(tornados[j]);
    }

    const currentClusters = Object.values(geohashClusters).filter(
      (cluster) => cluster.length > Math.ceil(tornados.length / 650)
    );

    for (let j = 0; j < currentClusters.length - 1; j += 1) {
      currentClusters[j].forEach(({ id }) => clusteredTornadoIds.add(id));
      clusters.push(currentClusters[j]);
    }
  }

  // Split larger clusters in half until a target number is reached
  while (MAXIMUM_DISPLAYED_TORNADOS - clusters.length > 0) {
    const unwindCount = MAXIMUM_DISPLAYED_TORNADOS - clusters.length;
    const largestClusters: [number, number][] = [];

    for (let i = 0; i < clusters.length; i += 1) {
      const clusterLength = clusters[i].length;

      if (clusterLength <= 1) {
        continue;
      }

      if (
        largestClusters.length === 0 ||
        largestClusters.some(([, length]) => length < clusterLength)
      ) {
        largestClusters.push([i, clusterLength]);
      }
    }

    if (largestClusters.length === 0) {
      break;
    }

    if (largestClusters.length > unwindCount) {
      largestClusters.sort(([, a], [, b]) => b - a).splice(unwindCount);
    }

    for (let i = 0; i < largestClusters.length; i += 1) {
      const [clusterIndex] = largestClusters[i];
      const cluster = clusters[clusterIndex];

      clusters.push(cluster.splice(0, Math.round(cluster.length / 2)));
    }
  }

  return shuffle(clusters, MAXIMUM_DISPLAYED_TORNADOS).map(cluster => ({
    ...cluster[0],
    cluster: cluster.slice(1)
  }));
}
