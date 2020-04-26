import { createContext } from "react";

export const FilterContext = createContext<{
  fujitaFilter: [number, number];
  setFujitaFilter: (e: [number, number]) => void;
}>({
  fujitaFilter: [0, 5],
  setFujitaFilter: () => {},
});
