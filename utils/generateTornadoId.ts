import crypto from "crypto";

export function generateTornadoId(data: Object) {
  return crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
}
