import got from "got";
import { NextApiRequest, NextApiResponse } from "next";
import QuickLRU from "quick-lru";
import { PAGE_SIZE } from "../../constants";
import { formatCanadaData } from "../../utils/canada/formatCanadaData";
import { formatNorthernTornadoesProjectData } from "../../utils/canada/formatNorthernTornadoesProjectData";
import { formatUnitedStatesData } from "../../utils/united-states/formatUnitedStatesData";

const lru = new QuickLRU({ maxSize: 8 });

const countries = ["CA", "CA-NTP", "US"] as const

type Country = typeof countries[number]

function arrayify(data: Object[]) {
  return data.map((value) => Object.values(value));
}

async function fetchData(country: Country) {
  switch (country) {
    case "CA": {
      const [
        { features: rawEvents },
        { features: rawTracks },
      ] = await Promise.all([
        got(
          "http://donnees.ec.gc.ca/data/weather/products/canadian-national-tornado-database-verified-events-1980-2009-public/canadian-national-tornado-database-verified-events-1980-2009-public-gis-en/GIS_CAN_VerifiedTornadoes_1980-2009.json"
        ).json<{
          features: Array<CanadaEvents>;
        }>(),
        got(
          "http://donnees.ec.gc.ca/data/weather/products/canadian-national-tornado-database-verified-events-1980-2009-public/canadian-national-tornado-database-verified-tracks-1980-2009-public-gis-en/GIS_CAN_VerifiedTracks_1980-2009.json"
        ).json<{
          features: Array<CanadaTracks>;
        }>(),
      ]);

      return formatCanadaData(rawEvents, rawTracks);
    }
    case "CA-NTP": {
      return formatNorthernTornadoesProjectData();
    }
    case "US": {
      return formatUnitedStatesData();
    }
  }
}

export default async function tornados(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    res.status(405).end();

    return;
  }

  const country = (typeof req.query.country==="string" ? req.query.country : "").toUpperCase() as Country;
  const page = Number(req.query.page) || 1;

  if (!countries.includes(country)) {
    res.status(400).end();

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

    res.setHeader("Cache-Control", "public, max-age=31536000");

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    res.status(200).end(
      JSON.stringify([
        {
          nextPage: data.length > end ? page + 1 : null,
          total: data.length,
        },
        ...arrayify(data.slice(start, end)),
      ])
    );
  } catch (e) {
    console.error(e);
    res.status(500).end(JSON.stringify({ error: e.message }));
  }
};
