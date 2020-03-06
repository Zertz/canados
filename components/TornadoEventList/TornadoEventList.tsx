import React from "react";
import TornadoEventListItem from "../TornadoEventListItem";
import styles from "./TornadoEventList.module.css";

type Props = {
  filter: string;
  onChangeFilter: (any) => void;
  onChangeOrder: (any) => void;
  onChangeSort: (any) => void;
  onClick: (any) => void;
  order: string;
  tornados: Array<TornadoEvent>;
};

function TornadoEventList({
  filter,
  onChangeFilter,
  onChangeOrder,
  onChangeSort,
  onClick,
  order,
  tornados
}: Props) {
  return (
    <div className={styles.div}>
      <label className={styles.label}>
        <input
          className={styles.input}
          onChange={onChangeFilter}
          type="search"
        />
      </label>
      <select
        className={styles.select}
        disabled={!!filter}
        onChange={onChangeSort}
      >
        <option value="date">Date</option>
        <option value="fujita">Fujita</option>
        <option value="location">Location</option>
      </select>
      <button
        className={styles.button}
        disabled={!!filter}
        onClick={onChangeOrder}
      >
        {order}
      </button>
      <ul className={styles.ul}>
        {tornados.map(tornado => (
          <TornadoEventListItem
            key={tornado.id}
            onClick={onClick}
            tornado={tornado}
          />
        ))}
      </ul>
    </div>
  );
}

export default TornadoEventList;
