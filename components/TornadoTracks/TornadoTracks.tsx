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
import { useSearchParamState } from "../../hooks/useSearchParamState";
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

function getCenter(tornado: ClusteredTornado): LatLng {
  const { coordinates_start, coordinates_end } = tornado;

  if (
    typeof coordinates_end[0] === "number" &&
    typeof coordinates_end[1] === "number"
  ) {
    return {
      lat: (coordinates_start[0] + coordinates_end[0]) / 2,
      lng: (coordinates_start[1] + coordinates_end[1]) / 2,
    };
  }

  return {
    lat: coordinates_start[0],
    lng: coordinates_start[1],
  };
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
  getCenter: () => LatLng;
  getZoom: () => number;
};

type ReactLeaflet = {
  leafletElement: Leaflet;
};

const minOpacity = 0.375;
const maxOpacity = 1;

const encodeNumber = (v: number) => `${v}`;
const decodeNumber = (v?: string) => (v ? Number(v) || undefined : undefined);

export default function TornadoTracks({
  fitBounds,
  onClick,
  selectedTornadoId,
  setScreenBounds,
  tornados,
}: Props) {
  const map = useRef<ReactLeaflet>();

  const [center, setCenter] = useSearchParamState<LatLng>(
    "c",
    (v: LatLng) => {
      return `${v.lat.toFixed(6)}_${v.lng.toFixed(6)}`;
    },
    (v: string) => {
      if (!v) {
        return;
      }

      const [lat, lng] = v.split("_");

      return {
        lat: Number(lat),
        lng: Number(lng),
      };
    }
  );

  const [zoom, setZoom] = useSearchParamState<number>(
    "z",
    encodeNumber,
    decodeNumber
  );

  useEffect(() => {
    if (!map.current) {
      return;
    }

    if (!fitBounds) {
      return;
    }

    if (center) {
      const bounds = map.current.leafletElement.getBounds();

      setScreenBounds([
        [bounds._southWest.lat, bounds._southWest.lng],
        [bounds._northEast.lat, bounds._northEast.lng],
      ]);

      return;
    }

    map.current.leafletElement.fitBounds(fitBounds, { padding: [25, 25] });
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

    setCenter(map.current.leafletElement.getCenter());

    const bounds = map.current.leafletElement.getBounds();

    setScreenBounds([
      [bounds._southWest.lat, bounds._southWest.lng],
      [bounds._northEast.lat, bounds._northEast.lng],
    ]);
  }, [fitBounds]);

  const handleZoomEnd = () => {
    if (!map.current) {
      return;
    }

    setZoom(map.current.leafletElement.getZoom());
  };

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
        onZoomEnd={handleZoomEnd}
        ref={map}
        zoom={zoom}
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
