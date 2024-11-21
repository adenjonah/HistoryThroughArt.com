import React from "react";

function ActiveFiltersComponent({
  unitFilters,
  handleClearFilters,
  clearFilters,
}) {
  const activeFilters = Object.keys(unitFilters).filter(
    (unit) => unitFilters[unit]
  );

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
