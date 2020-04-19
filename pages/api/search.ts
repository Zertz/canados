import got from "got";
import QuickLRU from "quick-lru";
import geohash from "ngeohash";
import { GEOHASH_LENGTH } from "../../constants";

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

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end();

    return;
  }

  const q = (req.query.q || "").toLowerCase().trim().replace(/\s\s+/g, " ");

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

    const boundingBoxes = json.data.map(({ latitude, longitude }) =>
      geohash.bboxes(
        (latitude -= 0.25),
        (longitude -= 0.25),
        (latitude += 0.25),
        (longitude += 0.25),
        GEOHASH_LENGTH
      )
    );

    const data = JSON.stringify(boundingBoxes);

    lru.set(q, data);

    res.end(data);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
