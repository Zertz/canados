import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { useSortedTornados } from "../../hooks/useSortedTornados";
import SearchForm from "../SearchForm";
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
  const [order, setOrder] = useState<Common.Order>("ascending");
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
      <ul
        className={classnames(
          "bg-white flex-grow shadow sm:rounded-md",
          styles.ul
        )}
      >
        <li
          className={classnames(
            "bg-white border-b border-gray-200 px-4 py-2 text-gray-800",
            styles.li
          )}
        >
          <span>{`${tornados.length} tornados in this area`}</span>
          <select
            className="block form-select  transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            disabled={!!filter}
            onChange={handleChangeSort}
          >
            <option value="date">Date</option>
            <option value="distance">Distance</option>
            <option value="fujita">Fujita</option>
            <option value="location">Location</option>
          </select>
          <span className="inline-flex rounded-md shadow-sm">
            <button
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
              disabled={!!filter}
              onClick={handleChangeOrder}
              title={order}
              type="button"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h5a1 1 0 000-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3zm10 5a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">{order}</span>
            </button>
          </span>
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
