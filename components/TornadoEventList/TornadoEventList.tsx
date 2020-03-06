import React from "react";
import TornadoEventListItem from "../TornadoEventListItem";
import styles from "./TornadoEventList.module.css";

type Props = {
  filter: string;
  onChangeSort: (any) => void;
  onClick: (any) => void;
  tornados: Array<TornadoEvent>;
};

function TornadoEventList({ filter, onChangeSort, onClick, tornados }: Props) {
  return (
    <div className={styles.div}>
      <select
        className={styles.select}
        disabled={!!filter}
        onChange={onChangeSort}
      >
        <option value="date">Date</option>
        <option value="fujita">Fujita</option>
        <option value="location">Location</option>
      </select>
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
