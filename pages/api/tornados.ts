import got from "got";
import { generateTornadoId } from "../../utils/generateTornadoId";
import { parseTornadoDate } from "../../utils/parseTornadoDate";

function check(value) {
  return [-999, "-999"].includes(value) ? null : Number(value);
}

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const [
      { features: rawEvents },
      { features: rawTracks }
    ] = await Promise.all<{
      features: Array<unknown>;
    }>([
      got(
        "http://donnees.ec.gc.ca/data/weather/products/canadian-national-tornado-database-verified-events-1980-2009-public/canadian-national-tornado-database-verified-events-1980-2009-public-gis-en/GIS_CAN_VerifiedTornadoes_1980-2009.json"
      ).json(),
      got(
        "http://donnees.ec.gc.ca/data/weather/products/canadian-national-tornado-database-verified-events-1980-2009-public/canadian-national-tornado-database-verified-tracks-1980-2009-public-gis-en/GIS_CAN_VerifiedTracks_1980-2009.json"
      ).json()
    ]);

    const tracks = rawTracks
      .map(
        ({
          geometry,
          properties: { YYYY_LOCAL, MM_LOCAL, DD_LOCAL, HHMM_LOCAL, NEAR_CMMTY }
        }) => {
          const coordinates = geometry.coordinates.map(pair => pair.reverse());

          return {
            coordinates,
            coordinates_start: coordinates[0],
            coordinates_end: coordinates[coordinates.length - 1],
            date: parseTornadoDate({
              HHMM_LOCAL,
              YYYY_LOCAL,
              MM_LOCAL,
              DD_LOCAL
            }),
            community: NEAR_CMMTY
          };
        }
      )
      .map(generateTornadoId)
      .reduce(
        (acc, { id, coordinates }) => ({
          ...acc,
          [id]: coordinates
        }),
        {}
      );

    const events = rawEvents
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
            FORECAST_R
          }
        }) => {
          return {
            coordinates_start: [check(START_LAT_), check(START_LON_)],
            coordinates_end: [check(END_LAT_N), check(END_LON_W)],
            date: parseTornadoDate({
              HHMM_LOCAL,
              YYYY_LOCAL,
              MM_LOCAL,
              DD_LOCAL
            }),
            community: NEAR_CMMTY,
            province: PROVINCE,
            fujita: check(FUJITA),
            length_m: check(LENGTH_M),
            motion_deg: check(MOTION_DEG),
            width_max: check(WIDTH_MAX_),
            human_fata: check(HUMAN_FATA),
            human_inj: check(HUMAN_INJ),
            animal_fat: check(ANIMAL_FAT),
            animal_inj: check(ANIMAL_INJ),
            dmg_thous: check(DMG_THOUS) ? DMG_THOUS * 1000 : null,
            forecast_r: FORECAST_R
          };
        }
      )
      .map(generateTornadoId)
      .map(tornado => ({
        ...tornado,
        tracks: tracks[tornado.id]
      }));

    res.statusCode = 200;
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.end(JSON.stringify(events));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
