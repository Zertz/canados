import { createContext } from "react";

export const FiltersContext = createContext<{
  fujitaFilter: [number, number];
  monthFilter: [number, number];
  setFujitaFilter: (value: [number, number]) => void;
  setMonthFilter: (value: [number, number]) => void;
}>({
  fujitaFilter: [0, 5],
  monthFilter: [0, 11],
  setFujitaFilter: () => {},
  setMonthFilter: () => {},
});
