import React, { useState } from "react";
import TornadoEvents from "../components/TornadoEvents";

function HomePage() {
  const [filter, setFilter] = useState("");

  const handleChange = e => {
    setFilter(e.target.value.trim());
  };

  return (
    <div>
      <label>
        <input onChange={handleChange} type="search" />
      </label>
      <TornadoEvents filter={filter} />
    </div>
  );
}

export default HomePage;
