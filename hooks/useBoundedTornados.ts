import { useEffect, useState } from "react";
import { shuffle } from "../utils/shuffle";

type Props = {
  bounds?: Common.Bounds;
  search: boolean;
  tornados?: TornadoEvent[];
};

export const useBoundedTornados = ({ bounds, search, tornados }: Props) => {
  const [boundedTornados, setBoundedTornados] = useState<TornadoEvent[]>();

  useEffect(() => {
    if (search) {
      return;
    }

    if (!bounds || !tornados) {
      setBoundedTornados(undefined);

      return;
    }

    const filteredTornados = bounds
      ? tornados.filter(({ coordinates_end, coordinates_start, tracks }) => {
          const [southWestBounds, northEastBounds] = bounds;

          if (
            coordinates_start[0] > southWestBounds[0] &&
            coordinates_start[0] < northEastBounds[0] &&
            coordinates_start[1] > southWestBounds[1] &&
            coordinates_start[1] < northEastBounds[1]
          ) {
            return true;
          }

          if (
            coordinates_end[0] &&
            coordinates_end[0] > southWestBounds[0] &&
            coordinates_end[0] < northEastBounds[0] &&
            coordinates_end[1] &&
            coordinates_end[1] > southWestBounds[1] &&
            coordinates_end[1] < northEastBounds[1]
          ) {
            return true;
          }

          if (!Array.isArray(tracks)) {
            return false;
          }

          return tracks.some(
            coordinates =>
              coordinates[0] > southWestBounds[0] &&
              coordinates[0] < northEastBounds[0] &&
              coordinates[1] > southWestBounds[1] &&
              coordinates[1] < northEastBounds[1]
          );
        })
      : tornados;

    setBoundedTornados(filteredTornados);
  }, [bounds, search, tornados]);

  return boundedTornados;
};
