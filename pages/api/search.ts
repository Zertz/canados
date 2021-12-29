import got from "got";
import { NextApiRequest, NextApiResponse } from "next";
import QuickLRU from "quick-lru";

const lru = new QuickLRU({ maxSize: 256 });

type SearchResult = {
  latitude: number;
  longitude: number;
  type: string;
  name: string;
  number: void;
  postal_code: void;
  street: void;
  confidence: 1;
  region: string;
  region_code: string;
  county: void;
  locality: string;
  administrative_area: string;
  neighbourhood: void;
  country: string;
  country_code: string;
  continent: string;
  label: string;
};

export default async function search(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end();

    return;
  }

  if (!process.env.POSITIONSTACK_ACCESS_KEY) {
    res.status(402).end()
    
    return
  }

  const q = (typeof req.query.q === "string" ? req.query.q : "").toLowerCase().trim().replace(/\s\s+/g, " ");

  if (!q) {
    res.statusCode = 400;
    res.end();

    return;
  }

  if (lru.has(q)) {
    res.end(lru.get(q));

    return;
  }

  try {
    const json: { data: SearchResult[] } = await got(
      `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_ACCESS_KEY}&country=CA,US&query=${q}`
    ).json();

    const coordinates = json.data
      .filter(({ type }) => type === "locality")
      .map(({ latitude, longitude }) => [latitude, longitude]);

    const data = JSON.stringify(coordinates);

    lru.set(q, data);

    res.end(data);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
