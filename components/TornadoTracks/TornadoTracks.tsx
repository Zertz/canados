import * as L from "leaflet";
import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Rectangle,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import { useSearchParamState } from "../../hooks/useSearchParamState";
import { useTornadoMatrix } from "../../hooks/useTornadoMatrix";
import styles from "./TornadoTracks.module.css";

interface TornadoTracksContainerProps {
  fitBounds?: Common.Bounds;
  onClick: (tornadoId: TornadoId) => () => void;
  searchStatus: Common.Status;
  selectedTornadoId?: TornadoId;
  setScreenBounds: (bounds: Common.Bounds) => void;
  tornados?: Tornado[];
}

interface TornadoTracksProps extends TornadoTracksContainerProps {
  center: LatLng;
  setCenter: (value: LatLng) => void;
  setZoom: (value: number) => void;
  zoom: number;
}

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

function TornadoCell({ color, onClick, opacity, row, selected }) {
  return (
    <>
      {selected && (
        <CircleMarker
          center={row.bounds.getCenter()}
          color={color}
          radius={35}
        />
      )}
      <Rectangle
        bounds={row.bounds}
        color={color}
        eventHandlers={{
          click: onClick,
        }}
        fillOpacity={opacity}
        stroke={false}
      >
        <Tooltip direction="right" opacity={0.9}>
          {`${row.tornados.size} tornados in this area`}
        </Tooltip>
      </Rectangle>
    </>
  );
}

function TornadoMarker({
  onClick,
  selected,
  tornado,
}: {
  onClick: () => void;
  selected: boolean;
  tornado: Tornado;
}) {
  const color = useMemo(
    () =>
      `hsla(${Math.round(
        maxColor - ((maxColor - minColor) / 5) * tornado.fujita
      )}, 100%, 50%, 1)`,
    [tornado.fujita]
  );

  const icon = useMemo(
    () =>
      L.divIcon({
        html: `<div class="canados-div-icon" style="color: ${color}"></div>`,
      }),
    [color]
  );

  return (
    <>
      {selected && (
        <CircleMarker center={tornado.coordinates_start} radius={15} />
      )}
      <Marker
        eventHandlers={{
          click: onClick,
        }}
        icon={icon}
        position={tornado.coordinates_start}
      >
        <Tooltip direction="right" offset={[5, -20]} opacity={0.9}>
          {`${tornado.region_code} (F${tornado.fujita})`}
        </Tooltip>
      </Marker>
    </>
  );
}

function TornadoTracks({
  center,
  fitBounds,
  onClick,
  searchStatus,
  selectedTornadoId,
  setCenter,
  setScreenBounds,
  setZoom,
  tornados,
  zoom,
}: TornadoTracksProps) {
  const map = useMapEvents({
    moveend() {
      setCenter(map.getCenter());

      const bounds = map.getBounds();

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      setScreenBounds([
        [sw.lat, sw.lng],
        [ne.lat, ne.lng],
      ]);
    },
    zoomend() {
      setZoom(map.getZoom());
    },
  });

  const tornadoMatrix = useTornadoMatrix(tornados);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (!fitBounds) {
      return;
    }

    if (center && typeof zoom === "number" && searchStatus !== "ready") {
      const bounds = map.getBounds();

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      setScreenBounds([
        [sw.lat, sw.lng],
        [ne.lat, ne.lng],
      ]);

      return;
    }

    map.fitBounds(fitBounds, { padding: [25, 25] });
  }, [fitBounds, searchStatus]);

  const handleClickCell = (bounds: L.LatLngBounds) => () => {
    if (!map) {
      return;
    }

    map.fitBounds(bounds, { padding: [25, 25] });
  };

  if (!tornadoMatrix) {
    return null;
  }

  return (
    <>
      {tornadoMatrix.columns.map((column) =>
        column.rows.map((row) => {
          if (!row.bounds || !row.density || row.tornados.size === 0) {
            return null;
          }

          if (
            (typeof zoom === "number" &&
              zoom >= 6 &&
              row.tornados.size === 1) ||
            (tornadoMatrix.columns.length === 1 && column.rows.length === 1)
          ) {
            return [...row.tornados.values()].map((tornado) => (
              <TornadoMarker
                key={tornado.id}
                onClick={onClick(tornado.id)}
                selected={tornado.id === selectedTornadoId}
                tornado={tornado}
              />
            ));
          }

          const selected = selectedTornadoId
            ? row.tornados.has(selectedTornadoId)
            : false;

          const relativeDensity =
            (1 / (tornadoMatrix.density.max - tornadoMatrix.density.min)) *
            (row.density - tornadoMatrix.density.min);

          const hue = Math.round(
            maxColor - (maxColor - minColor) / (1 / relativeDensity)
          );

          const color = `hsla(${hue}, 100%, 50%, 1)`;

          const opacity = selected
            ? 1
            : (maxOpacity - minOpacity) / (1 / relativeDensity) + minOpacity;

          return (
            <TornadoCell
              key={row.bounds.toBBoxString()}
              color={color}
              onClick={handleClickCell(row.bounds)}
              opacity={opacity}
              row={row}
              selected={selected}
            />
          );
        })
      )}
    </>
  );
}

export default function TornadoTracksContainer({
  fitBounds,
  onClick,
  searchStatus,
  selectedTornadoId,
  setScreenBounds,
  tornados,
}: TornadoTracksContainerProps) {
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

  return (
    <div className={styles.div}>
      <MapContainer
        className={styles.map}
        center={center}
        zoom={zoom}
        zoomControl={false}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TornadoTracks
          center={center}
          fitBounds={fitBounds}
          onClick={onClick}
          searchStatus={searchStatus}
          selectedTornadoId={selectedTornadoId}
          setCenter={setCenter}
          setScreenBounds={setScreenBounds}
          setZoom={setZoom}
          tornados={tornados}
          zoom={zoom}
        />
      </MapContainer>
    </div>
  );
}
