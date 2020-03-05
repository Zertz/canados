import React, { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useTornadoEvents } from "../../hooks/useTornadoEvents";
import TornadoEventList from "../TornadoEventList";
import styles from "./TornadoEvents.module.css";

type Props = {
  filter: string;
  onClick: (any) => void;
};

function TornadoEvents({ filter, onClick }: Props) {
  const debouncedFilter = useDebounce(filter, 250);
  const [order, setOrder] = useState<Common.Order>("desc");
  const [sortProperty, setSortProperty] = useState<keyof TornadoEvent>("date");

  const { error, load, loading, tornadoEvents } = useTornadoEvents({
    order,
    sortProperty
  });

  useEffect(() => {
    load();
  }, []);

  const handleSort = e => {
    if (e.target.dataset.type === sortProperty) {
      setOrder(order === "asc" ? "desc" : "asc");

      return;
    }

    setSortProperty(e.target.dataset.type);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Aw, snap.</div>;
  }

  if (!tornadoEvents) {
    return null;
  }

  return (
    <div className={styles.div}>
      <TornadoEventList
        data={tornadoEvents}
        filter={debouncedFilter}
        onClick={onClick}
        onSort={handleSort}
        type="tornadoEvents"
      />
    </div>
  );
}

export default TornadoEvents;
