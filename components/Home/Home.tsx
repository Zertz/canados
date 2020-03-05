import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useTornados } from "../../hooks/useTornados";
import TornadoEvents from "../TornadoEvents";
import styles from "./Home.module.css";

const TornadoTracks = dynamic(() => import("../TornadoTracks"), { ssr: false });

function Home() {
  const [filter, setFilter] = useState("");
  const [order, setOrder] = useState<Common.Order>("desc");
  const [sortProperty, setSortProperty] = useState<keyof TornadoEvent>("date");
  const [tornado, setTornado] = useState<TornadoEvent>();

  const { error, load, loading, tornados } = useTornados({
    order,
    sortProperty
  });

  useEffect(() => {
    load();
  }, []);

  const handleChange = e => {
    setFilter(e.target.value.trim());
  };

  const handleClick = e => {
    if (!Array.isArray(tornados)) {
      return;
    }

    const tornado = tornados.find(({ id }) => id === e.currentTarget.id);

    setTornado(tornado);
  };

  const handleSort = e => {
    if (e.target.dataset.type === sortProperty) {
      setOrder(order === "asc" ? "desc" : "asc");

      return;
    }

    setSortProperty(e.target.dataset.type);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Aw, snap.</div>;
  }

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
      <label className={styles.label}>
        <input className={styles.input} onChange={handleChange} type="search" />
      </label>
      {Array.isArray(tornados) && (
        <TornadoEvents
          filter={filter}
          onClick={handleClick}
          onSort={handleSort}
          tornados={tornados}
        />
      )}
      <TornadoTracks tornado={tornado} />
    </div>
  );
}

export default Home;
