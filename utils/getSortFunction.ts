export function getSortFunction(
  order: Common.Order,
  sortProperty: Common.SortProperty
) {
  switch (sortProperty) {
    case "date": {
      return (a, b) =>
        order === "ascending"
          ? a.date - b.date ||
            a.fujita - b.fujita ||
            a.length_m - b.length_m ||
            a.region_code.localeCompare(b.region_code)
          : b.date - a.date ||
            b.fujita - a.fujita ||
            b.length_m - a.length_m ||
            b.region_code.localeCompare(a.region_code);
    }
    case "distance": {
      return (a, b) =>
        order === "ascending"
          ? a.length_m - b.length_m ||
            a.date - b.date ||
            a.fujita - b.fujita ||
            a.region_code.localeCompare(b.region_code)
          : b.length_m - a.length_m ||
            b.date - a.date ||
            b.fujita - a.fujita ||
            b.region_code.localeCompare(a.region_code);
    }
    case "fujita": {
      return (a, b) =>
        order === "ascending"
          ? a.fujita - b.fujita ||
            a.date - b.date ||
            a.length_m - b.length_m ||
            a.region_code.localeCompare(b.region_code)
          : b.fujita - a.fujita ||
            b.date - a.date ||
            b.length_m - a.length_m ||
            b.region_code.localeCompare(a.region_code);
    }
    case "region_code": {
      return (a, b) =>
        order === "ascending"
          ? a.region_code.localeCompare(b.region_code) ||
            a.date - b.date ||
            a.fujita - b.fujita ||
            a.length_m - b.length_m
          : b.region_code.localeCompare(a.region_code) ||
            b.date - a.date ||
            b.fujita - a.fujita ||
            b.length_m - a.length_m;
    }
  }
}
