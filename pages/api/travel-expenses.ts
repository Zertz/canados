import csvtojson from "csvtojson";
import got from "got";
import stream from "stream";
import transform from "stream-transform";
import { promisify } from "util";

const pipeline = promisify(stream.pipeline);

const transformer = transform(function(record, callback) {
  const line = record.toString().trim();

  if (["[", "]"].includes(line)) {
    callback(null, Buffer.from(line));

    return;
  }

  callback(null, record);
});

export default async (req, res) => {
  res.statusCode = 200;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=31536000");

  try {
    await pipeline(
      got.stream(
        "https://open.canada.ca/data/dataset/009f9a49-c2d9-4d29-a6d4-1a228da335ce/resource/8282db2a-878f-475c-af10-ad56aa8fa72c/download/travelq.csv"
      ),
      csvtojson({
        downstreamFormat: "array"
      }),
      transformer,
      res
    );

    res.end();
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.setHeader("Cache-Control", null);
    res.end(JSON.stringify({ error: e.message }));
  }
};
