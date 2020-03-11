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
  Popup,
  TileLayer
} from "react-leaflet";
import styles from "./TornadoTracks.module.css";

type Props = {
  fitBounds?: Common.Bounds;
  onClick: (tornadoId: TornadoId) => void;
  selectedTornado?: TornadoEvent;
  setBounds: (bounds: Common.Bounds) => void;
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
  selectedTornado,
  setBounds,
  tornados
}: Props) {
  const map = useRef<ReactLeaflet>();

  const [center, setCenter] = useState<Common.Coordinates>();

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
    if (!selectedTornado) {
      return;
    }

    setCenter(getCenter(selectedTornado));
  }, [selectedTornado]);

  const handleMoveEnd = useCallback(() => {
    if (!map.current) {
      return;
    }

    const bounds = map.current.leafletElement.getBounds();

    setBounds([
      [bounds._southWest.lat, bounds._southWest.lng],
      [bounds._northEast.lat, bounds._northEast.lng]
    ]);
  }, []);

  return (
    <div className={styles.div}>
      <Map
        className={styles.map}
        center={center}
        // onDragEnd={handleMoveEnd}
        onMoveEnd={handleMoveEnd}
        // onZoomEnd={handleMoveEnd}
        ref={map}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tornados.map(tornado => {
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
