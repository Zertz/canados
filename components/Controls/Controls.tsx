import * as React from "react";
import styles from "./Controls.module.css";

type ControlsProps = {
  children: React.ReactNode;
};

export default function Controls({ children }: ControlsProps) {
  return <div className={styles.div}>{children}</div>;
}
