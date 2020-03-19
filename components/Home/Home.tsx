import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useTornados } from "../../hooks/useTornados";
import LoadingOverlay from "../LoadingOverlay";
import TornadoEventList from "../TornadoEventList";
import styles from "./Home.module.css";

const TornadoTracks = dynamic(() => import("../TornadoTracks"), { ssr: false });

export default function Home() {
  const [screenBounds, setScreenBounds] = useState<Common.Bounds>();
  const [selectedTornadoId, setSelectedTornadoId] = useState<TornadoId>();

  const {
    apiStatus,
    boundedTornados,
    clusteredTornados,
    error,
    fitBounds,
    search,
    searchStatus,
    tornadoCount
  } = useTornados({ screenBounds });

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
        status={searchStatus}
        tornadoCount={tornadoCount}
        tornados={boundedTornados}
      />
      <TornadoTracks
        fitBounds={fitBounds}
        onClick={handleSelectTornado}
        selectedTornadoId={selectedTornadoId}
        setScreenBounds={setScreenBounds}
        tornados={clusteredTornados}
      />
      {apiStatus === "busy" && (
        <LoadingOverlay
          title="Loading..."
          subtitle="This may take a few moments."
        />
      )}
      {searchStatus === "busy" && (
        <LoadingOverlay
          title="Searching..."
          subtitle="This may take a few moments."
        />
      )}
    </div>
  );
}
