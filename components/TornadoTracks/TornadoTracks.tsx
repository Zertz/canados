import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  CircleMarker,
  Map,
  Marker,
  Polyline,
  Popup,
  TileLayer
} from "react-leaflet";
import { useThrottle } from "../../hooks/useThrottle";
import { shuffle } from "../../utils/shuffle";
import styles from "./TornadoTracks.module.css";

type Props = {
  filter: string;
  fitBounds?: Common.Bounds;
  onChangeBounds: (bounds: Common.Bounds) => void;
  onClick: (tornadoId: TornadoId) => void;
  selectedTornado?: TornadoEvent;
  tornados: TornadoEvent[];
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
  fitBounds: (bounds: Common.Bounds) => void;
  getBounds: () => { _southWest: LatLng; _northEast: LatLng };
};

type ReactLeaflet = {
  leafletElement: Leaflet;
};

function TornadoTracks({
  filter,
  fitBounds,
  onChangeBounds,
  onClick,
  selectedTornado,
  tornados
}: Props) {
  const map = useRef<ReactLeaflet>();

  const [center, setCenter] = useState<Common.Coordinates | undefined>();

  const [displayedTornados, setDisplayedTornados] = useState<TornadoEvent[]>(
    []
  );

  useEffect(() => {
    if (!fitBounds) {
      return;
    }

    if (!map.current) {
      return;
    }

    map.current.leafletElement.fitBounds(fitBounds);
  }, [fitBounds]);

  useEffect(() => {
    if (!selectedTornado) {
      return;
    }

    setCenter(getCenter(selectedTornado));
  }, [selectedTornado]);

  useEffect(() => {
    if (!Array.isArray(tornados)) {
      setDisplayedTornados([]);

      return;
    }

    if (tornados.length > 100) {
      setDisplayedTornados(shuffle(tornados, 100));

      return;
    }

    setDisplayedTornados(tornados);
  }, [tornados]);

  const handleMoveEnd = () => {
    if (filter) {
      return;
    }

    if (!map.current) {
      return;
    }

    const bounds = map.current.leafletElement.getBounds();

    onChangeBounds([
      [bounds._southWest.lat, bounds._southWest.lng],
      [bounds._northEast.lat, bounds._northEast.lng]
    ]);
  };

  const throttledHandleMoveEnd = useThrottle(handleMoveEnd, 200);

  return (
    <div className={styles.div}>
      <Map
        className={styles.map}
        center={center}
        onMoveEnd={throttledHandleMoveEnd}
        ref={map}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {displayedTornados.map(tornado => {
          const start = getStart(tornado);
          const end = getEnd(tornado);

          const selected = selectedTornado
            ? selectedTornado.id === tornado.id
            : false;

          return (
            <Fragment key={tornado.id}>
              {selected && (
                <CircleMarker center={start} color="tomato" radius={10} />
              )}
              <Marker onClick={onClick(tornado.id)} position={start}>
                <Popup>{`${end ? "Start: " : ""}${tornado.community}, ${
                  tornado.province
                } (F${tornado.fujita})`}</Popup>
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
                    <Popup>{`Finish: ${tornado.community}, ${tornado.province} (F${tornado.fujita})`}</Popup>
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

export default TornadoTracks;
