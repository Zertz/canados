import React, { useEffect, useRef, useState } from "react";
import { FixedSizeList } from "react-window";
import { useSortedTornados } from "../hooks/useSortedTornados";
import TornadoEventListFooter from "./TornadoEventListFooter";
import TornadoEventListItem from "./TornadoEventListItem";
import TornadoEventListSort from "./TornadoEventListSort";

type CommonProps = {
  onClick: (tornadoId: TornadoId) => void;
  selectedTornadoId?: TornadoId;
};

type TornadoEventListProps = CommonProps & {
  status: Common.Status;
  tornadoCount?: number;
  tornados?: Tornado[];
};

type FixedSizeListRowProps = CommonProps & {
  sortedTornados: Tornado[];
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
      location={tornado.region_code}
      onClick={() => onClick(tornado.id)}
      selected={selectedTornadoId === tornado.id}
      style={style}
    />
  );
};

const itemKey = (index, data: FixedSizeListRowProps) =>
  data.sortedTornados[index].id;

export default function TornadoEventList({
  onClick,
  selectedTornadoId,
  status,
  tornadoCount,
  tornados,
}: TornadoEventListProps) {
  const listRef = useRef<FixedSizeList>(null);

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
    if (!selectedTornadoId) {
      return;
    }

    const tornadoIndex = tornados?.findIndex(
      ({ id }) => id === selectedTornadoId
    );

    if (!tornadoIndex || tornadoIndex < 0) {
      return;
    }

    listRef.current?.scrollToItem(tornadoIndex);
  }, [selectedTornadoId, tornados]);

  useEffect(() => {
    switch (status) {
      case "idle": {
        setListState("collapsed");

        break;
      }
      case "loading": {
        break;
      }
      case "ready": {
        setListState("expanded");
        setOrder("descending");

        break;
      }
    }
  }, [status]);

  const handleChangeListState = () => {
    setListState(listState === "collapsed" ? "expanded" : "collapsed");
  };

  const handleChangeOrder = () => {
    setOrder(order === "ascending" ? "descending" : "ascending");
  };

  const handleChangeSort = (e) => {
    setSortProperty(e.target.value);
  };

  return (
    <>
      {listState === "expanded" && Array.isArray(sortedTornados) && (
        <>
          <div className="border-b border-gray-200 p-4 text-gray-800">
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
            ref={listRef}
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
    </>
  );
}
