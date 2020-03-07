import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useTornados } from "../../hooks/useTornados";
import TornadoEventList from "../TornadoEventList";
import styles from "./Home.module.css";

const TornadoTracks = dynamic(() => import("../TornadoTracks"), { ssr: false });

function Home() {
  const [bounds, setBounds] = useState<Common.Bounds>();
  const [filter, setFilter] = useState("");
  const [order, setOrder] = useState<Common.Order>("asc");
  const [sortProperty, setSortProperty] = useState<Common.SortProperty>("date");
  const [selectedTornado, setSelectedTornado] = useState<TornadoEvent>();

  const { error, load, loading, tornados } = useTornados({
    bounds,
    filter,
    order,
    sortProperty
  });

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Aw, snap.</div>;
  }

  const handleChangeBounds = (bounds: Common.Bounds) => {
    setBounds(bounds);
  };

  const handleChangeFilter = e => {
    setFilter(e.target.value.trim());
  };

  const handleChangeOrder = e => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  const handleChangeSort = e => {
    setSortProperty(e.target.value);
  };

  const handleClick = (tornadoId: TornadoId) => () => {
    if (!Array.isArray(tornados)) {
      return;
    }

    const tornado = tornados.find(({ id }) => id === tornadoId);

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
      {Array.isArray(tornados) && (
        <>
          <TornadoEventList
            filter={filter}
            onChangeFilter={handleChangeFilter}
            onChangeOrder={handleChangeOrder}
            onChangeSort={handleChangeSort}
            onClick={handleClick}
            order={order}
            selectedTornadoId={selectedTornado ? selectedTornado.id : undefined}
            tornados={tornados}
          />
          <TornadoTracks
            onChangeBounds={handleChangeBounds}
            onClick={handleClick}
            selectedTornado={selectedTornado}
            tornados={tornados}
          />
        </>
      )}
    </div>
  );
}

export default Home;
