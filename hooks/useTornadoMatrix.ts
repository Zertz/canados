import haversine from "fast-haversine";
import { latLngBounds } from "leaflet";
import { useEffect, useState } from "react";
import { GRID_SIZE } from "../constants";

export function useTornadoMatrix({ tornados }: { tornados?: Tornado[] }) {
  const [stats, setStats] = useState<MatrixStats>();
  const [tornadoMatrix, setTornadoMatrix] = useState<TornadoMatrix>();

  useEffect(() => {
    if (!tornados) {
      return;
    }

    const bounds = latLngBounds(
      tornados.map(({ coordinates_start }) => coordinates_start)
    );

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const width = Number((ne.lng - sw.lng).toFixed(2));
    const height = Number((ne.lat - sw.lat).toFixed(2));

    const cellWidth = width / GRID_SIZE;
    const cellHeight = height / GRID_SIZE;

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

    const matrix: TornadoMatrix = {
      columns: [...Array(GRID_SIZE)].map(() => ({
        rows: [...Array(GRID_SIZE)].map(() => ({
          tornados: new Map(),
        })),
      })),
    };

    for (let i = 0; i < tornados.length; i += 1) {
      const { coordinates_start } = tornados[i];

      const distanceToOrigin = {
        x: Number((coordinates_start[1] - sw.lng).toFixed(2)),
        y: Number((coordinates_start[0] - sw.lat).toFixed(2)),
      };

      const cell = {
        x:
          distanceToOrigin.x === width
            ? GRID_SIZE - 1
            : Math.floor(distanceToOrigin.x / cellWidth),
        y:
          distanceToOrigin.y === height
            ? GRID_SIZE - 1
            : Math.floor(distanceToOrigin.y / cellHeight),
      };

      matrix.columns[cell.x].rows[cell.y].tornados.set(
        tornados[i].id,
        tornados[i]
      );
    }

    const stats: MatrixStats = {
      density: {
        min: Infinity,
        max: -Infinity,
      },
    };

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

        stats.density.min = Math.min(stats.density.min, cell.density);
        stats.density.max = Math.max(stats.density.max, cell.density);
      }
    }

    setStats(stats);
    setTornadoMatrix(matrix);
  }, [tornados]);

  return { stats, tornadoMatrix };
}
