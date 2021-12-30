import { generateTornadoId } from "../generateTornadoId";
import { parseTornadoDate } from "./parseTornadoDate";

function check(value: number | string): number | undefined {
  return [-999, "-999"].includes(value) ? undefined : Number(value);
}

export function formatCanadaData(
  rawEvents: CanadaEvents[],
  rawTracks: CanadaTracks[]
) {
  const tracks: {
    [key: string]: Common.Coordinates[];
  } = Object.fromEntries(
    rawTracks.map(
      ({
        geometry,
        properties: { YYYY_LOCAL, MM_LOCAL, DD_LOCAL, HHMM_LOCAL, PROVINCE },
      }) => {
        const coordinates = geometry.coordinates.map((pair) =>
          pair.reverse()
        ) as Common.Coordinates[];

        const coordinates_start = coordinates[0];
        const coordinates_end = coordinates[coordinates.length - 1];

        const date = parseTornadoDate({
          HHMM_LOCAL,
          YYYY_LOCAL,
          MM_LOCAL,
          DD_LOCAL,
        });

        return [
          generateTornadoId({
            coordinates_start,
            coordinates_end,
            date,
            region_code: PROVINCE,
          }),
          coordinates,
        ];
      }
    )
  );

  const events: RawTornado[] = rawEvents
    .map(
      ({
        properties: {
          YYYY_LOCAL,
          MM_LOCAL,
          DD_LOCAL,
          HHMM_LOCAL,
          PROVINCE,
          FUJITA,
          START_LAT_,
          START_LON_,
          END_LAT_N,
          END_LON_W,
        },
      }) => {
        const coordinates_start: Common.Coordinates = [
          check(START_LAT_) || 0,
          check(START_LON_) || 0,
        ];
        const coordinates_end: [number?, number?] = [
          check(END_LAT_N),
          check(END_LON_W),
        ];

        const date = parseTornadoDate({
          HHMM_LOCAL,
          YYYY_LOCAL,
          MM_LOCAL,
          DD_LOCAL,
        });

        const region_code = PROVINCE;

        return {
          id: generateTornadoId({
            coordinates_start,
            coordinates_end,
            date,
            region_code,
          }),
          coordinates_start,
          coordinates_end,
          date,
          fujita: Number(FUJITA),
          country_code: "CAN",
          region_code,
        };
      }
    )
    .map((tornado) => {
      const coordinates_start = Array.isArray(tracks[tornado.id])
        ? tracks[tornado.id][0]
        : tornado.coordinates_start;

      const coordinates_end = Array.isArray(tracks[tornado.id])
        ? tracks[tornado.id][tracks[tornado.id].length - 1]
        : tornado.coordinates_end;

      return {
        ...tornado,
        coordinates_start,
        coordinates_end,
      };
    });
  return events;
}
