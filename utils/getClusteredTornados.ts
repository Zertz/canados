import { GEOHASH_LENGTH, MAXIMUM_DISPLAYED_TORNADOS } from "../constants";

export function getClusteredTornados({ tornados }: { tornados: Tornado[] }) {
  if (tornados.length <= MAXIMUM_DISPLAYED_TORNADOS) {
    return tornados.map((tornado) => ({
      ...tornado,
      cluster: [],
    }));
  }

  let clusteredTornados: ClusteredTornado[] = [];

  // 1. Compute geohash map starting at full geohash length
  // 2. Cluster tornados and, if the threshold is reached, start over with shorter geohash
  // 3. Split largest clusters in half until threshold is reached

  for (let i = GEOHASH_LENGTH; i > 0; i -= 1) {
    const clusteredTornadoIds = new Set<TornadoId>();
    const geohashMap = new Map<string, Set<string>>();

    for (let j = 0; j < tornados.length; j += 1) {
      const tornado = tornados[j];

      const geohashStart = tornado.geohashStart.substring(0, i);

      let set: ReturnType<typeof geohashMap.get>;

      if ((set = geohashMap.get(geohashStart))) {
        set.add(tornado.id);
      } else {
        geohashMap.set(geohashStart, new Set([tornado.id]));
      }
    }

    for (let j = 0; j < tornados.length; j += 1) {
      if (clusteredTornados.length > MAXIMUM_DISPLAYED_TORNADOS) {
        clusteredTornados = [];

        break;
      }

      if (clusteredTornadoIds.has(tornados[j].id)) {
        continue;
      }

      const clusteredTornadoIndex =
        clusteredTornados.push({
          ...tornados[j],
          cluster: [],
        }) - 1;

      const clusteredTornado = clusteredTornados[clusteredTornadoIndex];

      clusteredTornadoIds.add(clusteredTornado.id);

      const geohashStart = clusteredTornado.geohashStart.substring(0, i);

      let geohashSet: ReturnType<typeof geohashMap.get>;

      if ((geohashSet = geohashMap.get(geohashStart))) {
        if (geohashSet.size > 1) {
          clusteredTornado.cluster = [
            ...new Set([...clusteredTornado.cluster, ...geohashSet]),
          ].filter((id) => id !== clusteredTornado.id);
        }

        geohashMap.delete(geohashStart);
      }

      for (let k = 0; k < clusteredTornado.cluster.length; k += 1) {
        clusteredTornadoIds.add(clusteredTornado.cluster[k]);
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
      const { cluster } = clusteredTornados[clusterIndex];

      const [unclusteredTornadoId, ...unclusteredTornadoIds] = cluster.splice(
        0,
        Math.round(cluster.length / 2)
      );

      const tornado = tornados.find(({ id }) => id === unclusteredTornadoId);

      if (!tornado) {
        throw Error();
      }

      clusteredTornados.push({
        ...tornado,
        cluster: unclusteredTornadoIds.slice(1),
      });
    }
  }

  return clusteredTornados;
}
