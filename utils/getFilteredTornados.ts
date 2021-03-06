export function getFilteredTornados({
  filters: {
    fujita: [minFujita, maxFujita],
    month: [minMonth, maxMonth],
    year: [minYear, maxYear],
  },
  tornados,
}: {
  filters: {
    fujita: [number, number];
    month: [number, number];
    year: [number, number];
  };
  tornados: Tornado[];
}) {
  if (
    minFujita === 0 &&
    maxFujita === 5 &&
    minMonth === 0 &&
    maxMonth === 11 &&
    minYear === 1950 &&
    maxYear === 2018
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

    if (date.getMonth() < minMonth) {
      return false;
    }

    if (date.getMonth() > maxMonth) {
      return false;
    }

    return true;
  });
}
