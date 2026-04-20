import React, { useState, useRef, useEffect } from "react";
import SortComponent from "./SortComponent";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

const CONTENT_AREAS = {
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

function getContentAreaName(unitKey) {
  return CONTENT_AREAS[unitKey] || unitKey.replace("unit", "Unit ");
}

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

    if (wasEmpty && !isNowEmpty) setSort("Relevance");
    else if (!wasEmpty && isNowEmpty) setSort("ID Ascending");

    setClearFilters(
      value.length === 0 &&
        Object.values(unitFilters).every((v) => !v) &&
        (sort === "ID Ascending" || sort === "Relevance")
    );
  };

  const handleFilterChange = (unit) => {
    setUnitFilters((prev) => ({ ...prev, [unit]: !prev[unit] }));
    setClearFilters(false);
  };

  const handleListItemKeyDown = (e, unit) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFilterChange(unit);
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeFilterCount = Object.values(unitFilters).filter(Boolean).length;

  return (
    <div className="grid grid-cols-12 gap-2 sm:gap-3">
      {/* Search Input */}
      <div className="col-span-12 lg:col-span-7">
        <label htmlFor="gallery-search" className="sr-only">Search artworks</label>
        <Input
          id="gallery-search"
          type="search"
          className="min-h-[44px]
                     bg-[var(--background-color)] border-[var(--accent-color)]/50
                     text-[var(--text-color)] placeholder:text-[var(--text-color)]/50
                     focus-visible:ring-[var(--button-color)]"
          placeholder="Search by ID, name, year, location..."
          value={search}
          onChange={handleSearchChange}
          aria-describedby="search-hint"
        />
        <span id="search-hint" className="sr-only">
          Smart search: ID matches shown first, then names, years, and locations
        </span>
      </div>

      {/* Filter Dropdown */}
      <div className="col-span-6 lg:col-span-2 relative" ref={dropdownRef}>
        <button
          className="flex items-center justify-between w-full min-h-[44px] px-4 py-2
                     border border-[var(--accent-color)]/50 rounded-lg
                     bg-[var(--background-color)] text-[var(--text-color)]
                     hover:bg-[var(--accent-color)]/20 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]
                     text-sm sm:text-base"
          onClick={() => setDropdownOpen((o) => !o)}
          aria-expanded={dropdownOpen}
          aria-haspopup="listbox"
          aria-controls="filter-listbox"
          aria-label="Filter by content area"
        >
          <span>
            Filters{activeFilterCount > 0 && (
              <span className="ml-1.5 bg-[var(--button-color)] text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </span>
          <ChevronDown
            className={`ml-2 w-4 h-4 opacity-70 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {dropdownOpen && (
          <ul
            role="listbox"
            id="filter-listbox"
            aria-label="Content area filters"
            className="absolute mt-1 w-full min-w-[220px] z-20
                       bg-[var(--background-color)] border border-[var(--accent-color)]/40
                       rounded-lg shadow-xl shadow-black/40
                       max-h-[300px] overflow-y-auto
                       animate-in fade-in-0 zoom-in-95 duration-100"
          >
            {Object.keys(unitFilters).map((unit) => {
              const isChecked = unitFilters[unit];
              return (
                <li
                  key={unit}
                  role="option"
                  aria-selected={isChecked}
                  tabIndex={0}
                  className="p-3 hover:bg-[var(--accent-color)]/20 cursor-pointer
                             focus:bg-[var(--accent-color)]/20 focus:outline-none
                             text-sm text-[var(--text-color)]"
                  onClick={() => handleFilterChange(unit)}
                  onKeyDown={(e) => handleListItemKeyDown(e, unit)}
                >
                  <span className="flex items-center gap-3">
                    {/* Custom checkbox */}
                    <span
                      className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-[var(--button-color)] border-[var(--button-color)]"
                          : "border-[var(--accent-color)] bg-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      {isChecked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                        </svg>
                      )}
                    </span>
                    <span className="flex-1">{getContentAreaName(unit)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Sort */}
      <div className="col-span-6 lg:col-span-3">
        <SortComponent sort={sort} setSort={setSort} setClearFilters={setClearFilters} />
      </div>
    </div>
  );
}

export default SearchComponent;
