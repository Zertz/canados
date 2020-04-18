import React, { useLayoutEffect, useRef, useState } from "react";

type MultirangeProps = {
  min: number;
  max: number;
  onChange: (values: [number, number]) => void;
  values: [number, number];
};

function Multirange({ min = 0, max = 100, onChange, values }: MultirangeProps) {
  const target = useRef<{ ref: "low" | "high" | null }>({ ref: null });
  const inputRef = useRef<HTMLInputElement>(null);
  const ghostRef = useRef<HTMLInputElement>(null);

  const [[lowValue, highValue], setNextValues] = useState<[number, number]>([
    values[0],
    values[1],
  ]);

  const updateStyles = (low, high) => {
    if (!ghostRef.current) {
      return;
    }

    ghostRef.current.style.setProperty(
      "--low",
      100 * ((low - min) / (max - min)) + 1 + "%"
    );

    ghostRef.current.style.setProperty(
      "--high",
      100 * ((high - min) / (max - min)) - 1 + "%"
    );
  };

  useLayoutEffect(() => {
    updateStyles(lowValue, highValue);
  }, []);

  const handleChange = (e) => {
    const value = Number(e.target.value);

    if (!target.current.ref) {
      target.current.ref = value < lowValue ? "low" : "high";
    }

    const { low, high } =
      target.current.ref === "low"
        ? {
            low: value,
            high: value > highValue ? value : highValue,
          }
        : {
            low: value < lowValue ? value : lowValue,
            high: value,
          };

    if (lowValue === low && highValue === high) {
      return;
    }

    updateStyles(low, high);

    setNextValues([low, high]);
  };

  const handleMouseDown = (e) => {
    if (lowValue === highValue) {
      return;
    }

    const isOriginal = e.target.classList.contains("original");

    target.current.ref = isOriginal ? "low" : "high";
  };

  const handleMouseUp = () => {
    target.current.ref = null;

    if (lowValue === values[0] && highValue === values[1]) {
      return;
    }

    onChange([lowValue, highValue]);
  };

  return (
    <span
      style={{ display: "flex", alignItems: "center", position: "relative" }}
    >
      <input
        className="multirange original"
        type="range"
        min={min}
        max={max}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        ref={inputRef}
        style={{ width: "100%" }}
        value={lowValue}
      />
      <input
        className="multirange ghost"
        type="range"
        min={min}
        max={max}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        ref={ghostRef}
        style={{ width: "100%" }}
        value={highValue}
      />
    </span>
  );
}

export default Multirange;
