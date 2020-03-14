import { useEffect, useState } from "react";
import { useAPI } from "./useAPI";

export const useTornados = () => {
  const [tornados, setTornados] = useState<TornadoEvent[]>();

  const { data, error, load, loading } = useAPI("/api/tornados");

  useEffect(() => {
    setTornados(data);
  }, [data]);

  return {
    error,
    load,
    loading,
    tornados
  };
};
