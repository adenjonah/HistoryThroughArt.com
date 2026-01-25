import React, { useEffect } from "react";

function ActiveFiltersComponent({
  unitFilters,
  handleClearFilters,
  clearFilters,
  setUnitFilters,
}) {
  const activeFilters = Object.keys(unitFilters).filter(
    (unit) => unitFilters[unit]
  );

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

  // Remove a single filter
  const handleRemoveFilter = (unit) => {
    setUnitFilters((prev) => ({
      ...prev,
      [unit]: false,
    }));
  };

  // Save unitFilters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("unitFilters", JSON.stringify(unitFilters));
  }, [unitFilters]);

  // Load unitFilters from localStorage on mount
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("unitFilters"));
    if (savedFilters) {
      setUnitFilters(savedFilters);
    }
  }, [setUnitFilters]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 p-3 bg-[var(--accent-color)]/20 rounded-lg">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-[var(--text-color)]">
          Active Filters:
        </span>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <span
              key={filter}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                         text-xs sm:text-sm font-medium
                         bg-[var(--foreground-color)] text-[var(--background-color)]"
            >
              {getContentAreaName(filter)}
              <button
                onClick={() => handleRemoveFilter(filter)}
                className="ml-1 text-[var(--accent-color)] hover:text-red-600 transition-colors
                           focus:outline-none focus:ring-1 focus:ring-red-400 rounded-full"
                aria-label={`Remove ${getContentAreaName(filter)} filter`}
              >
                &#x2715;
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        className="min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium
                   bg-[var(--button-color)] text-[var(--button-text-color)]
                   hover:bg-[var(--accent-color)] hover:text-[var(--text-color)]
                   transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleClearFilters}
        disabled={clearFilters}
      >
        Clear All Filters
      </button>
    </div>
  );
}

export default ActiveFiltersComponent;
