import React, { useEffect } from "react";

function ActiveFiltersComponent({
  unitFilters,
  handleClearFilters,
  clearFilters,
  setUnitFilters, // Ensure this is received as a prop
}) {
  const activeFilters = Object.keys(unitFilters).filter(
    (unit) => unitFilters[unit]
  );

  // Save unitFilters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("unitFilters", JSON.stringify(unitFilters));
  }, [unitFilters]);

  // Load unitFilters from localStorage on mount
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("unitFilters"));
    if (savedFilters) {
      setUnitFilters(savedFilters); // Call setUnitFilters here
    }
  }, [setUnitFilters]);

  return (
    <div className="bottom-filter-section">
      <div className="active-filters">
        <span>Active Filters:</span>
        <div className="current-filters">
          {activeFilters.map((filter) => (
            <span key={filter} className="filter-tag">
              {filter.replace("unit", "Unit ")}
            </span>
          ))}
        </div>
      </div>

      <div className="filter-button-container">
        <button
          className="clear-filter-button"
          onClick={handleClearFilters}
          disabled={clearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default ActiveFiltersComponent;
