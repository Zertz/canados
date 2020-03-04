import React from "react";
import styles from "./Table.module.css";

type Props = {
  tornado: TornadoEvent;
};

const BodyRow = React.memo(function BodyRow({
  tornado: { id, ...tornado }
}: Props) {
  return (
    <tr className={styles.tr} title={id}>
      {Object.entries(tornado).map(([key, value]) => (
        <td key={key} className={styles.td}>
          {value}
        </td>
      ))}
    </tr>
  );
});

export default BodyRow;
