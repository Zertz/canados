import { useEffect, useState } from "react";
import { useAPI } from "./useAPI";
import { useDebounce } from "./useDebounce";

function getSortFunction(order, sortProperty) {
  switch (sortProperty) {
    case "date": {
      return (a, b) =>
        order === "asc"
          ? a.date - b.date ||
            a.fujita - b.fujita ||
            a.province.localeCompare(b.province) ||
            a.community.localeCompare(b.community)
          : b.date - a.date ||
            b.fujita - a.fujita ||
            b.province.localeCompare(a.province) ||
            b.community.localeCompare(a.community);
    }
    case "fujita": {
      return (a, b) =>
        order === "asc"
          ? a.fujita - b.fujita ||
            a.date - b.date ||
            a.province.localeCompare(b.province) ||
            a.community.localeCompare(b.community)
          : b.fujita - a.fujita ||
            b.date - a.date ||
            b.province.localeCompare(a.province) ||
            b.community.localeCompare(a.community);
    }
    case "location": {
      return (a, b) =>
        order === "asc"
          ? a.province.localeCompare(b.province) ||
            a.community.localeCompare(b.community) ||
            a.date - b.date ||
            a.fujita - b.fujita
          : b.province.localeCompare(a.province) ||
            b.community.localeCompare(a.community) ||
            b.date - a.date ||
            b.fujita - a.fujita;
    }
  }
}

let worker;

export const useTornados = ({
  bounds,
  filter,
  order,
  sortProperty
}: {
  bounds?: Common.Bounds;
  filter: string;
  order: Common.Order;
  sortProperty: Common.SortProperty;
}) => {
  const debouncedFilter = useDebounce(filter, 200);
  const [filtering, setFiltering] = useState(false);
  const [tornados, setTornados] = useState<TornadoEvent[] | null>();
  const { data, error, load, loading } = useAPI("/api/tornados");

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!worker) {
      worker = new Worker("filter.worker.js");

      worker.onmessage = e => {
        if (!e.isTrusted) {
          return;
        }

        try {
          setTornados(JSON.parse(e.data));
        } catch {
          setTornados(data);
        } finally {
          setFiltering(false);
        }
      };
    }

    worker.postMessage(
      JSON.stringify({ action: "store", payload: { data, type: "tornados" } })
    );

    return () => {
      worker.terminate();
    };
  }, [data]);

  useEffect(() => {
    if (!debouncedFilter) {
      // Sort sorts the elements of an array in place so we can safely assume data is already sorted
      setTornados(data);

      return;
    }

    setFiltering(true);

    worker.postMessage(
      JSON.stringify({
        action: "filter",
        payload: { filter: debouncedFilter, type: "tornados" }
      })
    );
  }, [debouncedFilter]);

  useEffect(() => {
    if (!data) {
      setTornados(null);

      return;
    }

    const filteredTornados = bounds
      ? data.filter(({ coordinates_end, coordinates_start, tracks }) => {
          const [latBounds, lngBounds] = bounds;

          if (
            coordinates_start[0] > latBounds[0] &&
            coordinates_start[0] < latBounds[1] &&
            coordinates_start[1] > lngBounds[0] &&
            coordinates_start[1] < lngBounds[1]
          ) {
            return true;
          }

          if (
            coordinates_end[0] &&
            coordinates_end[0] > latBounds[0] &&
            coordinates_end[0] < latBounds[1] &&
            coordinates_end[1] &&
            coordinates_end[1] > lngBounds[0] &&
            coordinates_end[1] < lngBounds[1]
          ) {
            return true;
          }

          if (!Array.isArray(tracks)) {
            return false;
          }

          return tracks.some(
            coordinates =>
              coordinates[0] > latBounds[0] &&
              coordinates[0] < latBounds[1] &&
              coordinates[1] > lngBounds[0] &&
              coordinates[1] < lngBounds[1]
          );
        })
      : data;

    const sortFunction = getSortFunction(order, sortProperty);

    // Sort sorts the elements of an array in place so we have to shallow copy to trigger a change
    const sortedTornados = [...filteredTornados.sort(sortFunction)];

    setTornados(sortedTornados);
  }, [bounds, data, order, sortProperty]);

  return {
    error,
    load,
    loading,
    tornados
  };
};
