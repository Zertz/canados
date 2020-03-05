import React, { useEffect, useState } from "react";
import TornadoEventListItem from "../TornadoEventListItem";
import styles from "./TornadoEventList.module.css";

type Props = {
  data: Array<TornadoEvent>;
  filter: string;
  onClick: (any) => void;
  onSort: (any) => void;
  type: "tornadoEvents";
};

let worker;

function TornadoEventList({ data, filter, onClick, onSort, type }: Props) {
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

    worker.postMessage(
      JSON.stringify({ action: "store", payload: { data, type } })
    );

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

    worker.postMessage(
      JSON.stringify({ action: "filter", payload: { filter, type } })
    );
  }, [filter]);

  return (
    <div className={styles.div}>
      <select className={styles.select} disabled={loading} onChange={onSort}>
        <option value="date">Date</option>
        <option value="fujita">Fujita</option>
        <option value="community">Location</option>
      </select>
      <ul className={styles.ul}>
        {filteredData.map(tornado => (
          <TornadoEventListItem
            key={tornado.id}
            onClick={onClick}
            tornado={tornado}
          />
        ))}
      </ul>
    </div>
  );
}

export default TornadoEventList;
