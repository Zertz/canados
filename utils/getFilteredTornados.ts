export function getFilteredTornados({
  filters: {
    fujita: [minFujita, maxFujita],
  },
  tornados,
}: {
  filters: { fujita: [number, number] };
  tornados: Tornado[];
}) {
  const filteredTornados =
    minFujita === 0 && maxFujita === 5
      ? tornados
      : tornados.filter(
          ({ fujita }) => fujita >= minFujita && fujita <= maxFujita
        );

  return filteredTornados;
}
