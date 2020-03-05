import React from "react";
import { Map, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import styles from "./TornadoTracks.module.css";

type Props = {
  tornado?: TornadoEvent;
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

function TornadoTracks({ tornado }: Props) {
  const start = tornado ? getStart(tornado) : null;
  const center = tornado ? getCenter(tornado) : [defaultLat, defaultLng];
  const end = tornado ? getEnd(tornado) : null;

  return (
    <div className={styles.div}>
      <Map className={styles.map} center={center} zoom={9}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tornado && (
          <>
            {start && (
              <Marker position={getStart(tornado)}>
                <Popup>Start</Popup>
              </Marker>
            )}
            {Array.isArray(tornado.tracks) && (
              <Polyline color="lime" positions={tornado.tracks} />
            )}
            {end && (
              <Marker position={end}>
                <Popup>Finish</Popup>
              </Marker>
            )}
          </>
        )}
      </Map>
    </div>
  );
}

export default TornadoTracks;
