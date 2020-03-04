import React from "react";
import styles from "./Table.module.css";

type Props = {
  onClick: (any) => void;
  tornado: TornadoEvent;
};

const BodyRow = React.memo(function BodyRow({
  onClick,
  tornado: { id, ...tornado }
}: Props) {
  return (
    <tr className={styles.tr} id={id} onClick={onClick} title={id}>
      {Object.entries(tornado).map(([key, value]) => (
        <td key={key} className={styles.td}>
          {value}
        </td>
      ))}
    </tr>
  );
});

export default BodyRow;
