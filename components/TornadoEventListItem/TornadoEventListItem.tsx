import classnames from "classnames";
import React from "react";
import styles from "./TornadoEventListItem.module.css";

type Props = {
  onClick: (any) => void;
  selected: boolean;
  tornado: TornadoEvent;
};

const TornadoEventListItem = React.memo(function TornadoEventListItem({
  onClick,
  selected,
  tornado: { community, date, fujita, province }
}: Props) {
  return (
    <li
      className={classnames(styles.li, {
        [styles.liSelected]: selected
      })}
      onClick={onClick}
    >
      <p className={styles.location}>{`${community}, ${province}`}</p>
      <p className={styles.fujita}>{`F${fujita}`}</p>
      {date && <p className={styles.date}>{date.toLocaleString()}</p>}
    </li>
  );
});

export default TornadoEventListItem;
