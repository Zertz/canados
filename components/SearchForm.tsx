import { useEffect, useState } from "react";
import { useSearchParamState } from "../hooks/useSearchParamState";

type Props = {
  search: (value: string) => void;
};

const string = (v?: string) => v || "";

const getCleanQuery = (query = "") => query.trim().replace(/\s\s+/g, " ");

export default function SearchForm({ search }: Props) {
  const [query, setQuery] = useSearchParamState<string>("q", string, string);
  const [value, setValue] = useState(query || "");

  useEffect(() => {
    search(getCleanQuery(query));
  }, [query]);

  const handleChange = ({ target: { value } }) => {
    setValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setQuery(getCleanQuery(value));
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <label htmlFor="search" className="sr-only">
        Search tornados
      </label>
      <div className="flex rounded-md shadow-md">
        <div className="relative flex-grow focus-within:z-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            className="form-input block rounded-none rounded-l-md pl-10 transition ease-in-out duration-150 sm:text-sm sm:leading-5 w-full h-full"
            id="search"
            onChange={handleChange}
            placeholder="Toronto"
            type="search"
            value={value}
          />
        </div>
        <button
          className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
          disabled={!value}
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
}
