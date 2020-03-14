import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useBoundedTornados } from "../../hooks/useBoundedTornados";
import { useFitBounds } from "../../hooks/useFitBounds";
import { useSearch } from "../../hooks/useSearch";
import { useTornados } from "../../hooks/useTornados";
import TornadoEventList from "../TornadoEventList";
import styles from "./Home.module.css";

const TornadoTracks = dynamic(() => import("../TornadoTracks"), { ssr: false });

export default function Home() {
  const [screenBounds, setScreenBounds] = useState<Common.Bounds>();
  const [selectedTornadoId, setSelectedTornadoId] = useState<TornadoId>();
  const { error, load, tornados } = useTornados();
  const { search, searchedTornados } = useSearch({ tornados });

  const fitBounds = useFitBounds({ tornados: searchedTornados || tornados });

  const boundedTornados = useBoundedTornados({
    bounds: searchedTornados ? fitBounds : screenBounds || fitBounds,
    search: !!searchedTornados,
    tornados
  });

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return <div>Aw, snap.</div>;
  }

  const handleSelectTornado = (tornadoId: TornadoId) => () => {
    setSelectedTornadoId(tornadoId);
  };

  const displayedTornados = searchedTornados || boundedTornados;

  return (
    <div className={styles.div}>
      {Array.isArray(displayedTornados) && (
        <>
          <TornadoEventList
            display={searchedTornados ? "search" : "bounds"}
            onClick={handleSelectTornado}
            search={search}
            selectedTornadoId={selectedTornadoId}
            tornados={displayedTornados}
          />
          <TornadoTracks
            fitBounds={fitBounds}
            onClick={handleSelectTornado}
            selectedTornadoId={selectedTornadoId}
            setScreenBounds={setScreenBounds}
            tornados={displayedTornados}
          />
        </>
      )}
    </div>
  );
}
