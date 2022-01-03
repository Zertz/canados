export function getFilteredTornados({
  filters: {
    fujita: [minFujita, maxFujita],
    month,
    year: [minYear, maxYear],
  },
  tornados,
}: {
  filters: {
    fujita: [number, number];
    month: number[];
    year: [number, number];
  };
  tornados: Tornado[];
}) {
  if (
    minFujita === 0 &&
    maxFujita === 5 &&
    month.length === 12 &&
    minYear === 1950 &&
    maxYear === 2021
  ) {
    return tornados;
  }

  return tornados.filter(({ date, fujita }) => {
    if (fujita < minFujita) {
      return false;
    }

    if (fujita > maxFujita) {
      return false;
    }

    if (date.getFullYear() < minYear) {
      return false;
    }

    if (date.getFullYear() > maxYear) {
      return false;
    }

    if (!month.includes(date.getMonth())) {
      return false;
    }

    return true;
  });
}
