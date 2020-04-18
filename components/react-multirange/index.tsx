import React, { useRef, useState } from "react";

type MultirangeProps = {
  min: number;
  max: number;
  onChange: (values: [number, number]) => void;
  values: [number?, number?];
};

function Multirange({
  min = 0,
  max = 100,
  onChange,
  values: [lowValue = min + (max - min) / 2, highValue = min + (max - min) / 2],
}: MultirangeProps) {
  const inputRef = useRef(null);
  const ghostRef = useRef(null);

  const handleChange = ({ target }) => {
    const value = Number(target.value);

    const low =
      value < lowValue || value - lowValue <= highValue - value
        ? value
        : lowValue;

    const high =
      value > highValue || highValue - value < value - lowValue
        ? value
        : highValue;

    if (lowValue === low && highValue === high) {
      return;
    }

    // @ts-ignore
    ghostRef.current.style.setProperty(
      "--low",
      100 * ((low - min) / (max - min)) + 1 + "%"
    );

    // @ts-ignore
    ghostRef.current.style.setProperty(
      "--high",
      100 * ((high - min) / (max - min)) - 1 + "%"
    );

    onChange([low, high]);
  };

  return (
    <span
      style={{ display: "flex", alignItems: "center", position: "relative" }}
    >
      <input
        className={`multirange original${
          lowValue > highValue ? " switched" : ""
        }`}
        type="range"
        min={min}
        max={max}
        onChange={handleChange}
        ref={inputRef}
        style={{ width: "100%" }}
        value={lowValue}
      />
      <input
        className={`multirange ghost${lowValue < highValue ? " switched" : ""}`}
        type="range"
        min={min}
        max={max}
        onChange={handleChange}
        ref={ghostRef}
        style={{ width: "100%" }}
        value={highValue}
      />
    </span>
  );
}

export default Multirange;
