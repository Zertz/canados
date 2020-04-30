import { GEOHASH_LENGTH, MAXIMUM_DISPLAYED_TORNADOS } from "../constants";

function getClusterStats(tornado: Tornado, cluster: Tornado[]) {
  const divider = cluster.length + 1;

  return {
    averageFujita:
      (tornado.fujita + cluster.reduce((acc, { fujita }) => acc + fujita, 0)) /
      divider,
    coordinates: [
      (tornado.coordinates_start[0] +
        cluster.reduce(
          (acc, { coordinates_start }) => acc + coordinates_start[0],
          0
        )) /
        divider,
      (tornado.coordinates_start[1] +
        cluster.reduce(
          (acc, { coordinates_start }) => acc + coordinates_start[1],
          0
        )) /
        divider,
    ],
  } as ClusterStats;
}

export function getClusteredTornados({ tornados }: { tornados: Tornado[] }) {
  if (tornados.length <= MAXIMUM_DISPLAYED_TORNADOS) {
    return tornados.map((tornado) => ({
      ...tornado,
      cluster: [],
      clusterStats: getClusterStats(tornado, []),
    }));
  }

  // 1. Compute geohash map starting at full geohash length
  // 2. Cluster tornados and, if the threshold is reached, start over with shorter geohash
  // 3. Split largest clusters in half until threshold is reached

  let clusteredTornados: ClusteredTornado[] = [];

  for (let i = GEOHASH_LENGTH; i > 0; i -= 1) {
    const geohashMap = new Map<string, ClusteredTornado>();

    for (let j = 0; j < tornados.length; j += 1) {
      const tornado = tornados[j];

      const geohashStart = `${
        tornado.location
      }-${tornado.geohashStart.substring(0, i)}`;

      let clusteredTornado: ReturnType<typeof geohashMap.get>;

      if ((clusteredTornado = geohashMap.get(geohashStart))) {
        clusteredTornado.cluster.push(tornado);
      } else {
        geohashMap.set(geohashStart, {
          ...tornado,
          cluster: [],
          clusterStats: getClusterStats(tornado, []),
        });

        if (geohashMap.size > MAXIMUM_DISPLAYED_TORNADOS) {
          break;
        }
      }

      if (j === tornados.length - 1) {
        clusteredTornados = [...geohashMap.values()];
      }
    }

    if (clusteredTornados.length > 0) {
      break;
    }
  }

  while (MAXIMUM_DISPLAYED_TORNADOS - clusteredTornados.length > 0) {
    const unwindCount = MAXIMUM_DISPLAYED_TORNADOS - clusteredTornados.length;
    const largestClusters: [number, number][] = [];

    for (let i = 0; i < clusteredTornados.length; i += 1) {
      const clusterLength = clusteredTornados[i].cluster.length;

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
      const tornado = clusteredTornados[clusterIndex];

      const [
        unclusteredTornado,
        ...unclusteredTornados
      ] = tornado.cluster.splice(0, Math.round(tornado.cluster.length / 2));

      clusteredTornados.push({
        ...unclusteredTornado,
        cluster: unclusteredTornados,
        clusterStats: getClusterStats(unclusteredTornado, []),
      });
    }
  }

  for (let i = 0; i < clusteredTornados.length; i += 1) {
    clusteredTornados[i].clusterStats = getClusterStats(
      clusteredTornados[i],
      clusteredTornados[i].cluster
    );
  }

  return clusteredTornados;
}
