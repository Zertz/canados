import crypto from "crypto";
import { nanoid } from "nanoid/non-secure";

export function generateTornadoId(data: Object) {
  return crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
}

export function generateShortId() {
  return nanoid(4);
}
