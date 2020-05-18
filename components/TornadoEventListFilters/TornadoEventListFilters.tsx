import * as React from "react";
import Multirange from "../react-multirange";
import styles from "./TornadoEventListFilters.module.css";

export default function TornadoEventListFilters({
  fujitaFilter,
  monthFilter,
  yearFilter,
  setFujitaFilter,
  setMonthFilter,
  setYearFilter,
}) {
  return (
    <>
      <div className={styles.div}>
        <span>F0</span>
        <Multirange
          min={0}
          max={5}
          onChange={setFujitaFilter}
          values={fujitaFilter}
        />
        <span>F5</span>
      </div>
      <div className={styles.div}>
        <span>Jan</span>
        <Multirange
          min={0}
          max={11}
          onChange={setMonthFilter}
          values={monthFilter}
        />
        <span>Dec</span>
      </div>
      <div className={styles.div}>
        <span>1950</span>
        <Multirange
          min={1950}
          max={2018}
          onChange={setYearFilter}
          values={yearFilter}
        />
        <span>2018</span>
      </div>
    </>
  );
}
