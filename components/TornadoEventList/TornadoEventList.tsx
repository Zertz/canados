import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { FixedSizeList } from "react-window";
import { useSortedTornados } from "../../hooks/useSortedTornados";
import SearchForm from "../SearchForm";
import TornadoEventListFilter from "../TornadoEventListFilter";
import TornadoEventListFooter from "../TornadoEventListFooter/TornadoEventListFooter";
import TornadoEventListItem from "../TornadoEventListItem";
import TornadoEventListSort from "../TornadoEventListSort";
import styles from "./TornadoEventList.module.css";

type CommonProps = {
  onClick: (tornadoId: TornadoId) => () => void;
  selectedTornadoId?: TornadoId;
};

type TornadoEventListProps = CommonProps & {
  search: (string) => void;
  status: Common.Status;
  tornadoCount?: number;
  tornados?: Array<Tornado | SearchedTornado>;
};

type FixedSizeListRowProps = CommonProps & {
  sortedTornados: Array<Tornado | SearchedTornado>;
};

const FixedSizeListRow = ({
  data: { onClick, selectedTornadoId, sortedTornados },
  index,
  style,
}: {
  data: FixedSizeListRowProps;
  index: number;
  style: React.CSSProperties;
}) => {
  const tornado = sortedTornados[index];

  return (
    <TornadoEventListItem
      key={tornado.id}
      date={tornado.date as Date}
      fujita={tornado.fujita}
      length_m={tornado.length_m}
      location={tornado.location}
      onClick={onClick(tornado.id)}
      selected={selectedTornadoId === tornado.id}
      style={style}
    />
  );
};

const itemKey = (index, data: FixedSizeListRowProps) =>
  data.sortedTornados[index].id;

export default function TornadoEventList({
  onClick,
  search,
  selectedTornadoId,
  status,
  tornadoCount,
  tornados,
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
    tornados,
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
      case "loading": {
        break;
      }
      case "ready": {
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

  const handleChangeFilter = (e) => {
    setFilter(e.target.value.trim());
  };

  const handleChangeListState = () => {
    setListState(listState === "collapsed" ? "expanded" : "collapsed");
  };

  const handleChangeOrder = () => {
    setOrder(order === "ascending" ? "descending" : "ascending");
  };

  const handleChangeSort = (e) => {
    setSortProperty(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    search(filter);
  };

  return (
    <div className={styles.div}>
      <SearchForm onChange={handleChangeFilter} onSubmit={handleSubmit} />
      <div className="flex flex-col bg-white overflow-hidden rounded-md shadow-md">
        <div
          className={classnames("border-b border-gray-200 p-4 text-gray-800")}
        >
          <TornadoEventListFilter />
        </div>
        {listState === "expanded" && Array.isArray(sortedTornados) && (
          <>
            <div
              className={classnames(
                "border-b border-gray-200 p-4 text-gray-800"
              )}
            >
              <TornadoEventListSort
                onChangeOrder={handleChangeOrder}
                onChangeSort={handleChangeSort}
                order={order}
                sortProperty={sortProperty}
                status={status}
              />
            </div>
            <FixedSizeList
              height={window.innerHeight}
              innerElementType="ul"
              itemCount={sortedTornados.length}
              itemData={{
                onClick,
                selectedTornadoId,
                sortedTornados,
              }}
              itemKey={itemKey}
              itemSize={81}
              width={"100%"}
            >
              {FixedSizeListRow}
            </FixedSizeList>
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
      </div>
    </div>
  );
}
