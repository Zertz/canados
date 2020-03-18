import classnames from "classnames";
import React from "react";
import styles from "./TornadoEventListFooter.module.css";

type Props = {
  listState: Common.ListState;
  onChangeListState: (e: any) => void;
  status: Common.Status;
  tornadoCount: number;
};

export default function TornadoEventListFooter({
  listState,
  onChangeListState,
  status,
  tornadoCount
}: Props) {
  const searchMode = status === "done";

  return (
    <li
      className={classnames(
        "bg-white border-b border-gray-200 px-4 py-2 text-gray-800",
        styles.li
      )}
    >
      <span>
        {tornadoCount === 1
          ? `${tornadoCount} tornado ${
              searchMode ? "matches your search" : "in this area"
            }`
          : `${tornadoCount} tornados ${
              searchMode ? "match your search" : "in this area"
            }`}
      </span>
      <span className="inline-flex rounded-md shadow-sm">
        <button
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
          onClick={onChangeListState}
          type="button"
        >
          {listState === "collapsed" ? (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span className="sr-only">{listState}</span>
        </button>
      </span>
    </li>
  );
}
