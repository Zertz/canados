import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useTornados } from "../../hooks/useTornados";
import TornadoEventList from "../TornadoEventList";
import styles from "./Home.module.css";

const TornadoTracks = dynamic(() => import("../TornadoTracks"), { ssr: false });

function Home() {
  const [filter, setFilter] = useState("");
  const [order, setOrder] = useState<Common.Order>("asc");
  const [sortProperty, setSortProperty] = useState<Common.SortProperty>("date");
  const [tornado, setTornado] = useState<TornadoEvent>();

  const { error, load, loading, tornados } = useTornados({
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

  const handleChangeSort = e => {
    setSortProperty(e.target.value);
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
      <label className={styles.label}>
        <input className={styles.input} onChange={handleChange} type="search" />
      </label>
      {Array.isArray(tornados) && (
        <TornadoEventList
          filter={filter}
          onClick={handleClick}
          onChangeSort={handleChangeSort}
          tornados={tornados}
        />
      )}
      <TornadoTracks tornado={tornado} />
    </div>
  );
}

export default Home;
