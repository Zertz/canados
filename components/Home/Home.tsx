import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useTornados } from "../../hooks/useTornados";
import LoadingOverlay from "../LoadingOverlay";
import TornadoEventList from "../TornadoEventList";
import styles from "./Home.module.css";

const TornadoTracks = dynamic(() => import("../TornadoTracks"), { ssr: false });

export default function Home() {
  const [screenBounds, setScreenBounds] = useState<Common.Bounds>();
  const [selectedTornadoId, setSelectedTornadoId] = useState<TornadoId>();

  const {
    clusteredTornados,
    displayedTornados,
    error,
    fitBounds,
    load,
    search,
    status
  } = useTornados({ screenBounds });

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return <div>Aw, snap.</div>;
  }

  const handleSelectTornado = (tornadoId: TornadoId) => () => {
    setSelectedTornadoId(tornadoId);
  };

  return (
    <div className={styles.div}>
      <TornadoEventList
        onClick={handleSelectTornado}
        search={search}
        selectedTornadoId={selectedTornadoId}
        status={status}
        tornadoCount={
          Array.isArray(displayedTornados)
            ? displayedTornados.length
            : undefined
        }
        tornados={clusteredTornados}
      />
      <TornadoTracks
        fitBounds={fitBounds}
        onClick={handleSelectTornado}
        selectedTornadoId={selectedTornadoId}
        setScreenBounds={setScreenBounds}
        tornados={clusteredTornados}
      />
      {!Array.isArray(clusteredTornados) && (
        <LoadingOverlay
          title="Loading..."
          subtitle="This may take a few moments."
        />
      )}
      {status === "busy" && (
        <LoadingOverlay
          title="Searching..."
          subtitle="This may take a few moments."
        />
      )}
    </div>
  );
}
