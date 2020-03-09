import React from "react";
import TornadoEventListItem from "../TornadoEventListItem";
import styles from "./TornadoEventList.module.css";

type Props = {
  filter: string;
  onChangeFilter: (any) => void;
  onChangeOrder: (any) => void;
  onChangeSort: (any) => void;
  onClick: (tornadoId) => () => void;
  order: string;
  selectedTornadoId?: TornadoId;
  tornados: Array<TornadoEvent>;
};

function TornadoEventList({
  filter,
  onChangeFilter,
  onChangeOrder,
  onChangeSort,
  onClick,
  order,
  selectedTornadoId,
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
      <ul className={styles.ul}>
        <li className={styles.li}>
          <span>{`${tornados.length} tornados in this area`}</span>
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
        </li>
        {tornados.map(tornado => (
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
