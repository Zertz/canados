import { parse } from "date-fns";

export function parseTornadoDate({
  HHMM_LOCAL,
  YYYY_LOCAL,
  MM_LOCAL,
  DD_LOCAL
}) {
  const [hh, mm] = HHMM_LOCAL
    ? [
        `${Math.floor(HHMM_LOCAL / 100).toFixed()}`.padStart(2, "0"),
        `${HHMM_LOCAL}`.substring(`${HHMM_LOCAL}`.length - 2)
      ]
    : ["00", "00"];

  return parse(
    `${YYYY_LOCAL}-${MM_LOCAL || "01"}-${DD_LOCAL || "01"} ${hh}:${mm}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
}
