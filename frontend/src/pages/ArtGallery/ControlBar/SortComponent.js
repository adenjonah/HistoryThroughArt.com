import React, { useEffect } from "react";

function SortComponent({ sort, setSort, setClearFilters }) {
  const handleSortChange = (event) => {
    const value = event.target.value;
    setSort(value);
    setClearFilters(value === "Relevance" || value === "ID Ascending");
    localStorage.setItem("sort", value);
  };

  useEffect(() => {
    const savedSort = localStorage.getItem("sort");
    if (savedSort) {
      setSort(savedSort);
      setClearFilters(savedSort === "Relevance" || savedSort === "ID Ascending");
    }
  }, [setSort, setClearFilters]);

  return (
    <div className="relative inline-block w-full">
      <label htmlFor="sort-select" className="sr-only">
        Sort artworks
      </label>
      <select
        id="sort-select"
        className="block w-full min-h-[44px] px-4 py-2 pr-8
                   border border-[var(--accent-color)]/50 rounded-lg
                   bg-white text-gray-800
                   cursor-pointer appearance-none
                   focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]
                   text-sm sm:text-base"
        value={sort}
        onChange={handleSortChange}
      >
        <option value="Relevance">Sort By: Relevance</option>
        <option value="ID Ascending">Sort By: ID Ascending</option>
        <option value="ID Descending">Sort By: ID Descending</option>
        <option value="Name Ascending">Sort By: Name: A-Z</option>
        <option value="Name Descending">Sort By: Name: Z-A</option>
        <option value="Unit Ascending">Sort By: Content Area Ascending</option>
        <option value="Unit Descending">Sort By: Content Area Descending</option>
        <option value="Date Ascending">Sort By: Date Ascending</option>
        <option value="Date Descending">Sort By: Date Descending</option>
        <option value="Korus Sort">Sort By: Korus Sort</option>
      </select>

      {/* Custom arrow icon */}
      <span
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
        aria-hidden="true"
      >
        &#x25BC;
      </span>
    </div>
  );
}

export default SortComponent;
