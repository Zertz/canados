import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useBoundedTornados } from "../../hooks/useBoundedTornados";
import { useFitBounds } from "../../hooks/useFitBounds";
import { useTornados } from "../../hooks/useTornados";
import TornadoEventList from "../TornadoEventList";
import styles from "./Home.module.css";

const TornadoTracks = dynamic(() => import("../TornadoTracks"), { ssr: false });

export default function Home() {
  const [bounds, setBounds] = useState<Common.Bounds>();
  const [selectedTornado, setSelectedTornado] = useState<TornadoEvent>();
  const { error, load, search, tornados } = useTornados();
  const fitBounds = useFitBounds({ tornados });

  const boundedTornados = useBoundedTornados({ bounds, tornados });

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return <div>Aw, snap.</div>;
  }

  const handleClick = (tornadoId: TornadoId) => () => {
    if (!Array.isArray(boundedTornados)) {
      return;
    }

    const tornado = boundedTornados.find(({ id }) => id === tornadoId);

    setSelectedTornado(tornado);
  };

  return (
    <div className={styles.div}>
      <Head>
        <link
          crossOrigin=""
          href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          rel="stylesheet"
        />
      </Head>
      {Array.isArray(boundedTornados) && (
        <>
          <TornadoEventList
            onClick={handleClick}
            search={search}
            selectedTornadoId={selectedTornado ? selectedTornado.id : undefined}
            tornados={boundedTornados}
          />
          <TornadoTracks
            fitBounds={fitBounds}
            onClick={handleClick}
            selectedTornado={selectedTornado}
            setBounds={setBounds}
            tornados={boundedTornados}
          />
        </>
      )}
    </div>
  );
}
