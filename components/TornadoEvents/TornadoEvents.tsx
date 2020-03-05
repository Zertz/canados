import React from "react";
import { useDebounce } from "../../hooks/useDebounce";
import TornadoEventList from "../TornadoEventList";
import styles from "./TornadoEvents.module.css";

type Props = {
  filter: string;
  onClick: (any) => void;
  onSort: (any) => void;
  tornados: TornadoEvent[];
};

function TornadoEvents({ filter, onClick, onSort, tornados }: Props) {
  const debouncedFilter = useDebounce(filter, 250);

  return (
    <div className={styles.div}>
      <TornadoEventList
        data={tornados}
        filter={debouncedFilter}
        onClick={onClick}
        onSort={onSort}
        type="tornadoEvents"
      />
    </div>
  );
}

export default TornadoEvents;
