import { createContext } from "react";

export const QueryContext = createContext<{
  query: string;
  setQuery: (value: string) => void;
}>({
  query: "",
  setQuery: () => {},
});
