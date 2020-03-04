import React, { useState } from "react";
import TornadoEvents from "../components/TornadoEvents";
import TornadoTracks from "../components/TornadoTracks";

function HomePage() {
  const [filter, setFilter] = useState("");
  const [tornadoId, setTornadoId] = useState<TornadoId>();

  const handleChange = e => {
    setFilter(e.target.value.trim());
  };

  const handleClick = e => {
    setTornadoId(e.currentTarget.id);
  };

  return (
    <div>
      <label>
        <input onChange={handleChange} type="search" />
      </label>
      <TornadoTracks tornadoId={tornadoId} />
      <TornadoEvents filter={filter} onClick={handleClick} />
    </div>
  );
}

export default HomePage;
