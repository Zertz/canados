import { GEOHASH_LENGTH, MAXIMUM_DISPLAYED_TORNADOS } from "../constants";
import { getClusterStats } from "./getClusterStats";

export function getClusteredTornados({ tornados }: { tornados: Tornado[] }) {
  if (tornados.length <= MAXIMUM_DISPLAYED_TORNADOS) {
    return tornados.map((tornado) => ({
      ...tornado,
      cluster: [],
      clusterStats: getClusterStats([tornado]),
    }));
  }

  // 1. Compute geohash map starting at full geohash length
  // 2. Cluster tornados and, if the threshold is reached, start over with shorter geohash

  let clusteredTornados: ClusteredTornado[] = [];

  for (let i = GEOHASH_LENGTH; i > 0; i -= 1) {
    const geohashMap = new Map<string, ClusteredTornado>();

    for (let j = 0; j < tornados.length; j += 1) {
      const tornado = tornados[j];

      const geohashStart = `${tornado.country_code}-${
        tornado.region_code
      }-${tornado.geohashStart.substring(0, i)}`;

      let clusteredTornado: ReturnType<typeof geohashMap.get>;

      if ((clusteredTornado = geohashMap.get(geohashStart))) {
        clusteredTornado.cluster.push(tornado);
      } else {
        geohashMap.set(geohashStart, {
          ...tornado,
          cluster: [],
          clusterStats: getClusterStats([tornado]),
        });

        if (geohashMap.size > MAXIMUM_DISPLAYED_TORNADOS && i > 1) {
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

  const clusterSizes = {
    smallest: Infinity,
    largest: -Infinity,
  };

  // TODO: There's probably a way to avoid having to loop again
  for (let i = 0; i < clusteredTornados.length; i += 1) {
    const clusterSize = clusteredTornados[i].cluster.length + 1;

    if (clusterSize < clusterSizes.smallest) {
      clusterSizes.smallest = clusterSize;
    }

    if (clusterSize > clusterSizes.largest) {
      clusterSizes.largest = clusterSize;
    }
  }

  for (let i = 0; i < clusteredTornados.length; i += 1) {
    clusteredTornados[i].clusterStats = getClusterStats(
      [clusteredTornados[i], ...clusteredTornados[i].cluster],
      clusterSizes
    );
  }

  return clusteredTornados;
}
