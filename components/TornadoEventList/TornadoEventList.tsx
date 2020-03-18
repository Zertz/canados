import React, { useEffect, useState } from "react";
import { useSortedTornados } from "../../hooks/useSortedTornados";
import SearchForm from "../SearchForm";
import TornadoEventListFooter from "../TornadoEventListFooter/TornadoEventListFooter";
import TornadoEventListHeader from "../TornadoEventListHeader";
import TornadoEventListItem from "../TornadoEventListItem";
import styles from "./TornadoEventList.module.css";

type CommonProps = {
  onClick: (tornadoId: TornadoId) => () => void;
  selectedTornadoId?: TornadoId;
};

type TornadoEventListItemsProps = CommonProps & {
  tornados: Array<ClusteredTornadoEvent | SearchedTornadoEvent>;
};

type TornadoEventListProps = CommonProps & {
  search: (string) => void;
  status: Common.Status;
  tornadoCount?: number;
  tornados?: Array<ClusteredTornadoEvent | SearchedTornadoEvent>;
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
          clusterCount={"cluster" in tornado ? tornado.cluster.length : 0}
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
  status,
  tornadoCount,
  tornados
}: TornadoEventListProps) {
  const [filter, setFilter] = useState("");

  const [listState, setListState] = useState<"collapsed" | "expanded">(
    "collapsed"
  );

  const [order, setOrder] = useState<Common.Order>("ascending");
  const [sortProperty, setSortProperty] = useState<Common.SortProperty>("date");

  const sortedTornados = useSortedTornados({
    order,
    sortProperty,
    tornados
  });

  useEffect(() => {
    switch (status) {
      case "idle": {
        setListState("collapsed");

        if (sortProperty === "relevance") {
          setSortProperty("date");
        }

        break;
      }
      case "busy": {
        break;
      }
      case "done": {
        setListState("expanded");
        setOrder("descending");
        setSortProperty("relevance");

        break;
      }
    }
  }, [status]);

  useEffect(() => {
    if (filter) {
      return;
    }

    search("");
  }, [filter]);

  const handleChangeFilter = e => {
    setFilter(e.target.value.trim());
  };

  const handleChangeListState = () => {
    setListState(listState === "collapsed" ? "expanded" : "collapsed");
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
      <ul className="bg-white overflow-x-hidden overflow-y-auto shadow sm:rounded-md">
        {listState === "expanded" && (
          <>
            <TornadoEventListHeader
              onChangeOrder={handleChangeOrder}
              onChangeSort={handleChangeSort}
              order={order}
              sortProperty={sortProperty}
              status={status}
            />
            {Array.isArray(sortedTornados) && (
              <TornadoEventListItems
                onClick={onClick}
                selectedTornadoId={selectedTornadoId}
                tornados={sortedTornados}
              />
            )}
          </>
        )}
        {typeof tornadoCount === "number" && (
          <TornadoEventListFooter
            listState={listState}
            onChangeListState={handleChangeListState}
            status={status}
            tornadoCount={tornadoCount}
          />
        )}
      </ul>
    </div>
  );
}
