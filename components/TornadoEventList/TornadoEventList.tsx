import React, { useEffect, useState } from "react";
import { useSortedTornados } from "../../hooks/useSortedTornados";
import SearchForm from "../SearchForm";
import TornadoEventListActions from "../TornadoEventListActions";
import TornadoEventListItem from "../TornadoEventListItem";
import styles from "./TornadoEventList.module.css";

type TornadoEventListItemsProps = {
  onClick: (tornadoId: TornadoId) => () => void;
  selectedTornadoId?: TornadoId;
  tornados: Array<TornadoEvent | SearchedTornadoEvent>;
};

type TornadoEventListProps = TornadoEventListItemsProps & {
  display: "bounds" | "search";
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
  display,
  onClick,
  search,
  selectedTornadoId,
  tornados
}: TornadoEventListProps) {
  const [filter, setFilter] = useState("");
  const [order, setOrder] = useState<Common.Order>("ascending");
  const [sortProperty, setSortProperty] = useState<Common.SortProperty>("date");

  const sortedTornados = useSortedTornados({
    order,
    sortProperty,
    tornados
  });

  useEffect(() => {
    if (display !== "search") {
      if (sortProperty === "relevance") {
        setSortProperty("date");
      }

      return;
    }

    setOrder("descending");
    setSortProperty("relevance");
  }, [display]);

  useEffect(() => {
    if (filter) {
      return;
    }

    search("");
  }, [filter]);

  const handleChangeFilter = e => {
    setFilter(e.target.value.trim());
  };

  const handleChangeOrder = () => {
    setOrder(order === "ascending" ? "descending" : "ascending");
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
      <SearchForm onChange={handleChangeFilter} onSubmit={handleSubmit} />
      <ul className="bg-white flex-grow overflow-x-hidden overflow-y-auto shadow sm:rounded-md">
        <TornadoEventListActions
          display={display}
          onChangeOrder={handleChangeOrder}
          onChangeSort={handleChangeSort}
          order={order}
          sortProperty={sortProperty}
          tornadoCount={tornados.length}
        />
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
