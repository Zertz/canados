import { useEffect, useState } from "react";
import { GEOHASH_LENGTH, MAXIMUM_DISPLAYED_TORNADOS } from "../constants";

type Props = {
  tornados?: TornadoEvent[];
};

export const useClusteredTornados = ({ tornados }: Props) => {
  const [clusteredTornados, setClusteredTornados] = useState<
    ClusteredTornadoEvent[]
  >();

  useEffect(() => {
    if (!tornados) {
      setClusteredTornados(undefined);

      return;
    }

    if (tornados.length <= MAXIMUM_DISPLAYED_TORNADOS) {
      setClusteredTornados(
        tornados.map(tornado => ({
          ...tornado,
          cluster: []
        }))
      );

      return;
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

    setClusteredTornados(
      clusters.map(cluster => ({
        ...cluster[0],
        cluster: cluster.slice(1)
      }))
    );
  }, [tornados]);

  return clusteredTornados;
};
