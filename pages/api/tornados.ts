import got from "got";
import QuickLRU from "quick-lru";
import { formatCanadaData } from "../../utils/canada/formatCanadaData";
import { formatUnitedStatesData } from "../../utils/united-states/formatUnitedStatesData";

const lru = new QuickLRU({ maxSize: 8 });

type Country = "CA" | "US";

function arrayify(tornados: Object[]) {
  return tornados.map((tornado) => Object.values(tornado));
}

async function fetchData(country: Country) {
  switch (country) {
    case "CA": {
      const [
        { features: rawEvents },
        { features: rawTracks },
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
        ).json(),
      ]);

      return formatCanadaData(rawEvents, rawTracks);
    }
    case "US": {
      return formatUnitedStatesData();
    }
  }
}

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end();

    return;
  }

  const country = (req.query.country || "").toUpperCase();

  if (!["CA", "US"].includes(country)) {
    res.statusCode = 400;
    res.end();

    return;
  }

  const cached = lru.has(country);

  try {
    const data = cached
      ? (lru.get(country) as RawTornado[])
      : await fetchData(country);

    if (!cached) {
      lru.set(country, data);
    }

    res.statusCode = 200;
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.end(JSON.stringify(arrayify(data)));
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
