import classnames from "classnames";
import React from "react";
import TornadoEventListFilter from "../TornadoEventListFilter";
import TornadoEventListSort from "../TornadoEventListSort";
import styles from "./TornadoEventListHeader.module.css";

type Props = {
  onChangeOrder: (e: any) => void;
  onChangeSort: (e: any) => void;
  order: Common.Order;
  sortProperty: Common.SortProperty;
  status: Common.Status;
};

export default function TornadoEventListHeader({
  onChangeOrder,
  onChangeSort,
  order,
  sortProperty,
  status,
}: Props) {
  return (
    <div
      className={classnames(
        "bg-white border-b border-gray-200 p-4 text-gray-800",
        styles.div
      )}
    >
      <TornadoEventListFilter />
      <TornadoEventListSort
        onChangeOrder={onChangeOrder}
        onChangeSort={onChangeSort}
        order={order}
        sortProperty={sortProperty}
        status={status}
      />
    </div>
  );
}
