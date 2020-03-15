import { useEffect, useState } from "react";

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

    if (tornados.length <= 350) {
      setClusteredTornados(
        tornados.map(tornado => ({
          ...tornado,
          cluster: []
        }))
      );

      return;
    }

    setClusteredTornados(
      tornados.reduce((acc: ClusteredTornadoEvent[], tornado) => {
        const currentGeohash = tornado.geohash.substring(
          0,
          tornados.length >= 750 ? 3 : 4
        );

        const clusteredTornado = acc.find(({ geohash }) =>
          geohash.startsWith(currentGeohash)
        );

        if (clusteredTornado) {
          clusteredTornado.cluster.push(tornado);

          return acc;
        }

        return [
          ...acc,
          {
            ...tornado,
            cluster: []
          }
        ];
      }, [])
    );
  }, [tornados]);

  return clusteredTornados;
};
