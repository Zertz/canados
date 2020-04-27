import { createContext } from "react";

export const FujitaContext = createContext<{
  fujitaFilter: [number, number];
  setFujitaFilter: (value: [number, number]) => void;
}>({
  fujitaFilter: [0, 5],
  setFujitaFilter: () => {},
});
