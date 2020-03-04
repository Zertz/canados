import { useEffect, useState } from "react";
import { useAPI } from "./useAPI";

function sorter(order, sortProperty) {
  switch (sortProperty) {
    case "community":
    case "province": {
      return (a, b) =>
        order === "asc"
          ? a[sortProperty].localeCompare(b[sortProperty])
          : b[sortProperty].localeCompare(a[sortProperty]);
    }
    case "date": {
      return (a, b) =>
        order === "asc"
          ? a[sortProperty] - b[sortProperty]
          : b[sortProperty] - a[sortProperty];
    }
    default: {
      return (a, b) => {
        if (typeof a[sortProperty] !== "number") {
          return 1;
        }

        if (typeof b[sortProperty] !== "number") {
          return -1;
        }

        return order === "asc"
          ? a[sortProperty] - b[sortProperty]
          : b[sortProperty] - a[sortProperty];
      };
    }
  }
}

export const useTornadoEvents = ({
  order,
  sortProperty
}: {
  order: Common.Order;
  sortProperty: keyof TornadoEvent;
}) => {
  const [tornadoEvents, setTornadoEvents] = useState<TornadoEvent[] | null>();
  const { data, error, load, loading } = useAPI("/api/tornado-events");

  useEffect(() => {
    if (!data) {
      setTornadoEvents(null);

      return;
    }

    setTornadoEvents(data.sort(sorter(order, sortProperty)));
  }, [data, order, sortProperty]);

  return {
    error,
    load,
    loading,
    tornadoEvents
  };
};
