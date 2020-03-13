import { useEffect, useState } from "react";

type Props = {
  tornados: TornadoEvent[];
};

export const useClusteredTornados = ({ tornados }: Props) => {
  const [clusteredTornados, setClusteredTornados] = useState<
    ClusteredTornadoEvent[]
  >();

  useEffect(() => {
    if (tornados.length <= 500) {
      setClusteredTornados(
        tornados.map(tornado => ({
          ...tornado,
          cluster: 0
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
          clusteredTornado.cluster += 1;

          return acc;
        }

        return [
          ...acc,
          {
            ...tornado,
            cluster: 0
          }
        ];
      }, [])
    );
  }, [tornados]);

  return clusteredTornados;
};
