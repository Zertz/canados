import crypto from "crypto";
import got from "got";
import { parse } from "date-fns";

function check(value) {
  return [-999, "-999"].includes(value) ? null : Number(value);
}

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const { features } = await got(
      "http://donnees.ec.gc.ca/data/weather/products/canadian-national-tornado-database-verified-events-1980-2009-public/canadian-national-tornado-database-verified-events-1980-2009-public-gis-en/GIS_CAN_VerifiedTornadoes_1980-2009.json"
    ).json();

    const data = features
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
          const [hh, mm] = HHMM_LOCAL
            ? [
                `${(HHMM_LOCAL / 100).toFixed()}`.padStart(2, "0"),
                `${HHMM_LOCAL}`.substring(`${HHMM_LOCAL}`.length - 2)
              ]
            : ["00", "00"];

          return {
            coordinates_start: [check(START_LAT_), check(START_LON_)],
            coordinates_end: [check(END_LAT_N), check(END_LON_W)],
            date: parse(
              `${YYYY_LOCAL}-${MM_LOCAL || "01"}-${DD_LOCAL ||
                "01"} ${hh}:${mm}`,
              "yyyy-MM-dd HH:mm",
              new Date()
            ),
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
      .map(tornado => ({
        id: crypto
          .createHash("md5")
          .update(JSON.stringify(tornado))
          .digest("hex"),
        ...tornado
      }));

    res.statusCode = 200;
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.end(JSON.stringify(data));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
