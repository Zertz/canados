export function arrayify(data: Object[]) {
  return data.map((value) => Object.values(value));
}
