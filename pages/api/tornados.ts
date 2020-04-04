import got from "got";
import { formatCanadaData } from "../../utils/canada/formatCanadaData";
import { formatUnitedStatesData } from "../../utils/united-states/formatUnitedStatesData";

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const [
      { features: rawEvents },
      { features: rawTracks },
      unitedStatesData,
    ] = await Promise.all<
      {
        features: Array<CanadaEvents>;
      },
      {
        features: Array<CanadaTracks>;
      },
      any
    >([
      got(
        "http://donnees.ec.gc.ca/data/weather/products/canadian-national-tornado-database-verified-events-1980-2009-public/canadian-national-tornado-database-verified-events-1980-2009-public-gis-en/GIS_CAN_VerifiedTornadoes_1980-2009.json"
      ).json(),
      got(
        "http://donnees.ec.gc.ca/data/weather/products/canadian-national-tornado-database-verified-events-1980-2009-public/canadian-national-tornado-database-verified-tracks-1980-2009-public-gis-en/GIS_CAN_VerifiedTracks_1980-2009.json"
      ).json(),
      formatUnitedStatesData(),
    ]);

    const canadaData = formatCanadaData(rawEvents, rawTracks);

    res.statusCode = 200;
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.end(JSON.stringify([...canadaData, ...unitedStatesData]));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
