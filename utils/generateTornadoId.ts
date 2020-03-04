import crypto from "crypto";

export function generateTornadoId({
  coordinates_start,
  coordinates_end,
  ...tornado
}) {
  return {
    id: crypto
      .createHash("md5")
      .update(JSON.stringify({ coordinates_start, coordinates_end }))
      .digest("hex"),
    coordinates_start,
    coordinates_end,
    ...tornado
  };
}
