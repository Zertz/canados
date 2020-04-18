import React, { useContext } from "react";
import { FilterContext } from "../../contexts/filter";
import Multirange from "../react-multirange";
import styles from "./TornadoEventListFilter.module.css";

export default function TornadoEventListFilters() {
  const { fujitaFilter, setFujitaFilter } = useContext(FilterContext);

  const handleChange = (e: [number, number]) => {
    setFujitaFilter(e);
  };

  return (
    <div className={styles.div}>
      <span>F0</span>
      <Multirange
        min={0}
        max={5}
        onChange={handleChange}
        values={fujitaFilter}
      />
      <span>F5</span>
    </div>
  );
}
