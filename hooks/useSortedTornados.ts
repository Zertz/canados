import { useEffect, useState } from "react";

function getSortFunction(order, sortProperty) {
  switch (sortProperty) {
    case "date": {
      return (a, b) =>
        order === "asc"
          ? a.date - b.date ||
            a.fujita - b.fujita ||
            a.province.localeCompare(b.province) ||
            a.community.localeCompare(b.community)
          : b.date - a.date ||
            b.fujita - a.fujita ||
            b.province.localeCompare(a.province) ||
            b.community.localeCompare(a.community);
    }
    case "fujita": {
      return (a, b) =>
        order === "asc"
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
        order === "asc"
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
  order: Common.Order;
  sortProperty: Common.SortProperty;
  tornados: TornadoEvent[];
};

export const useSortedTornados = ({ order, sortProperty, tornados }: Props) => {
  const [sortedTornados, setSortedTornados] = useState<TornadoEvent[]>();

  useEffect(() => {
    const sortFunction = getSortFunction(order, sortProperty);

    // Sort sorts the elements of an array in place so we have to shallow copy to trigger a change
    setSortedTornados([...tornados.sort(sortFunction)]);
  }, [order, sortProperty, tornados]);

  return sortedTornados;
};
