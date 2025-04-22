import React, { useEffect } from "react";
import "./SearchComponent.css";

function SortComponent({ sort, setSort, setClearFilters }) {
  const handleSortChange = (event) => {
    const value = event.target.value;
    setSort(value);
    setClearFilters(value === "ID Ascending");
    localStorage.setItem("sort", value);
  };

  useEffect(() => {
    const savedSort = localStorage.getItem("sort");
    if (savedSort) {
      setSort(savedSort);
      setClearFilters(savedSort === "ID Ascending");
    }
  }, [setSort, setClearFilters]);

  return (
    <div className="relative inline-block w-full">
      <select
        className="
          block w-full px-4 py-2
          border border-gray-300 rounded
          bg-gray-200 text-gray-700
          cursor-pointer
          appearance-none
        "
        value={sort}
        onChange={handleSortChange}
      >
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

      {/* Custom arrow icon, absolutely positioned on the right side. */}
      <span
        className="
        pointer-events-none
        absolute
        inset-y-0
        right-0
        flex
        items-center
        pr-3
        text-gray-700
      "
      >
        ▼
      </span>
    </div>
  );
}

export default SortComponent;
