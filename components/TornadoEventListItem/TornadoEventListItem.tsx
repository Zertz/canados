import classnames from "classnames";
import React, { useLayoutEffect, useRef } from "react";
import styles from "./TornadoEventListItem.module.css";

type Props = {
  onClick: (any) => void;
  selected: boolean;
  tornado: TornadoEvent;
};

const TornadoEventListItem = React.memo(function TornadoEventListItem({
  onClick,
  selected,
  tornado: { community, date, fujita, length_m, province }
}: Props) {
  const listItem = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    if (!selected) {
      return;
    }

    listItem.current?.scrollIntoView();
  }, [selected]);

  return (
    <li
      className={classnames(styles.li, {
        [styles.liSelected]: selected
      })}
      onClick={onClick}
      ref={listItem}
    >
      <p className={styles.location}>
        <span>{`${community}, ${province}`}</span>
        {length_m && <span>{`${(length_m / 1000).toFixed(1)}km`}</span>}
      </p>
      <p className={styles.fujita}>{`F${fujita}`}</p>
      {date && <p className={styles.date}>{date.toLocaleString()}</p>}
    </li>
  );
});

export default TornadoEventListItem;
