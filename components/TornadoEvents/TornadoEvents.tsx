import React from "react";
import { useDebounce } from "../../hooks/useDebounce";
import TornadoEventList from "../TornadoEventList";
import styles from "./TornadoEvents.module.css";

type Props = {
  filter: string;
  onChangeSort: (any) => void;
  onClick: (any) => void;
  tornados: TornadoEvent[];
};

function TornadoEvents({ filter, onChangeSort, onClick, tornados }: Props) {
  const debouncedFilter = useDebounce(filter, 250);

  return (
    <div className={styles.div}>
      <TornadoEventList
        data={tornados}
        filter={debouncedFilter}
        onClick={onClick}
        onChangeSort={onChangeSort}
        type="tornadoEvents"
      />
    </div>
  );
}

export default TornadoEvents;
