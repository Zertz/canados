import csvtojson from "csvtojson";
import { parse } from "date-fns";
import got from "got";
import geohash from "ngeohash";
import { GEOHASH_LENGTH } from "../../constants";
import { generateTornadoId } from "../generateTornadoId";

function check(value: string): number | undefined {
  return ["0", "0.0"].includes(value) ? undefined : Number(value);
}

export function formatUnitedStatesData() {
  return new Promise((resolve, reject) => {
    const events: TornadoEvent[] = [];

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
          const coordinates_start: [number, number] = [
            Number(json.slat),
            Number(json.slon),
          ];

          const coordinates_end: [number?, number?] = [
            check(json.elat),
            check(json.elon),
          ];

          const event = {
            coordinates_start,
            coordinates_end,
            date: {
              $date: parse(
                `${json.yr}-${json.mo}-${json.dy} ${json.time}`,
                "yyyy-MM-dd HH:mm:ss",
                new Date()
              )
            },
            community: "",
            province: json.st,
            fujita: Number(json.mag),
            geohash: geohash.encode(
              coordinates_start[0],
              coordinates_start[1],
              GEOHASH_LENGTH
            ),
            length_m: Number(json.len) * 1.6
            // width_max: Number(json.wid) * 0.9144,
            // human_fata: Number(json.fat),
            // human_inj: Number(json.inj),
            // dmg_thous:
            //   json.closs === "0.0"
            //     ? json.loss === "0.0"
            //       ? undefined
            //       : Number(json.loss)
            //     : Number(json.closs) * 1000000
          };

          events.push({
            id: generateTornadoId(event),
            ...event,
          });
        },
        reject,
        function onComplete() {
          resolve(events);
        }
      );
  });
}
