import React, { useContext } from "react";
import { FiltersContext } from "../../contexts/filters";
import Multirange from "../react-multirange";
import styles from "./TornadoEventListFilter.module.css";

export default function TornadoEventListFilters() {
  const {
    fujitaFilter,
    monthFilter,
    yearFilter,
    setFujitaFilter,
    setMonthFilter,
    setYearFilter,
  } = useContext(FiltersContext);

  const handleChangeFujita = (e: [number, number]) => {
    setFujitaFilter(e);
  };

  const handleChangeMonth = (e: [number, number]) => {
    setMonthFilter(e);
  };

  const handleChangeYear = (e: [number, number]) => {
    setYearFilter(e);
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
      <div className={styles.div}>
        <span>1950</span>
        <Multirange
          min={1950}
          max={2018}
          onChange={handleChangeYear}
          values={yearFilter}
        />
        <span>2018</span>
      </div>
    </>
  );
}
