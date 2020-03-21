import got from "got";
import { formatCanadaData } from "../../utils/formatCanadaData";

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const [
      { features: rawEvents },
      { features: rawTracks }
    ] = await Promise.all<
      {
        features: Array<CanadaEvents>;
      },
      {
        features: Array<CanadaTracks>;
      }
    >([
      got(
        "http://donnees.ec.gc.ca/data/weather/products/canadian-national-tornado-database-verified-events-1980-2009-public/canadian-national-tornado-database-verified-events-1980-2009-public-gis-en/GIS_CAN_VerifiedTornadoes_1980-2009.json"
      ).json(),
      got(
        "http://donnees.ec.gc.ca/data/weather/products/canadian-national-tornado-database-verified-events-1980-2009-public/canadian-national-tornado-database-verified-tracks-1980-2009-public-gis-en/GIS_CAN_VerifiedTracks_1980-2009.json"
      ).json()
    ]);

    const canadaData = formatCanadaData(rawEvents, rawTracks);

    res.statusCode = 200;
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.end(JSON.stringify(canadaData));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
