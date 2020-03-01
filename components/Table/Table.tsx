import React, { useEffect, useState } from "react";
import BodyRow from "./BodyRow";
import HeaderFooterRow from "./HeaderFooterRow";
import styles from "./Table.module.css";

type Props = {
  data: Array<Tornado>;
  filter: string;
  onSort: (any) => void;
};

let worker;

function Table({ data, filter, onSort }: Props) {
  const [filteredData, setFilteredData] = useState(data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    worker = new Worker("filter.worker.js");

    worker.onmessage = e => {
      if (!e.isTrusted) {
        return;
      }

      try {
        setFilteredData(JSON.parse(e.data));
      } catch {
        setFilteredData(data);
      } finally {
        setLoading(false);
      }
    };

    return () => {
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    if (!filter) {
      setFilteredData(data);

      return;
    }

    setLoading(true);

    worker.postMessage(JSON.stringify({ data, filter }));
  }, [filter]);

  if (data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]) as (keyof Tornado)[];

  return (
    <div className={loading ? styles.loading : undefined}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <HeaderFooterRow columns={columns} onSort={onSort} />
        </thead>
        <tbody className={styles.tbody}>
          {filteredData.map(tornado => (
            <BodyRow key={tornado.id} tornado={tornado} />
          ))}
        </tbody>
        <tfoot className={styles.tfoot}>
          <HeaderFooterRow columns={columns} onSort={onSort} />
        </tfoot>
      </table>
    </div>
  );
}

export default Table;
