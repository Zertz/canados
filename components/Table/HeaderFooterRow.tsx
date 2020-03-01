import React from "react";
import styles from "./Table.module.css";

type Props = {
  columns: Array<keyof Tornado>;
  onSort: (any) => void;
};

const HeaderFooterRow = React.memo(function HeaderFooterRow({
  columns,
  onSort
}: Props) {
  return (
    <tr className={styles.tr}>
      {columns
        .filter(key => key !== "id")
        .map(key => (
          <th key={key} data-type={key} onClick={onSort} className={styles.th}>
            {key}
          </th>
        ))}
    </tr>
  );
});

export default HeaderFooterRow;
