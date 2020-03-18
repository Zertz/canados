import { useEffect, useState } from "react";
import { getFitBounds } from "../utils/getFitBounds";

type Props = {
  tornados?: TornadoEvent[];
};

export const useFitBounds = ({ tornados }: Props) => {
  const [fitBounds, setFitBounds] = useState<Common.Bounds>();

  useEffect(() => {
    if (!Array.isArray(tornados) || tornados.length === 0) {
      setFitBounds(undefined);

      return;
    }

    const fitBounds = getFitBounds(tornados);

    if (JSON.stringify(fitBounds[0]) === JSON.stringify(fitBounds[1])) {
      setFitBounds([
        [(fitBounds[0][0] -= 0.1), (fitBounds[0][1] -= 0.1)],
        [(fitBounds[1][0] += 0.1), (fitBounds[1][1] += 0.1)]
      ]);

      return;
    }

    setFitBounds(fitBounds);
  }, [tornados]);

  return fitBounds;
};
