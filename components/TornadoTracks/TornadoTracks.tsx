import React, { Fragment, useRef, useLayoutEffect } from "react";
import { Map, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import styles from "./TornadoTracks.module.css";

type Props = {
  onChangeBounds: (bounds: Common.Bounds) => void;
  selectedTornado?: TornadoEvent;
  tornados: TornadoEvent[];
};

const defaultLat = 45.508888;
const defaultLng = -73.561668;

function getStart(tornado: TornadoEvent) {
  const { coordinates_start } = tornado;

  return coordinates_start;
}

function getCenter(tornado: TornadoEvent) {
  const { coordinates_end, coordinates_start, tracks } = tornado;

  if (Array.isArray(tracks)) {
    return tracks[Math.floor(tracks.length / 2)];
  }

  if (!Array.isArray(coordinates_start) || !Array.isArray(coordinates_end)) {
    return [defaultLat, defaultLng];
  }

  const lat = (coordinates_start[0] || 0) + (coordinates_end[0] || 0);
  const lng = (coordinates_start[1] || 0) + (coordinates_end[1] || 0);

  return [lat || defaultLat, lng || defaultLng];
}

function getEnd(tornado: TornadoEvent) {
  const { coordinates_end } = tornado;

  if (coordinates_end.filter(Boolean).length === 0) {
    return null;
  }

  return coordinates_end;
}

type LatLng = {
  lat: number;
  lng: number;
};

type Leaflet = {
  getBounds: () => { _southWest: LatLng; _northEast: LatLng };
};

type ReactLeaflet = {
  leafletElement: Leaflet;
};

function TornadoTracks({ onChangeBounds, selectedTornado, tornados }: Props) {
  const map = useRef<ReactLeaflet>();

  const handleMoveEnd = () => {
    if (!map.current) {
      return;
    }

    const bounds = map.current.leafletElement.getBounds();

    onChangeBounds([
      [bounds._southWest.lat, bounds._northEast.lat],
      [bounds._southWest.lng, bounds._northEast.lng]
    ]);
  };

  useLayoutEffect(handleMoveEnd, []);

  const center = selectedTornado
    ? getCenter(selectedTornado)
    : [defaultLat, defaultLng];

  return (
    <div className={styles.div}>
      <Map
        className={styles.map}
        center={center}
        onMoveEnd={handleMoveEnd}
        ref={map}
        zoom={10}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tornados.map(tornado => {
          const end = getEnd(tornado);

          return (
            <Fragment key={tornado.id}>
              <Marker position={getStart(tornado)}>
                <Popup>{`Start: ${tornado.community}`}</Popup>
              </Marker>
              {Array.isArray(tornado.tracks) && (
                <Polyline
                  color={
                    selectedTornado && selectedTornado.id === tornado.id
                      ? "tomato"
                      : "lime"
                  }
                  positions={tornado.tracks}
                />
              )}
              {end && (
                <Marker position={end}>
                  <Popup>{`Finish: ${tornado.community}`}</Popup>
                </Marker>
              )}
            </Fragment>
          );
        })}
      </Map>
    </div>
  );
}

export default TornadoTracks;
