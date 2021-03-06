import haversine from "fast-haversine";
import { latLngBounds } from "leaflet";
import { useEffect, useState } from "react";
import { MAXIMUM_DISPLAYED_TORNADOS } from "../constants";

const getGridSize = (tornados: number) => {
  if (tornados <= MAXIMUM_DISPLAYED_TORNADOS) {
    return { x: 1, y: 1 };
  }

  return { x: 24, y: 24 };
};

export function useTornadoMatrix(tornados?: Tornado[]) {
  const [tornadoMatrix, setTornadoMatrix] = useState<TornadoMatrix>();

  useEffect(() => {
    if (!tornados) {
      return;
    }

    const gridSize = getGridSize(tornados.length);

    const matrix: TornadoMatrix = {
      columns: [...Array(gridSize.x)].map(() => ({
        rows: [...Array(gridSize.y)].map(() => ({
          tornados: new Map(),
        })),
      })),
      count: tornados.length,
      density: {
        min: Infinity,
        max: -Infinity,
      },
    };

    if (tornados.length === 0) {
      setTornadoMatrix(matrix);

      return;
    }

    const bounds = latLngBounds(
      tornados.map(({ coordinates_start }) => coordinates_start)
    );

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const width = Number((ne.lng - sw.lng).toFixed(2));
    const height = Number((ne.lat - sw.lat).toFixed(2));

    const cellWidth = width / gridSize.x;
    const cellHeight = height / gridSize.y;

    const cellWidthKilometers =
      haversine(
        { lat: sw.lat, lon: sw.lng },
        { lat: sw.lat, lon: sw.lng + cellWidth }
      ) / 1000;

    const cellHeightKilometers =
      haversine(
        { lat: sw.lat, lon: sw.lng },
        { lat: sw.lat + cellHeight, lon: sw.lng }
      ) / 1000;

    const cellAreaKilometers = cellWidthKilometers * cellHeightKilometers;

    for (let i = 0; i < tornados.length; i += 1) {
      const { coordinates_start } = tornados[i];

      const distanceToOrigin = {
        x: Number((coordinates_start[1] - sw.lng).toFixed(2)),
        y: Number((coordinates_start[0] - sw.lat).toFixed(2)),
      };

      const cell = {
        x:
          distanceToOrigin.x === width
            ? gridSize.x - 1
            : Math.floor(distanceToOrigin.x / cellWidth),
        y:
          distanceToOrigin.y === height
            ? gridSize.y - 1
            : Math.floor(distanceToOrigin.y / cellHeight),
      };

      matrix.columns[cell.x].rows[cell.y].tornados.set(
        tornados[i].id,
        tornados[i]
      );
    }

    for (let i = 0; i < matrix.columns.length; i += 1) {
      const column = matrix.columns[i];

      for (let j = 0; j < column.rows.length; j += 1) {
        const cell = column.rows[j];

        if (cell.tornados.size === 0) {
          continue;
        }

        cell.bounds = latLngBounds(
          [...cell.tornados.values()].map(
            ({ coordinates_start }) => coordinates_start
          )
        );

        cell.density = cell.tornados.size / cellAreaKilometers;

        matrix.density.min = Math.min(matrix.density.min, cell.density);
        matrix.density.max = Math.max(matrix.density.max, cell.density);
      }
    }

    setTornadoMatrix(matrix);
  }, [tornados]);

  return tornadoMatrix;
}
