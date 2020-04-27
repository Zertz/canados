import dynamic from "next/dynamic";
import React, { useState } from "react";
import { FilterContext } from "../../contexts/filter";
import { useSearchParamState } from "../../hooks/useSearchParamState";
import { useTornados } from "../../hooks/useTornados";
import LoadingOverlay from "../LoadingOverlay";
import TornadoEventList from "../TornadoEventList";
import styles from "./Home.module.css";

const TornadoTracks = dynamic(() => import("../TornadoTracks"), { ssr: false });

const encodeScreenBounds = (v?: Common.Bounds) =>
  v
    ? `${v[0][0].toFixed(6)}*${v[0][1].toFixed(6)}_${v[1][0].toFixed(
        6
      )}*${v[1][1].toFixed(6)}`
    : undefined;

const decodeScreenBounds = (value?: string): Common.Bounds | undefined => {
  if (!value) {
    return;
  }

  const [sw, ne] = value.split("_");

  const [sw1, sw2] = sw.split("*");
  const [ne1, ne2] = ne.split("*");

  return [
    [Number(sw1), Number(sw2)],
    [Number(ne1), Number(ne2)],
  ];
};

type FujitaFilter = [number, number];

const encodeFujitaFilter = (v: FujitaFilter | undefined) =>
  v ? `${v[0]}_${v[1]}` : "";

const decodeFujitaFilter = (value: string): FujitaFilter => {
  if (!value) {
    return [0, 5];
  }

  const [min, max] = value.split("_");

  return [Number(min), Number(max)];
};

export default function Home() {
  const [screenBounds, setScreenBounds] = useSearchParamState<Common.Bounds>(
    "b",
    encodeScreenBounds,
    decodeScreenBounds
  );

  const [fujitaFilter, setFujitaFilter] = useSearchParamState<[number, number]>(
    "f",
    encodeFujitaFilter,
    decodeFujitaFilter
  );

  const [selectedTornadoId, setSelectedTornadoId] = useSearchParamState<
    TornadoId
  >("t", String, String);

  const {
    apiStatus,
    bounds,
    clusteredTornados,
    error,
    search,
    searchStatus,
    tornadoCount,
    tornados,
    // @ts-ignore
  } = useTornados({ fujitaFilter, screenBounds });

  if (error) {
    return <div>Aw, snap.</div>;
  }

  const handleSelectTornado = (selectedTornadoId: TornadoId) => () => {
    setSelectedTornadoId(selectedTornadoId);
  };

  return (
    // @ts-ignore
    <FilterContext.Provider value={{ fujitaFilter, setFujitaFilter }}>
      <div className={styles.div}>
        <a
          href="https://github.com/Zertz/canados"
          className={styles.a}
          title="Contribute on GitHub"
        >
          <svg className={styles.svg} viewBox="0 0 16 16" version="1.1">
            <path
              fillRule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            ></path>
          </svg>
        </a>
        <TornadoEventList
          onClick={handleSelectTornado}
          search={search}
          selectedTornadoId={selectedTornadoId}
          status={searchStatus}
          tornadoCount={tornadoCount}
          tornados={tornados}
        />
        <TornadoTracks
          fitBounds={bounds}
          onClick={handleSelectTornado}
          selectedTornadoId={selectedTornadoId}
          setScreenBounds={setScreenBounds}
          tornados={clusteredTornados}
        />
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
    </FilterContext.Provider>
  );
}
