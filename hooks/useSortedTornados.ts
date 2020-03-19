import { useEffect, useState } from "react";
import { getSortFunction } from "../utils/getSortFunction";

type Props = {
  order: Common.Order;
  sortProperty: Common.SortProperty;
  tornados?: Array<TornadoEvent | SearchedTornadoEvent>;
};

export const useSortedTornados = ({ order, sortProperty, tornados }: Props) => {
  const [sortedTornados, setSortedTornados] = useState<
    Array<TornadoEvent | SearchedTornadoEvent>
  >();

  useEffect(() => {
    if (!tornados) {
      setSortedTornados(undefined);

      return;
    }

    const sortFunction = getSortFunction(order, sortProperty);

    // Sort sorts the elements of an array in place so we have to shallow copy to trigger a state change
    setSortedTornados([...tornados.sort(sortFunction)]);
  }, [order, sortProperty, tornados]);

  return sortedTornados;
};
