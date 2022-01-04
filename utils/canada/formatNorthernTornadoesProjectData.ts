import csvtojson from "csvtojson";
import { parse } from "date-fns";
import got from "got";
import { generateShortId, generateTornadoId } from "../generateTornadoId";

export function formatNorthernTornadoesProjectData(): Promise<RawTornado[]> {
  return new Promise((resolve, reject) => {
    const events: RawTornado[] = [];
    const ids = new Set<string>();

    csvtojson({
      downstreamFormat: "array",
    })
      .fromStream(
        got.stream(
          "https://opendata.arcgis.com/api/v3/datasets/bc14a794dd764b42ba4f025e12910c43_0/downloads/data?format=csv&spatialRefId=4326"
        )
      )
      .subscribe(
        (json: CanadaNTPProperties) => {
          const id = generateTornadoId(json);

          if (!ids.has(id)) {
            const coordinates_start: [number, number] = [
              Number(json.Y),
              Number(json.X),
            ];

            const coordinates_end: [number | null, number | null] = [
              null,
              null,
            ];

            ids.add(id);

            events.push({
              id: generateShortId(),
              coordinates_start,
              coordinates_end,
              date: parse(
                json._date,
                "yyyy/MM/dd HH:mm:ssx",
                new Date()
              ).toISOString(),
              fujita: json.damage.startsWith("ef")
                ? Number(json.damage.substring(2))
                : 0,
              country_code: "CAN",
              region_code: json.province,
            });
          }
        },
        reject,
        function onComplete() {
          resolve(events);
        }
      );
  });
}
