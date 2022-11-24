import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { useEffect, useState } from "react";

type Props = {
  query: string;
  search: (value: string) => void;
  setQuery: (query: string) => void;
};

export default function SearchForm({ query, search, setQuery }: Props) {
  const [value, setValue] = useState(query);

  useEffect(() => {
    search(query);
  }, [query, search]);

  const handleChange = ({ target: { value } }) => {
    setValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setQuery(value);
  };

  return (
    <form className="mb-2" onSubmit={handleSubmit}>
      <label htmlFor="search" className="sr-only">
        Search tornados
      </label>
      <div className="flex rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </div>
          <input
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 text-sm border-gray-300"
            id="search"
            onChange={handleChange}
            placeholder="Toronto"
            type="search"
            value={value}
          />
        </div>
        <button
          className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          disabled={!value}
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
}
