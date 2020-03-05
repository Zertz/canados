import React, { useState } from "react";
import TornadoEvents from "../TornadoEvents";
import TornadoTracks from "../TornadoTracks";
import styles from "./Home.module.css";

function Home() {
  const [filter, setFilter] = useState("");
  const [tornadoId, setTornadoId] = useState<TornadoId>();

  const handleChange = e => {
    setFilter(e.target.value.trim());
  };

  const handleClick = e => {
    setTornadoId(e.currentTarget.id);
  };

  return (
    <div className={styles.div}>
      <label className={styles.label}>
        <input className={styles.input} onChange={handleChange} type="search" />
      </label>
      <TornadoEvents filter={filter} onClick={handleClick} />
      <TornadoTracks tornadoId={tornadoId} />
    </div>
  );
}

export default Home;
