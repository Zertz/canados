export function getFilteredTornados({
  filters,
  filters: {
    year: [minYear, maxYear],
  },
  tornados,
}: {
  filters: {
    fujita: number[];
    month: number[];
    year: [number, number];
  };
  tornados: Tornado[];
}) {
  if (
    filters.fujita.length === 6 &&
    filters.month.length === 12 &&
    minYear === 1950 &&
    maxYear === 2021
  ) {
    return tornados;
  }

  return tornados.filter(({ date, fujita }) => {
    if (!filters.fujita.includes(fujita)) {
      return false;
    }

    if (date.getFullYear() < minYear) {
      return false;
    }

    if (date.getFullYear() > maxYear) {
      return false;
    }

    if (!filters.month.includes(date.getMonth())) {
      return false;
    }

    return true;
  });
}
