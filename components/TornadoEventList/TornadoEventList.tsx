import React, { useEffect, useState } from "react";
import { useSortedTornados } from "../../hooks/useSortedTornados";
import TornadoEventListItem from "../TornadoEventListItem";
import styles from "./TornadoEventList.module.css";

type TornadoEventListItemsProps = {
  onClick: (tornadoId: TornadoId) => () => void;
  selectedTornadoId?: TornadoId;
  tornados: Array<TornadoEvent>;
};

type TornadoEventListProps = TornadoEventListItemsProps & {
  search: (string) => void;
};

const TornadoEventListItems = React.memo(function TornadoEventListItems({
  onClick,
  selectedTornadoId,
  tornados
}: TornadoEventListItemsProps) {
  return (
    <>
      {tornados.map(tornado => (
        <TornadoEventListItem
          key={tornado.id}
          community={tornado.community}
          date={tornado.date}
          fujita={tornado.fujita}
          length_m={tornado.length_m}
          onClick={onClick(tornado.id)}
          province={tornado.province}
          selected={selectedTornadoId === tornado.id}
        />
      ))}
    </>
  );
});

export default function TornadoEventList({
  onClick,
  search,
  selectedTornadoId,
  tornados
}: TornadoEventListProps) {
  const [filter, setFilter] = useState("");
  const [order, setOrder] = useState<Common.Order>("asc");
  const [sortProperty, setSortProperty] = useState<Common.SortProperty>("date");

  const sortedTornados = useSortedTornados({
    filter,
    order,
    sortProperty,
    tornados
  });

  useEffect(() => {
    if (filter) {
      return;
    }

    search("");
  }, [filter]);

  const handleChangeFilter = e => {
    setFilter(e.target.value.trim());
  };

  const handleChangeOrder = e => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  const handleChangeSort = e => {
    setSortProperty(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    search(filter);
  };

  return (
    <div className={styles.div}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          <input
            className={styles.input}
            onChange={handleChangeFilter}
            type="search"
          />
        </label>
        <button type="submit">Search</button>
      </form>
      <ul className={styles.ul}>
        <li className={styles.li}>
          <span>{`${tornados.length} tornados in this area`}</span>
          <select
            className={styles.select}
            disabled={!!filter}
            onChange={handleChangeSort}
          >
            <option value="date">Date</option>
            <option value="distance">Distance</option>
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
        {Array.isArray(sortedTornados) && (
          <TornadoEventListItems
            onClick={onClick}
            selectedTornadoId={selectedTornadoId}
            tornados={sortedTornados}
          />
        )}
      </ul>
    </div>
  );
}
