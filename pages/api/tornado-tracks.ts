import got from "got";
import { generateTornadoId } from "../../utils/generateTornadoId";
import { parseTornadoDate } from "../../utils/parseTornadoDate";

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const { features } = await got(
      "http://donnees.ec.gc.ca/data/weather/products/canadian-national-tornado-database-verified-events-1980-2009-public/canadian-national-tornado-database-verified-tracks-1980-2009-public-gis-en/GIS_CAN_VerifiedTracks_1980-2009.json"
    ).json();

    const data = features
      .map(
        ({
          geometry: { coordinates },
          properties: { YYYY_LOCAL, MM_LOCAL, DD_LOCAL, HHMM_LOCAL, NEAR_CMMTY }
        }) => {
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

    res.statusCode = 200;
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.end(JSON.stringify(data));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
