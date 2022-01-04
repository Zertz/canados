import { NextApiRequest, NextApiResponse } from "next";
import QuickLRU from "quick-lru";
import { PAGE_SIZE } from "../../constants";
import { fetchTornados } from "../../data/fetchTornados";

const lru = new QuickLRU({ maxSize: 8 });

const countries = ["CA", "CA-NTP", "US"] as const;

type Country = typeof countries[number];

function arrayify(data: Object[]) {
  return data.map((value) => Object.values(value));
}

export default async function tornados(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).end();

    return;
  }

  const country = (
    typeof req.query.country === "string" ? req.query.country : ""
  ).toUpperCase() as Country;

  const page = Number(req.query.page) || 1;

  if (!countries.includes(country)) {
    res.status(400).end();

    return;
  }

  res.setHeader("Content-Type", "application/json");

  const cached = lru.has(country);

  try {
    const data = cached
      ? (lru.get(country) as RawTornado[])
      : await fetchTornados(country);

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
}
