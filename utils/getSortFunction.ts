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
            a.location.localeCompare(b.location)
          : b.date - a.date ||
            b.fujita - a.fujita ||
            b.location.localeCompare(a.location);
    }
    case "fujita": {
      return (a, b) =>
        order === "ascending"
          ? a.fujita - b.fujita ||
            a.date - b.date ||
            a.location.localeCompare(b.location)
          : b.fujita - a.fujita ||
            b.date - a.date ||
            b.location.localeCompare(a.location);
    }
    case "location": {
      return (a, b) =>
        order === "ascending"
          ? a.location.localeCompare(b.location) ||
            a.date - b.date ||
            a.fujita - b.fujita
          : b.location.localeCompare(a.location) ||
            b.date - a.date ||
            b.fujita - a.fujita;
    }
  }
}
