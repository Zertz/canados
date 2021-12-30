import dynamic from "next/dynamic";
import { useState } from "react";
import { useSearchParamState } from "../hooks/useSearchParamState";
import { useTornados } from "../hooks/useTornados";
import Controls from "./Controls";
import LoadingOverlay from "./LoadingOverlay";
import SearchForm from "./SearchForm";
import TornadoEventList from "./TornadoEventList";
import TornadoEventListFilters from "./TornadoEventListFilters";

const TornadoTracks = dynamic(() => import("./TornadoTracks"), { ssr: false });

type RangeFilter = [number, number];

const encodeRangeFilter = (v: RangeFilter | undefined) =>
  v ? `${v[0]}_${v[1]}` : "";

const decodeRangeFilter =
  (defaultMin: number, defaultMax: number) =>
  (value: string): RangeFilter => {
    if (!value) {
      return [defaultMin, defaultMax];
    }

    const [min, max] = value.split("_");

    return [Number(min) || defaultMin, Number(max) || defaultMax];
  };

const string = (v?: string) => v || undefined;

export default function Home() {
  const [screenBounds, setScreenBounds] = useState<Common.Bounds>();

  const [fujitaFilter, setFujitaFilter] = useSearchParamState<[number, number]>(
    "f",
    encodeRangeFilter,
    decodeRangeFilter(0, 5)
  );

  const [monthFilter, setMonthFilter] = useSearchParamState<[number, number]>(
    "m",
    encodeRangeFilter,
    decodeRangeFilter(0, 11)
  );

  const [yearFilter, setYearFilter] = useSearchParamState<[number, number]>(
    "y",
    encodeRangeFilter,
    decodeRangeFilter(1950, 2021)
  );

  const [selectedTornadoId, setSelectedTornadoId] =
    useSearchParamState<TornadoId>("t", string, string);

  const { apiStatus, fitBounds, search, searchStatus, tornadoCount, tornados } =
    useTornados({
      fujitaFilter,
      monthFilter,
      yearFilter,
      screenBounds,
    });

  const handleSelectTornado = (selectedTornadoId: TornadoId) => () => {
    setSelectedTornadoId(selectedTornadoId);
  };

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
        <SearchForm search={search} />
        <div className="flex flex-col bg-white overflow-hidden rounded-md shadow-md">
          <div className="border-b border-gray-200 p-4 text-gray-800">
            <TornadoEventListFilters
              fujitaFilter={fujitaFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}
              setFujitaFilter={setFujitaFilter}
              setMonthFilter={setMonthFilter}
              setYearFilter={setYearFilter}
            />
          </div>
          <TornadoEventList
            onClick={handleSelectTornado}
            selectedTornadoId={selectedTornadoId}
            status={searchStatus}
            tornadoCount={tornadoCount}
            tornados={tornados}
          />
        </div>
      </Controls>
      <TornadoTracks
        fitBounds={fitBounds}
        onClick={handleSelectTornado}
        searchStatus={searchStatus}
        selectedTornadoId={selectedTornadoId}
        setScreenBounds={setScreenBounds}
        tornados={tornados}
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
