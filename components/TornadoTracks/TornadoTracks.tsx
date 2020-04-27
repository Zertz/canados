import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CircleMarker,
  Map,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import styles from "./TornadoTracks.module.css";

type Props = {
  fitBounds?: Common.Bounds;
  onClick: (tornadoId: TornadoId) => void;
  selectedTornadoId?: TornadoId;
  setScreenBounds: (bounds: Common.Bounds) => void;
  tornados?: ClusteredTornado[];
};

function getStart(tornado: ClusteredTornado): Common.Coordinates {
  const {
    clusterStats: { coordinates },
  } = tornado;

  return coordinates;
}

function getCenter(tornado: ClusteredTornado): Common.Coordinates {
  const { coordinates_start, coordinates_end } = tornado;

  if (
    typeof coordinates_end[0] === "number" &&
    typeof coordinates_end[1] === "number"
  ) {
    return [
      (coordinates_start[0] + coordinates_end[0]) / 2,
      (coordinates_start[1] + coordinates_end[1]) / 2,
    ];
  }

  return coordinates_start;
}

function getEnd(tornado: ClusteredTornado): Common.Coordinates | void {
  if (tornado.cluster.length > 0) {
    return undefined;
  }

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

const minOpacity = 0.375;
const maxOpacity = 1;

export default function TornadoTracks({
  fitBounds,
  onClick,
  selectedTornadoId,
  setScreenBounds,
  tornados,
}: Props) {
  const map = useRef<ReactLeaflet>();

  const [center, setCenter] = useState<Common.Coordinates>();

  useEffect(() => {
    if (!map.current) {
      return;
    }

    if (!fitBounds) {
      return;
    }

    map.current.leafletElement.fitBounds(fitBounds, { padding: [0, 0] });
  }, [fitBounds]);

  useEffect(() => {
    if (!selectedTornadoId || !Array.isArray(tornados)) {
      return;
    }

    const tornado = tornados.find(
      ({ id, cluster }) =>
        id === selectedTornadoId ||
        cluster.find(({ id }) => id === selectedTornadoId)
    );

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

    const newBounds = [
      [
        Number(bounds._southWest.lat.toFixed(6)),
        Number(bounds._southWest.lng.toFixed(6)),
      ],
      [
        Number(bounds._northEast.lat.toFixed(6)),
        Number(bounds._northEast.lng.toFixed(6)),
      ],
    ] as Common.Bounds;

    if (JSON.stringify(newBounds) === JSON.stringify(fitBounds)) {
      return;
    }

    setScreenBounds(newBounds);
  }, [fitBounds]);

  const { largestCluster, smallestCluster } = (() => {
    if (!Array.isArray(tornados)) {
      return {
        largestCluster: 0,
        smallestCluster: 0,
      };
    }

    return {
      largestCluster: tornados.reduce(
        (acc, { cluster: { length } }) => Math.max(acc, length),
        0
      ),
      smallestCluster: tornados.reduce(
        (acc, { cluster: { length } }) => Math.min(acc, length),
        0
      ),
    };
  })();

  return (
    <div className={styles.div}>
      <Map
        className={styles.map}
        center={center}
        onMoveEnd={handleMoveEnd}
        ref={map}
        zoomControl={false}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Array.isArray(tornados) &&
          tornados.map((tornado) => {
            const opacity =
              ((maxOpacity - minOpacity) / (largestCluster - smallestCluster)) *
                (tornado.cluster.length + 1 - smallestCluster) +
              minOpacity;

            const start = getStart(tornado);
            const end = getEnd(tornado);

            const selected = selectedTornadoId === tornado.id;

            return (
              <Fragment key={tornado.id}>
                {selected && (
                  <CircleMarker center={start} color="tomato" radius={10} />
                )}
                <Marker
                  onClick={onClick(tornado.id)}
                  opacity={opacity}
                  position={start}
                >
                  <Tooltip direction="right" offset={[-10, 0]} opacity={0.9}>
                    {tornado.cluster.length > 0
                      ? `${
                          tornado.cluster.length + 1
                        } tornados around this location (average F${Math.round(
                          tornado.clusterStats.averageFujita
                        )})`
                      : `${end ? "Start: " : ""}${tornado.location} (F${
                          tornado.fujita
                        })`}
                  </Tooltip>
                </Marker>
                {tornado.cluster.length === 0 &&
                  typeof tornado.coordinates_end[0] === "number" &&
                  typeof tornado.coordinates_end[1] === "number" && (
                    <Polyline
                      color={selected ? "tomato" : "lime"}
                      positions={[
                        tornado.coordinates_start,
                        tornado.coordinates_end,
                      ]}
                    />
                  )}
                {end && (
                  <>
                    {selected && (
                      <CircleMarker center={end} color="tomato" radius={10} />
                    )}
                    <Marker
                      onClick={onClick(tornado.id)}
                      opacity={opacity}
                      position={end}
                    >
                      <Tooltip
                        direction="right"
                        offset={[-10, 0]}
                        opacity={0.9}
                      >{`Finish: ${tornado.location} (F${tornado.fujita})`}</Tooltip>
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
