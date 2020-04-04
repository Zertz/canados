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
  } = rawTracks
    .map(
      ({
        geometry,
        properties: {
          YYYY_LOCAL,
          MM_LOCAL,
          DD_LOCAL,
          HHMM_LOCAL,
          NEAR_CMMTY,
          PROVINCE,
        },
      }) => {
        const coordinates = geometry.coordinates.map((pair) => pair.reverse());
        const coordinates_start = coordinates[0];
        const coordinates_end = coordinates[coordinates.length - 1];

        const date = parseTornadoDate({
          HHMM_LOCAL,
          YYYY_LOCAL,
          MM_LOCAL,
          DD_LOCAL,
        });

        return {
          id: generateTornadoId({
            coordinates_start,
            coordinates_end,
            date,
            location: `${NEAR_CMMTY}, ${PROVINCE}`,
          }),
          coordinates,
        };
      }
    )
    .reduce(
      (acc, { id, coordinates }) => ({
        ...acc,
        [id]: coordinates,
      }),
      {}
    );

  const events: RawTornado[] = rawEvents
    .map(
      ({
        properties: {
          YYYY_LOCAL,
          MM_LOCAL,
          DD_LOCAL,
          HHMM_LOCAL,
          NEAR_CMMTY,
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

        const location = `${NEAR_CMMTY}, ${PROVINCE}`;

        return {
          id: generateTornadoId({
            coordinates_start,
            coordinates_end,
            date,
            location,
          }),
          coordinates_start,
          coordinates_end,
          date,
          fujita: Number(FUJITA),
          location,
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
