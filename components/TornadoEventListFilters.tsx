import Multirange from "./react-multirange";

export default function TornadoEventListFilters({
  fujitaFilter,
  monthFilter,
  yearFilter,
  setFujitaFilter,
  setMonthFilter,
  setYearFilter,
}) {
  return (
    <>
      <div className="grid grid-rows-[1fr] grid-cols-[min-content,1fr,min-content] gap-4 items-center">
        <span>F0</span>
        <Multirange
          min={0}
          max={5}
          onChange={setFujitaFilter}
          values={fujitaFilter}
        />
        <span>F5</span>
      </div>
      <div className="grid grid-rows-[1fr] grid-cols-[min-content,1fr,min-content] gap-4 items-center">
        <span>Jan</span>
        <Multirange
          min={0}
          max={11}
          onChange={setMonthFilter}
          values={monthFilter}
        />
        <span>Dec</span>
      </div>
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
