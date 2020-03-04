import React, { useEffect, useState } from "react";
import { useTornadoTracks } from "../../hooks/useTornadoTracks";

type Props = {
  tornadoId?: TornadoId;
};

function TornadoTracks({ tornadoId }: Props) {
  const [tornadoCoordinates, setTornadoCoordinates] = useState<
    TornadoCoordinates
  >();

  const { error, load, loading, tornadoTracks } = useTornadoTracks();

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!tornadoId) {
      return;
    }

    if (!tornadoTracks) {
      return;
    }

    setTornadoCoordinates(tornadoTracks[tornadoId]);
  }, [tornadoId]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Aw, snap.</div>}
      <pre>
        <code>
          {tornadoCoordinates ? JSON.stringify(tornadoCoordinates) : "Unknown"}
        </code>
      </pre>
    </div>
  );
}

export default TornadoTracks;
