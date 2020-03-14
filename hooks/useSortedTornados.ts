import { useEffect, useState } from "react";

function getSortFunction(
  order: Common.Order,
  sortProperty: Common.SortProperty
) {
  switch (sortProperty) {
    case "date": {
      return (a, b) =>
        order === "ascending"
          ? a.date - b.date ||
            a.fujita - b.fujita ||
            a.province.localeCompare(b.province) ||
            a.community.localeCompare(b.community)
          : b.date - a.date ||
            b.fujita - a.fujita ||
            b.province.localeCompare(a.province) ||
            b.community.localeCompare(a.community);
    }
    case "distance": {
      return (a, b) => {
        if (typeof a.length_m !== "number") {
          return 1;
        }

        if (typeof b.length_m !== "number") {
          return -1;
        }

        return order === "ascending"
          ? a.length_m - b.length_m
          : b.length_m - a.length_m;
      };
    }
    case "fujita": {
      return (a, b) =>
        order === "ascending"
          ? a.fujita - b.fujita ||
            a.date - b.date ||
            a.province.localeCompare(b.province) ||
            a.community.localeCompare(b.community)
          : b.fujita - a.fujita ||
            b.date - a.date ||
            b.province.localeCompare(a.province) ||
            b.community.localeCompare(a.community);
    }
    case "location": {
      return (a, b) =>
        order === "ascending"
          ? a.province.localeCompare(b.province) ||
            a.community.localeCompare(b.community) ||
            a.date - b.date ||
            a.fujita - b.fujita
          : b.province.localeCompare(a.province) ||
            b.community.localeCompare(a.community) ||
            b.date - a.date ||
            b.fujita - a.fujita;
    }
  }
}

type Props = {
  filter: string;
  order: Common.Order;
  sortProperty: Common.SortProperty;
  tornados: TornadoEvent[];
};

export const useSortedTornados = ({
  filter,
  order,
  sortProperty,
  tornados
}: Props) => {
  const [sortedTornados, setSortedTornados] = useState<TornadoEvent[]>();

  useEffect(() => {
    if (filter) {
      setSortedTornados(tornados);

      return;
    }

    const sortFunction = getSortFunction(order, sortProperty);

    // Sort sorts the elements of an array in place so we have to shallow copy to trigger a state change
    setSortedTornados([...tornados.sort(sortFunction)]);
  }, [filter, order, sortProperty, tornados]);

  return sortedTornados;
};
