import React, { useState, useRef, useEffect } from "react";
import SortComponent from "./SortComponent";

function SearchComponent({
  search,
  setSearch,
  setClearFilters,
  unitFilters,
  setUnitFilters,
  sort,
  setSort,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const wasEmpty = search.length === 0;
    const isNowEmpty = value.length === 0;

    setSearch(value);

    // Auto-switch sort based on search state
    if (wasEmpty && !isNowEmpty) {
      // Started typing: switch to Relevance
      setSort("Relevance");
    } else if (!wasEmpty && isNowEmpty) {
      // Cleared search: switch back to ID Ascending
      setSort("ID Ascending");
    }

    setClearFilters(
      value.length === 0 &&
        Object.values(unitFilters).every((v) => !v) &&
        (sort === "ID Ascending" || sort === "Relevance")
    );
  };

  const handleFilterChange = (unit) => {
    setUnitFilters((prev) => ({
      ...prev,
      [unit]: !prev[unit],
    }));
    setClearFilters(false);
  };

  const getContentAreaName = (unitKey) => {
    const contentAreas = {
      unit1: "Global Prehistory",
      unit2: "Ancient Mediterranean",
      unit3: "Early Europe and Colonial Americas",
      unit4: "Later Europe and Americas",
      unit5: "Indigenous Americas",
      unit6: "Africa",
      unit7: "West and Central Asia",
      unit8: "South, East, and Southeast Asia",
      unit9: "The Pacific",
      unit10: "Global Contemporary",
    };

    return contentAreas[unitKey] || unitKey.replace("unit", "Unit ");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  // Keyboard navigation for dropdown items
  const handleListItemKeyDown = (e, unit) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFilterChange(unit);
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 bg-[var(--foreground-color)] rounded-xl">
      <div className="grid grid-cols-12 gap-2 sm:gap-3">
        {/* Search Input - white bg with dark text for max contrast */}
        <div className="col-span-12 lg:col-span-7">
          <label htmlFor="gallery-search" className="sr-only">
            Search artworks
          </label>
          <input
            id="gallery-search"
            type="search"
            className="w-full min-h-[44px] p-2 border border-[var(--accent-color)]/50 rounded-lg
                       bg-white text-gray-800
                       focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]
                       placeholder:text-gray-500 text-sm sm:text-base"
            placeholder="Search by ID, name, year, location..."
            value={search}
            onChange={handleSearchChange}
            aria-describedby="search-hint"
          />
          <span id="search-hint" className="sr-only">
            Smart search: ID matches shown first, then names, years, and locations
          </span>
        </div>

        {/* Filter Dropdown - dark text on light bg for contrast */}
        <div
          className="col-span-6 lg:col-span-2 relative"
          ref={dropdownRef}
        >
          <button
            className="flex items-center justify-between w-full min-h-[44px] px-4 py-2
                       border border-[var(--accent-color)]/50 rounded-lg
                       bg-white text-gray-800
                       hover:bg-gray-50 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]
                       text-sm sm:text-base"
            onClick={toggleDropdown}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            aria-controls="filter-listbox"
            aria-label="Filter by content area"
          >
            <span>Filters</span>
            <span className="ml-2">{dropdownOpen ? "\u25B2" : "\u25BC"}</span>
          </button>
          {dropdownOpen && (
            <ul
              role="listbox"
              id="filter-listbox"
              aria-label="Content area filters"
              className="absolute mt-1 w-full min-w-[200px] bg-white border border-[var(--accent-color)]/30
                         rounded-lg shadow-lg z-20 max-h-[300px] overflow-y-auto"
            >
              {Object.keys(unitFilters).map((unit) => (
                <li
                  key={unit}
                  role="option"
                  aria-selected={unitFilters[unit]}
                  tabIndex={0}
                  className="p-3 hover:bg-[var(--accent-color)]/10 cursor-pointer
                             focus:bg-[var(--accent-color)]/20 focus:outline-none
                             text-sm text-gray-700"
                  onClick={() => handleFilterChange(unit)}
                  onKeyDown={(e) => handleListItemKeyDown(e, unit)}
                >
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-[var(--button-color)]
                                 focus:ring-[var(--button-color)]"
                      checked={unitFilters[unit]}
                      readOnly
                    />
                    <span className="flex-1">{getContentAreaName(unit)}</span>
                    {unitFilters[unit] && (
                      <span className="text-[var(--button-color)]">
                        &#x2713;
                      </span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="col-span-6 lg:col-span-3">
          <SortComponent
            sort={sort}
            setSort={setSort}
            setClearFilters={setClearFilters}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchComponent;
