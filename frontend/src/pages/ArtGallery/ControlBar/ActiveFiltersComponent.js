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
      unit10: "Global Contemporary"
    };
    
    return contentAreas[unitKey] || unitKey.replace("unit", "Unit ");
  };

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
              {getContentAreaName(filter)}
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
