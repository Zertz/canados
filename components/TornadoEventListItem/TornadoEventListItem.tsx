import React, { useLayoutEffect, useRef } from "react";

type Props = {
  clusterCount: number;
  community: string;
  date?: Date;
  fujitas: number[];
  length_m?: number;
  onClick: () => void;
  province: string;
  relevance?: number;
  selected: boolean;
};

const TornadoEventListItem = function TornadoEventListItem({
  clusterCount,
  community,
  date,
  fujitas,
  length_m,
  onClick,
  province,
  selected
}: Props) {
  const listItem = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    if (!selected) {
      return;
    }

    listItem.current?.scrollIntoView({
      behavior: "auto",
      block: "center",
      inline: "start"
    });
  }, [selected]);

  // TODO: Display clustered list items, with general location and count
  const [minFujita, maxFujita] = fujitas.reduce(
    ([min, max], fujita) => [Math.min(min, fujita), Math.max(max, fujita)],
    [0, 0]
  );

  return (
    <li
      className="border-b border-gray-200 block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
      onClick={onClick}
      ref={listItem}
    >
      <div className="p-4 flex items-center sm:px-6">
        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            {clusterCount > 0 ? (
              <div className="text-sm leading-5 font-medium text-indigo-600 truncate">
                {`${clusterCount + 1} ${
                  minFujita === maxFujita
                    ? `F${minFujita}`
                    : `F${minFujita} to F${maxFujita}`
                }`}
                <span className="ml-1 font-normal text-gray-500">
                  {`near ${community}, ${province}`}
                </span>
              </div>
            ) : (
              <div className="text-sm leading-5 font-medium text-indigo-600 truncate">
                {`F${fujitas[0]}`}
                <span className="ml-1 font-normal text-gray-500">
                  {`in ${community}, ${province}`}
                </span>
              </div>
            )}
            {clusterCount === 0 && (
              <div className="mt-2 flex">
                {clusterCount === 0 && (
                  <div className="flex items-center text-sm leading-5 mr-2 text-gray-500">
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
                    {date && (
                      <span>
                        {`On `}
                        <time
                          dateTime={`${date.getFullYear()}-${date.getMonth() +
                            1}-${date.getDate()}`}
                        >
                          {date.toLocaleString()}
                        </time>
                      </span>
                    )}
                  </div>
                )}
                {length_m && (
                  <div className="flex items-center text-sm leading-5 text-gray-500">
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
            )}
          </div>
        </div>
        <div className="ml-5 flex-shrink-0">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </li>
  );
};

export default TornadoEventListItem;
