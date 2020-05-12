import * as L from "leaflet";
import React, { Fragment, useCallback, useEffect, useRef } from "react";
import {
  CircleMarker,
  Map,
  Marker,
  Rectangle,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { MAXIMUM_DISPLAYED_TORNADOS } from "../../constants";
import { useSearchParamState } from "../../hooks/useSearchParamState";
import { useTornadoMatrix } from "../../hooks/useTornadoMatrix";
import styles from "./TornadoTracks.module.css";

type Props = {
  fitBounds?: Common.Bounds;
  onClick: (tornadoId: TornadoId) => () => void;
  searchStatus: Common.Status;
  selectedTornadoId?: TornadoId;
  setScreenBounds: (bounds: Common.Bounds) => void;
  tornados?: Tornado[];
};

type LatLng = {
  lat: number;
  lng: number;
};

const minColor = 0;
const maxColor = 50;

const minOpacity = 0.25;
const maxOpacity = 0.75;

const encodeNumber = (v: number) => `${v}`;
const decodeNumber = (v?: string) => (v ? Number(v) || undefined : undefined);

function TornadoMarker({
  onClick,
  tornado,
}: {
  onClick: () => void;
  tornado: Tornado;
}) {
  const color = `hsla(${Math.round(
    maxColor - ((maxColor - minColor) / 5) * tornado.fujita
  )}, 100%, 50%, 1)`;

  const icon = L.divIcon({
    html: `<div class="canados-div-icon" style="color: ${color}"></div>`,
  });

  return (
    <Marker icon={icon} onClick={onClick} position={tornado.coordinates_start}>
      <Tooltip direction="right" offset={[5, -20]} opacity={0.9}>
        {`${tornado.region_code} (F${tornado.fujita})`}
      </Tooltip>
    </Marker>
  );
}

export default function TornadoTracks({
  fitBounds,
  onClick,
  searchStatus,
  selectedTornadoId,
  setScreenBounds,
  tornados,
}: Props) {
  const map = useRef<{ leafletElement: L.Map }>(null);

  const [center, setCenter] = useSearchParamState<LatLng>(
    "c",
    (v: LatLng) => {
      return `${v.lat.toFixed(6)}_${v.lng.toFixed(6)}`;
    },
    (v: string) => {
      if (!v) {
        return;
      }

      const [rawLat, rawLng] = v.split("_");

      const lat = Number(rawLat);
      const lng = Number(rawLng);

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return;
      }

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

  const { stats, tornadoMatrix } = useTornadoMatrix({
    tornados,
  });

  useEffect(() => {
    if (!map.current) {
      return;
    }

    if (!fitBounds) {
      return;
    }

    if (center && typeof zoom === "number" && searchStatus !== "ready") {
      const bounds = map.current.leafletElement.getBounds();

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      setScreenBounds([
        [sw.lat, sw.lng],
        [ne.lat, ne.lng],
      ]);

      return;
    }

    map.current.leafletElement.fitBounds(fitBounds, { padding: [25, 25] });
  }, [fitBounds, searchStatus]);

  const handleMoveEnd = useCallback(() => {
    if (!map.current) {
      return;
    }

    setCenter(map.current.leafletElement.getCenter());

    const bounds = map.current.leafletElement.getBounds();

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    setScreenBounds([
      [sw.lat, sw.lng],
      [ne.lat, ne.lng],
    ]);
  }, [fitBounds]);

  const handleZoomEnd = () => {
    if (!map.current) {
      return;
    }

    setZoom(map.current.leafletElement.getZoom());
  };

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
        {stats &&
          tornadoMatrix &&
          tornadoMatrix.columns.map((column) =>
            column.rows.map((row) => {
              if (!row.bounds || !row.density || row.tornados.size === 0) {
                return null;
              }

              if (stats.density.min === stats.density.max) {
                return [...row.tornados.values()].map((tornado) => (
                  <Fragment key={tornado.id}>
                    {tornado.id === selectedTornadoId && (
                      <CircleMarker
                        center={tornado.coordinates_start}
                        radius={50}
                      />
                    )}
                    <TornadoMarker
                      onClick={onClick(tornado.id)}
                      tornado={tornado}
                    />
                  </Fragment>
                ));
              }

              const selected = selectedTornadoId
                ? row.tornados.has(selectedTornadoId)
                : false;

              const relativeDensity =
                (1 / (stats.density.max - stats.density.min)) *
                (row.density - stats.density.min);

              if (
                tornadoMatrix.nonEmptyCells > MAXIMUM_DISPLAYED_TORNADOS &&
                relativeDensity < 5 / 100
              ) {
                return null;
              }

              const hue = Math.round(
                maxColor - (maxColor - minColor) / (1 / relativeDensity)
              );

              const color = `hsla(${hue}, 100%, 50%, 1)`;

              const opacity = selected
                ? 1
                : (maxOpacity - minOpacity) / (1 / relativeDensity) +
                  minOpacity;

              return (
                <Fragment key={row.bounds.toBBoxString()}>
                  {selected && (
                    <CircleMarker
                      center={row.bounds.getCenter()}
                      color={color}
                      radius={50}
                    />
                  )}
                  <Rectangle
                    bounds={row.bounds}
                    color={color}
                    fillOpacity={opacity}
                    onClick={onClick(row.tornados.keys().next().value)}
                    stroke={false}
                  >
                    <Tooltip direction="right" opacity={0.9}>
                      {`${row.tornados.size} tornados in this area`}
                    </Tooltip>
                  </Rectangle>
                </Fragment>
              );
            })
          )}
      </Map>
    </div>
  );
}
