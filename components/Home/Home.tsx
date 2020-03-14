import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useBoundedTornados } from "../../hooks/useBoundedTornados";
import { useFitBounds } from "../../hooks/useFitBounds";
import { useTornados } from "../../hooks/useTornados";
import TornadoEventList from "../TornadoEventList";
import styles from "./Home.module.css";

const TornadoTracks = dynamic(() => import("../TornadoTracks"), { ssr: false });

export default function Home() {
  const [screenBounds, setScreenBounds] = useState<Common.Bounds>();
  const [selectedTornadoId, setSelectedTornadoId] = useState<TornadoId>();
  const { error, load, search, tornados } = useTornados();

  const fitBounds = useFitBounds({ tornados });

  const boundedTornados = useBoundedTornados({
    bounds: screenBounds || fitBounds,
    tornados
  });

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return <div>Aw, snap.</div>;
  }

  const handleClick = (tornadoId: TornadoId) => () => {
    setSelectedTornadoId(tornadoId);
  };

  return (
    <div className={styles.div}>
      {Array.isArray(boundedTornados) && (
        <>
          <TornadoEventList
            onClick={handleClick}
            search={search}
            selectedTornadoId={selectedTornadoId}
            tornados={boundedTornados}
          />
          <TornadoTracks
            fitBounds={fitBounds}
            onClick={handleClick}
            selectedTornadoId={selectedTornadoId}
            setScreenBounds={setScreenBounds}
            tornados={boundedTornados}
          />
        </>
      )}
    </div>
  );
}
