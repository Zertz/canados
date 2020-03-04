import { useEffect, useState } from "react";
import { useAPI } from "./useAPI";

export const useTornadoTracks = () => {
  const [tornadoTracks, setTornadoTracks] = useState<TornadoTracks | null>();
  const { data, error, load, loading } = useAPI("/api/tornado-tracks");

  useEffect(() => {
    if (!data) {
      setTornadoTracks(null);

      return;
    }

    setTornadoTracks(data);
  }, [data]);

  return {
    error,
    load,
    loading,
    tornadoTracks
  };
};
