export function getFilteredTornados({
  filters: {
    fujita: [minFujita, maxFujita],
    month: [minMonth, maxMonth],
  },
  tornados,
}: {
  filters: { fujita: [number, number]; month: [number, number] };
  tornados: Tornado[];
}) {
  if (minFujita === 0 && maxFujita === 5 && minMonth === 0 && maxMonth === 11) {
    return tornados;
  }

  return tornados.filter(({ date, fujita }) => {
    if (fujita < minFujita) {
      return false;
    }

    if (fujita > maxFujita) {
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
