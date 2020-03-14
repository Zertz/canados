import classnames from "classnames";
import React from "react";
import styles from "./TornadoEventListActions.module.css";

type Props = {
  display: "bounds" | "search";
  onChangeOrder: (e: any) => void;
  onChangeSort: (e: any) => void;
  order: Common.Order;
  sortProperty: Common.SortProperty;
  tornadoCount: number;
};

export default function({
  display,
  onChangeOrder,
  onChangeSort,
  order,
  sortProperty,
  tornadoCount
}: Props) {
  const searchMode = display === "search";

  return (
    <li
      className={classnames(
        "bg-white border-b border-gray-200 px-4 py-2 text-gray-800",
        styles.li
      )}
    >
      <span>{`${tornadoCount} tornados ${
        searchMode ? "match your search" : "in this area"
      }`}</span>
      <select
        className="block form-select  transition duration-150 ease-in-out sm:text-sm sm:leading-5"
        onChange={onChangeSort}
        value={sortProperty}
      >
        {searchMode && <option value="relevance">Relevance</option>}
        <option value="date">Date</option>
        <option value="distance">Distance</option>
        <option value="fujita">Fujita</option>
        <option value="location">Location</option>
      </select>
      <span className="inline-flex rounded-md shadow-sm">
        <button
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
          onClick={onChangeOrder}
          title={order}
          type="button"
        >
          {order === "ascending" ? (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h5a1 1 0 000-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3zm10 5a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
            </svg>
          )}
          <span className="sr-only">{order}</span>
        </button>
      </span>
    </li>
  );
}
