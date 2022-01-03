import { LatLng } from "leaflet";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "../hooks/useSearchParams";
import { useTornados } from "../hooks/useTornados";
import Controls from "./Controls";
import LoadingOverlay from "./LoadingOverlay";
import SearchForm from "./SearchForm";
import TornadoEventList from "./TornadoEventList";
import TornadoEventListFilters from "./TornadoEventListFilters";

const TornadoTracks = dynamic(() => import("./TornadoTracks"), { ssr: false });

type RangeFilter = [number, number];

const getCleanQuery = (query = "") => query.trim().replace(/\s\s+/g, " ");

export default function Home() {
  const [screenBounds, setScreenBounds] = useState<Common.Bounds>();

  const [{ c, f, m, q, t: selectedTornadoId, y, z }, setSearchParams] =
    useSearchParams({
      c: "",
      f: Array.from(Array(6))
        .map((_, i) => `${i}`)
        .join("_"),
      m: Array.from(Array(12))
        .map((_, i) => `${i}`)
        .join("_"),
      q: "",
      t: "",
      y: "1950_2021",
      z: "",
    });

  const setCenter = useCallback(
    (c: LatLng, z: number) => {
      setSearchParams({
        c: `${c.lat.toFixed(6)}_${c.lng.toFixed(6)}`,
        z: `${z}`,
      });
    },
    [setSearchParams]
  );

  const center = useMemo(() => {
    if (!c) {
      return;
    }

    const [rawLat, rawLng] = c.split("_");

    const lat = Number(rawLat);
    const lng = Number(rawLng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return;
    }

    return {
      lat: Number(lat),
      lng: Number(lng),
    };
  }, [c]);

  const fujitaFilter = useMemo(() => {
    return f.split("_", 6).map((n) => Number(n));
  }, [f]);

  const monthFilter = useMemo(() => {
    return m
      .split("_", 12)
      .map((n) => Number(n))
      .sort((a, b) => a - b);
  }, [m]);

  const query = useMemo(() => getCleanQuery(q), [q]);

  const yearFilter = useMemo(() => {
    return y.split("_", 2).map((n) => Number(n)) as RangeFilter;
  }, [y]);

  const zoom = useMemo(() => Number(z) || undefined, [z]);

  const { apiStatus, fitBounds, search, searchStatus, tornadoCount, tornados } =
    useTornados({
      fujitaFilter,
      monthFilter,
      yearFilter,
      screenBounds,
    });

  const toggleFujita = useCallback(
    (fujita: number) => {
      setSearchParams({
        f: fujitaFilter.includes(fujita)
          ? fujitaFilter.filter((v) => v !== fujita).join("_")
          : fujitaFilter
              .concat(fujita)
              .sort((a, b) => a - b)
              .join("_"),
      });
    },
    [fujitaFilter, setSearchParams]
  );

  const toggleMonth = useCallback(
    (monthIndex: number) => {
      setSearchParams({
        m: monthFilter.includes(monthIndex)
          ? monthFilter.filter((v) => v !== monthIndex).join("_")
          : monthFilter
              .concat(monthIndex)
              .sort((a, b) => a - b)
              .join("_"),
      });
    },
    [monthFilter, setSearchParams]
  );

  const setSelectedTornadoId = useCallback(
    (selectedTornadoId: TornadoId) => {
      setSearchParams({
        t: selectedTornadoId,
      });
    },
    [setSearchParams]
  );

  const setQuery = useCallback(
    (q: string) => {
      setSearchParams({
        q: getCleanQuery(q),
      });
    },
    [setSearchParams]
  );

  const setYearFilter = useCallback(
    (y: [number, number]) => {
      setSearchParams({
        y: y.join("_"),
      });
    },
    [setSearchParams]
  );

  const setZoom = useCallback(
    (z: number) => {
      setSearchParams({
        z: `${z}`,
      });
    },
    [setSearchParams]
  );

  return (
    <div className="grid grid-rows-[1fr] grid-cols-[500px,1fr] absolute inset-0">
      <a
        href="https://github.com/Zertz/canados"
        className="bg-white border-2 border-white rounded-full w-10 h-10 fixed bottom-4 left-4 z-20"
        title="Contribute on GitHub"
      >
        <svg viewBox="0 0 16 16" version="1.1">
          <path
            fillRule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
      </a>
      <Controls>
        <SearchForm query={query} search={search} setQuery={setQuery} />
        <div className="flex flex-col bg-white overflow-hidden rounded-md shadow-md">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-4 text-gray-800">
            <TornadoEventListFilters
              fujitaFilter={fujitaFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}
              setYearFilter={setYearFilter}
              toggleFujita={toggleFujita}
              toggleMonth={toggleMonth}
            />
          </div>
          <TornadoEventList
            onClick={setSelectedTornadoId}
            selectedTornadoId={selectedTornadoId}
            status={searchStatus}
            tornadoCount={tornadoCount}
            tornados={tornados}
          />
        </div>
      </Controls>
      <TornadoTracks
        center={center}
        fitBounds={fitBounds}
        onClick={setSelectedTornadoId}
        searchStatus={searchStatus}
        selectedTornadoId={selectedTornadoId}
        setCenter={setCenter}
        setScreenBounds={setScreenBounds}
        tornados={tornados}
        zoom={zoom}
      />
      {[apiStatus, searchStatus].includes("error") && (
        <LoadingOverlay
          title="Aw, snap."
          subtitle="Something twisted happened, try refreshing the page."
        />
      )}
      {apiStatus === "loading" && (
        <LoadingOverlay
          title="Loading..."
          subtitle="This may take a few moments."
        />
      )}
      {searchStatus === "loading" && (
        <LoadingOverlay
          title="Searching..."
          subtitle="This may take a few moments."
        />
      )}
    </div>
  );
}
