import crypto from "crypto";

export function generateTornadoId(tornado) {
  const { community, coordinates_start, coordinates_end, date } = tornado;

  return {
    id: crypto
      .createHash("md5")
      .update(
        JSON.stringify({ community, coordinates_start, coordinates_end, date })
      )
      .digest("hex"),
    ...tornado
  };
}
