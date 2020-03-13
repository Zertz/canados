import classnames from "classnames";
import React, { useLayoutEffect, useRef } from "react";
import styles from "./TornadoEventListItem.module.css";

type Props = {
  community: string;
  date?: Date;
  fujita: number;
  length_m?: number;
  onClick: () => void;
  province: string;
  selected: boolean;
};

const TornadoEventListItem = function TornadoEventListItem({
  community,
  date,
  fujita,
  length_m,
  onClick,
  province,
  selected
}: Props) {
  const listItem = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    if (!selected) {
      return;
    }

    listItem.current?.scrollIntoView({
      behavior: "auto",
      block: "center",
      inline: "start"
    });
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
        <span
          className={styles.locationName}
        >{`${community}, ${province}`}</span>
        {length_m && (
          <span className={styles.locationLength}>{`${(length_m / 1000).toFixed(
            1
          )}km`}</span>
        )}
      </p>
      <p className={styles.fujita}>{`F${fujita}`}</p>
      {date && <p className={styles.date}>{date.toLocaleString()}</p>}
    </li>
  );
};

export default TornadoEventListItem;
