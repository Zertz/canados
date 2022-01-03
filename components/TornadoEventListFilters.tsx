import { useMemo } from "react";
import { getMonthNames } from "../utils/getMonthNames";
import Multirange from "./react-multirange";

export default function TornadoEventListFilters({
  fujitaFilter,
  monthFilter,
  yearFilter,
  setYearFilter,
  toggleFujita,
  toggleMonth,
}: {
  fujitaFilter: number[];
  monthFilter: number[];
  yearFilter: [number, number];
  setYearFilter: (values: [number, number]) => void;
  toggleFujita: (fujita: number) => void;
  toggleMonth: (monthIndex: number) => void;
}) {
  const monthNames = useMemo(() => getMonthNames(), []);

  return (
    <>
      <fieldset className="flex justify-between gap-2 px-[7px] w-full">
        <legend className="sr-only">Fujita scale</legend>
        {Array.from(Array(6)).map((_, fujita) => (
          <div key={fujita} className="flex flex-col items-center">
            <div className="flex items-center h-5">
              <input
                checked={fujitaFilter.includes(fujita)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                id={`F${fujita}`}
                name={`F${fujita}`}
                onChange={() => toggleFujita(fujita)}
                type="checkbox"
                value={`F${fujita}`}
              />
            </div>
            <div className="mt-0.5 text-sm">
              <label className="text-gray-700" htmlFor={`F${fujita}`}>
                {`F${fujita}`}
              </label>
            </div>
          </div>
        ))}
      </fieldset>
      <fieldset className="flex gap-2">
        <legend className="sr-only">Months</legend>
        {monthNames.map((monthName, monthIndex) => (
          <div key={monthName} className="flex flex-col items-center">
            <div className="flex items-center h-5">
              <input
                checked={monthFilter.includes(monthIndex)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                id={monthName}
                name={monthName}
                onChange={() => toggleMonth(monthIndex)}
                type="checkbox"
                value={monthIndex}
              />
            </div>
            <div className="mt-0.5 text-sm">
              <label className="text-gray-700" htmlFor={monthName}>
                {monthName}
              </label>
            </div>
          </div>
        ))}
      </fieldset>
      <div className="grid grid-rows-[1fr] grid-cols-[min-content,1fr,min-content] gap-4 items-center">
        <span>1950</span>
        <Multirange
          min={1950}
          max={2021}
          onChange={setYearFilter}
          values={yearFilter}
        />
        <span>2021</span>
      </div>
    </>
  );
}
