import haversine from "fast-haversine";
import geohash from "ngeohash";
import { GEOHASH_LENGTH } from "../../constants";
import { generateTornadoId } from "../generateTornadoId";
import { parseTornadoDate } from "./parseTornadoDate";

function check(value: number | string): number | undefined {
  return [-999, "-999"].includes(value) ? undefined : Number(value);
}

export function formatCanadaData(
  rawEvents: CanadaEvents[],
  rawTracks: CanadaTracks[]
) {
  const tracks: {
    [key: string]: Common.Coordinates[];
  } = rawTracks
    .map(
      ({
        geometry,
        properties: { YYYY_LOCAL, MM_LOCAL, DD_LOCAL, HHMM_LOCAL, NEAR_CMMTY },
      }) => {
        const community = NEAR_CMMTY;

        const coordinates = geometry.coordinates.map((pair) => pair.reverse());
        const coordinates_start = coordinates[0];
        const coordinates_end = coordinates[coordinates.length - 1];

        const date = {
          $date: parseTornadoDate({
            HHMM_LOCAL,
            YYYY_LOCAL,
            MM_LOCAL,
            DD_LOCAL,
          }),
        };

        return {
          id: generateTornadoId({
            community: community,
            coordinates_start: coordinates_start,
            coordinates_end: coordinates_end,
            date: date,
          }),
          coordinates,
        };
      }
    )
    .reduce(
      (acc, { id, coordinates }) => ({
        ...acc,
        [id]: coordinates,
      }),
      {}
    );

  const events: TornadoEvent[] = rawEvents
    .map(
      ({
        properties: {
          YYYY_LOCAL,
          MM_LOCAL,
          DD_LOCAL,
          HHMM_LOCAL,
          NEAR_CMMTY,
          PROVINCE,
          FUJITA,
          START_LAT_,
          START_LON_,
          END_LAT_N,
          END_LON_W,
          LENGTH_M,
          MOTION_DEG,
          WIDTH_MAX_,
          HUMAN_FATA,
          HUMAN_INJ,
          ANIMAL_FAT,
          ANIMAL_INJ,
          DMG_THOUS,
          FORECAST_R,
        },
      }) => {
        const community = NEAR_CMMTY;

        const coordinates_start: Common.Coordinates = [
          check(START_LAT_) || 0,
          check(START_LON_) || 0,
        ];
        const coordinates_end: [number?, number?] = [
          check(END_LAT_N),
          check(END_LON_W),
        ];

        const date = {
          $date: parseTornadoDate({
            HHMM_LOCAL,
            YYYY_LOCAL,
            MM_LOCAL,
            DD_LOCAL,
          }),
        };

        return {
          id: generateTornadoId({
            community,
            coordinates_start,
            coordinates_end,
            date,
          }),
          coordinates_start,
          coordinates_end,
          date,
          community,
          province: PROVINCE,
          fujita: Number(FUJITA),
          length_m: check(LENGTH_M),
          // motion_deg: check(MOTION_DEG),
          // width_max: check(WIDTH_MAX_),
          // human_fata: check(HUMAN_FATA),
          // human_inj: check(HUMAN_INJ),
          // animal_fat: check(ANIMAL_FAT),
          // animal_inj: check(ANIMAL_INJ),
          // dmg_thous: check(DMG_THOUS) ? DMG_THOUS * 1000 : undefined,
          // forecast_r: FORECAST_R
        };
      }
    )
    .map((tornado) => {
      const coordinates_start = Array.isArray(tracks[tornado.id])
        ? tracks[tornado.id][0]
        : tornado.coordinates_start;

      const coordinates_end = Array.isArray(tracks[tornado.id])
        ? tracks[tornado.id][tracks[tornado.id].length - 1]
        : tornado.coordinates_end;

      const length_m = tornado.length_m
        ? tornado.length_m
        : typeof coordinates_end[0] === "number" &&
          typeof coordinates_end[1] === "number"
        ? haversine(
            { lat: coordinates_start[0], lon: coordinates_start[1] },
            { lat: coordinates_end[0], lon: coordinates_end[1] }
          )
        : undefined;

      return {
        ...tornado,
        coordinates_start,
        coordinates_end,
        geohash: geohash.encode(
          coordinates_start[0],
          coordinates_start[1],
          GEOHASH_LENGTH
        ),
        length_m,
        tracks: tracks[tornado.id],
      };
    });
  return events;
}
