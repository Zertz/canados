import React, { useState } from "react";
import { useSortedTornados } from "../../hooks/useSortedTornados";
import TornadoEventListItem from "../TornadoEventListItem";
import styles from "./TornadoEventList.module.css";

type Props = {
  filter: string;
  onChangeFilter: (any) => void;
  onClick: (tornadoId) => () => void;
  selectedTornadoId?: TornadoId;
  tornados: Array<TornadoEvent>;
};

function TornadoEventList({
  filter,
  onChangeFilter,
  onClick,
  selectedTornadoId,
  tornados
}: Props) {
  const [order, setOrder] = useState<Common.Order>("asc");
  const [sortProperty, setSortProperty] = useState<Common.SortProperty>("date");

  const sortedTornados = useSortedTornados({ order, sortProperty, tornados });

  if (!sortedTornados) {
    return <div>Sorting...</div>;
  }

  const handleChangeOrder = e => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  const handleChangeSort = e => {
    setSortProperty(e.target.value);
  };

  return (
    <div className={styles.div}>
      <label className={styles.label}>
        <input
          className={styles.input}
          onChange={onChangeFilter}
          type="search"
        />
      </label>
      <ul className={styles.ul}>
        <li className={styles.li}>
          <span>{`${sortedTornados.length} tornados in this area`}</span>
          <select
            className={styles.select}
            disabled={!!filter}
            onChange={handleChangeSort}
          >
            <option value="date">Date</option>
            <option value="fujita">Fujita</option>
            <option value="location">Location</option>
          </select>
          <button
            className={styles.button}
            disabled={!!filter}
            onClick={handleChangeOrder}
          >
            {order}
          </button>
        </li>
        {sortedTornados.map(tornado => (
          <TornadoEventListItem
            key={tornado.id}
            onClick={onClick(tornado.id)}
            selected={selectedTornadoId === tornado.id}
            tornado={tornado}
          />
        ))}
      </ul>
    </div>
  );
}

export default TornadoEventList;
