import csvtojson from "csvtojson";
import { parse } from "date-fns";
import got from "got";
import { generateTornadoId } from "../generateTornadoId";

function check(value: string): number | undefined {
  return ["0", "0.0"].includes(value) ? undefined : Number(value);
}

export function formatUnitedStatesData(): Promise<RawTornado[]> {
  return new Promise((resolve, reject) => {
    const events: RawTornado[] = [];
    const ids = new Set<string>();

    csvtojson({
      downstreamFormat: "array",
    })
      .fromStream(
        got.stream(
          "https://www.spc.noaa.gov/wcm/data/1950-2018_actual_tornadoes.csv"
        )
      )
      .subscribe(
        (json: UnitedStatesProperties) => {
          const id = generateTornadoId(json);

          if (!ids.has(id)) {
            const coordinates_start: [number, number] = [
              Number(json.slat),
              Number(json.slon),
            ];

            const coordinates_end: [number?, number?] = [
              check(json.elat),
              check(json.elon),
            ];

            ids.add(id);

            events.push({
              id,
              coordinates_start,
              coordinates_end,
              date: parse(
                `${json.yr}-${json.mo}-${json.dy} ${json.time}`,
                "yyyy-MM-dd HH:mm:ss",
                new Date()
              ),
              fujita: Number(json.mag),
              region_code: json.st,
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
