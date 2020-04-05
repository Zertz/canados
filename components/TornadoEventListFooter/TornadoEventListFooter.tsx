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
  tornadoCount,
}: Props) {
  const searchMode = status === "ready";

  return (
    <div
      className={classnames(
        "bg-white border-t border-gray-200 p-4 text-gray-800",
        styles.div
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
          {listState === "collapsed" ? "Show list" : "Hide list"}
        </button>
      </span>
    </div>
  );
}
