import React from "react";
import styles from "./TornadoEventListItem.module.css";

type Props = {
  onClick: (any) => void;
  tornado: TornadoEvent;
};

const TornadoEventListItem = React.memo(function TornadoEventListItem({
  onClick,
  tornado: { id, community, date, fujita, province }
}: Props) {
  return (
    <li className={styles.li} id={id} onClick={onClick}>
      <p className={styles.location}>{`${community}, ${province}`}</p>
      <p className={styles.fujita}>{`F${fujita}`}</p>
      {date && <p className={styles.date}>{date.toLocaleString()}</p>}
    </li>
  );
});

export default TornadoEventListItem;
