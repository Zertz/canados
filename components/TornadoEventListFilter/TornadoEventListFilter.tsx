import React, { useContext } from "react";
import { FiltersContext } from "../../contexts/filters";
import Multirange from "../react-multirange";
import styles from "./TornadoEventListFilter.module.css";

export default function TornadoEventListFilters() {
  const {
    fujitaFilter,
    monthFilter,
    setFujitaFilter,
    setMonthFilter,
  } = useContext(FiltersContext);

  const handleChangeFujita = (e: [number, number]) => {
    setFujitaFilter(e);
  };

  const handleChangeMonth = (e: [number, number]) => {
    setMonthFilter(e);
  };

  return (
    <>
      <div className={styles.div}>
        <span>F0</span>
        <Multirange
          min={0}
          max={5}
          onChange={handleChangeFujita}
          values={fujitaFilter}
        />
        <span>F5</span>
      </div>
      <div className={styles.div}>
        <span>Jan</span>
        <Multirange
          min={0}
          max={11}
          onChange={handleChangeMonth}
          values={monthFilter}
        />
        <span>Dec</span>
      </div>
    </>
  );
}
