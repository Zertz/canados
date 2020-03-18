import { useAPI } from "./useAPI";
import { useBoundedTornados } from "./useBoundedTornados";
import { useClusteredTornados } from "./useClusteredTornados";
import { useFitBounds } from "./useFitBounds";
import { useSearch } from "./useSearch";

type Props = {
  screenBounds?: Common.Bounds;
};

export function useTornados({ screenBounds }: Props) {
  const { data: tornados, error, load, status: apiStatus } = useAPI(
    "/api/tornados"
  );

  const { results, search, status: searchStatus } = useSearch({ tornados });

  const fitBounds = useFitBounds({
    tornados: searchStatus === "done" ? results : tornados
  });

  const boundedTornados = useBoundedTornados({
    bounds: searchStatus === "done" ? fitBounds : screenBounds || fitBounds,
    search: searchStatus === "done",
    tornados
  });

  const displayedTornados = ["busy", "done"].includes(searchStatus)
    ? results
    : boundedTornados;

  const clusteredTornados = useClusteredTornados({
    tornados: displayedTornados
  });

  return {
    clusteredTornados,
    displayedTornados,
    error,
    fitBounds,
    load,
    search,
    status: searchStatus
  };
}
