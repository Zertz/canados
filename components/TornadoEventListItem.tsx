import classnames from "classnames";
import format from "date-fns/format";

type Props = {
  date: Date;
  fujita: number;
  length_m?: number;
  location: string;
  onClick: () => void;
  selected: boolean;
};

export default function TornadoEventListItem({
  date,
  fujita,
  length_m,
  location,
  onClick,
  selected,
}: Props) {
  return (
    <li
      className={classnames(
        "border-b border-gray-200 block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out",
        {
          "bg-gray-100": selected,
        }
      )}
      onClick={onClick}
    >
      <div className="p-4 flex items-center sm:px-6">
        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="w-full">
            <div className="text-sm leading-5 font-medium text-indigo-600 truncate">
              {`F${fujita}`}
              <span className="ml-1 font-normal text-gray-500">
                {`in ${location}`}
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center text-sm leading-5 mr-2 text-gray-500 overflow-hidden">
                <svg
                  className="flex-shrink-0 mr-1 h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="truncate">
                  <time dateTime={date.toISOString()}>
                    {format(date, "MMMM do yyyy 'at' h:mm a")}
                  </time>
                </span>
              </div>
              {!!length_m && (
                <div className="flex items-center text-sm leading-5 text-gray-500 whitespace-no-wrap">
                  <svg
                    className="flex-shrink-0 mr-1 h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {`${(length_m / 1000).toFixed(1)} km`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
