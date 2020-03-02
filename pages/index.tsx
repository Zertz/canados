import React, { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useTornados } from "../hooks/useTornados";
import Table from "../components/Table";

function HomePage() {
  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 250);
  const [order, setOrder] = useState<Common.Order>("desc");
  const [sortProperty, setSortProperty] = useState<keyof Tornado>("date");

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

  const handleSort = e => {
    if (e.target.dataset.type === sortProperty) {
      setOrder(order === "asc" ? "desc" : "asc");

      return;
    }

    setSortProperty(e.target.dataset.type);
  };

  return (
    <div>
      <label>
        <input onChange={handleChange} type="search" />
      </label>
      {loading && <div>Loading...</div>}
      {error && <div>Aw, snap.</div>}
      {tornados && (
        <Table
          data={tornados}
          filter={debouncedFilter}
          onSort={handleSort}
          type="tornados"
        />
      )}
    </div>
  );
}

export default HomePage;
