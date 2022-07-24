import { useCallback, useEffect, useRef, useState } from "react";
import { useVirtual } from "react-virtual";
import { useSortedTornados } from "../hooks/useSortedTornados";
import TornadoEventListFooter from "./TornadoEventListFooter";
import TornadoEventListItem from "./TornadoEventListItem";
import TornadoEventListSort from "./TornadoEventListSort";

type TornadoEventListProps = {
  onClick: (tornadoId: TornadoId) => void;
  selectedTornadoId: TornadoId | undefined;
  status: Common.Status;
  tornadoCount: number | undefined;
  tornados: Tornado[] | undefined;
};

export default function TornadoEventList({
  onClick,
  selectedTornadoId,
  status,
  tornadoCount,
  tornados,
}: TornadoEventListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

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

  const { scrollToIndex, totalSize, virtualItems } = useVirtual({
    size: tornadoCount || 0,
    parentRef,
    estimateSize: useCallback(() => 81, []),
    overscan: 10,
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

    scrollToIndex(tornadoIndex);
  }, [scrollToIndex, selectedTornadoId, tornados]);

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
          <div className="overflow-auto" ref={parentRef}>
            <div
              className="relative w-full"
              style={{ height: `${totalSize}px` }}
            >
              {virtualItems.map((virtualRow) => {
                const tornado = sortedTornados[virtualRow.index];

                return (
                  <div
                    key={virtualRow.index}
                    className={
                      virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
                    }
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <TornadoEventListItem
                      key={tornado.id}
                      date={tornado.date}
                      fujita={tornado.fujita}
                      length_m={tornado.length_m}
                      location={tornado.region_code}
                      onClick={() => onClick(tornado.id)}
                      selected={selectedTornadoId === tornado.id}
                    />
                  </div>
                );
              })}
            </div>
          </div>
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
