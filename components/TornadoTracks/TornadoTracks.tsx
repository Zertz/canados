import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {
  CircleMarker,
  Map,
  Marker,
  Polyline,
  TileLayer,
  Tooltip
} from "react-leaflet";
import { useClusteredTornados } from "../../hooks/useClusteredTornados";
import styles from "./TornadoTracks.module.css";

type Props = {
  fitBounds?: Common.Bounds;
  onClick: (tornadoId: TornadoId) => void;
  selectedTornadoId?: TornadoId;
  setScreenBounds: (bounds: Common.Bounds) => void;
  tornados?: TornadoEvent[];
};

function getStart(tornado: TornadoEvent): Common.Coordinates {
  const { coordinates_start } = tornado;

  return coordinates_start;
}

function getCenter(tornado: TornadoEvent): Common.Coordinates {
  const { coordinates_start, tracks } = tornado;

  if (Array.isArray(tracks)) {
    return tracks[Math.floor(tracks.length / 2)];
  }

  return coordinates_start;
}

function getEnd(tornado: TornadoEvent): Common.Coordinates | void {
  const { coordinates_end } = tornado;

  if (
    typeof coordinates_end[0] !== "number" ||
    typeof coordinates_end[1] !== "number"
  ) {
    return undefined;
  }

  return coordinates_end as Common.Coordinates;
}

type LatLng = {
  lat: number;
  lng: number;
};

type Leaflet = {
  fitBounds: (
    bounds: Common.Bounds,
    { padding }: { padding: [number, number] }
  ) => void;
  getBounds: () => { _southWest: LatLng; _northEast: LatLng };
};

type ReactLeaflet = {
  leafletElement: Leaflet;
};

export default function TornadoTracks({
  fitBounds,
  onClick,
  selectedTornadoId,
  setScreenBounds,
  tornados
}: Props) {
  const map = useRef<ReactLeaflet>();

  const [center, setCenter] = useState<Common.Coordinates>();
  const clusteredTornados = useClusteredTornados({ tornados });

  useEffect(() => {
    if (!fitBounds) {
      return;
    }

    if (!map.current) {
      return;
    }

    map.current.leafletElement.fitBounds(fitBounds, { padding: [25, 25] });
  }, [fitBounds]);

  useEffect(() => {
    if (!selectedTornadoId || !Array.isArray(tornados)) {
      return;
    }

    const tornado = tornados.find(({ id }) => id === selectedTornadoId);

    if (!tornado) {
      return;
    }

    setCenter(getCenter(tornado));
  }, [selectedTornadoId]);

  const handleMoveEnd = useCallback(() => {
    if (!map.current) {
      return;
    }

    const bounds = map.current.leafletElement.getBounds();

    setScreenBounds([
      [bounds._southWest.lat, bounds._southWest.lng],
      [bounds._northEast.lat, bounds._northEast.lng]
    ]);
  }, []);

  return (
    <div className={styles.div}>
      <Map
        className={styles.map}
        center={center}
        onMoveEnd={handleMoveEnd}
        ref={map}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Array.isArray(clusteredTornados) &&
          clusteredTornados.map(tornado => {
            const start = getStart(tornado);
            const end = getEnd(tornado);

            const selected = selectedTornadoId === tornado.id;

            return (
              <Fragment key={tornado.id}>
                {selected && (
                  <CircleMarker center={start} color="tomato" radius={10} />
                )}
                <Marker onClick={onClick(tornado.id)} position={start}>
                  <Tooltip direction="right" offset={[-10, 0]} opacity={0.9}>
                    {tornado.cluster.length > 0
                      ? `${tornado.cluster.length +
                          1} tornados around this location`
                      : `${end ? "Start: " : ""}${tornado.community}, ${
                          tornado.province
                        } (F${tornado.fujita})`}
                  </Tooltip>
                </Marker>
                {Array.isArray(tornado.tracks) && (
                  <Polyline
                    color={selected ? "tomato" : "lime"}
                    positions={tornado.tracks}
                  />
                )}
                {end && (
                  <>
                    {selected && (
                      <CircleMarker center={end} color="tomato" radius={10} />
                    )}
                    <Marker onClick={onClick(tornado.id)} position={end}>
                      <Tooltip
                        direction="right"
                        offset={[-10, 0]}
                        opacity={0.9}
                      >{`Finish: ${tornado.community}, ${tornado.province} (F${tornado.fujita})`}</Tooltip>
                    </Marker>
                  </>
                )}
              </Fragment>
            );
          })}
      </Map>
    </div>
  );
}
