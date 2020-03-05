import React from "react";
import { Map, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import styles from "./TornadoTracks.module.css";

type Props = {
  tornado?: TornadoEvent;
};

function TornadoTracks({ tornado }: Props) {
  const { tracks } = tornado || {};

  const center = Array.isArray(tracks)
    ? tracks[Math.floor(tracks.length / 2)]
    : [45.508888, -73.561668];

  return (
    <div className={styles.div}>
      <Map className={styles.map} center={center} zoom={9}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Array.isArray(tracks) && (
          <>
            <Marker position={tracks[0]}>
              <Popup>Start</Popup>
            </Marker>
            <Polyline color="lime" positions={tracks} />
            <Marker position={tracks[tracks.length - 1]}>
              <Popup>Finish</Popup>
            </Marker>
          </>
        )}
      </Map>
    </div>
  );
}

export default TornadoTracks;
