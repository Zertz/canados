import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useBoundedTornados } from "../../hooks/useBoundedTornados";
import { useFitBounds } from "../../hooks/useFitBounds";
import { useSearch } from "../../hooks/useSearch";
import { useTornados } from "../../hooks/useTornados";
import LoadingOverlay from "../LoadingOverlay";
import TornadoEventList from "../TornadoEventList";
import styles from "./Home.module.css";

const TornadoTracks = dynamic(() => import("../TornadoTracks"), { ssr: false });

export default function Home() {
  const [screenBounds, setScreenBounds] = useState<Common.Bounds>();
  const [selectedTornadoId, setSelectedTornadoId] = useState<TornadoId>();
  const { error, load, tornados } = useTornados();
  const { results, search, status } = useSearch({ tornados });

  const fitBounds = useFitBounds({
    tornados: status === "done" ? results : tornados
  });

  const boundedTornados = useBoundedTornados({
    bounds: status === "done" ? fitBounds : screenBounds || fitBounds,
    search: status === "done",
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

  const displayedTornados = ["searching", "done"].includes(status)
    ? results
    : boundedTornados;

  return (
    <div className={styles.div}>
      {Array.isArray(displayedTornados) && (
        <>
          <TornadoEventList
            onClick={handleSelectTornado}
            search={search}
            selectedTornadoId={selectedTornadoId}
            status={status}
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
      {status === "searching" && (
        <LoadingOverlay
          title="Searching..."
          subtitle="This may take a few moments."
        />
      )}
    </div>
  );
}
