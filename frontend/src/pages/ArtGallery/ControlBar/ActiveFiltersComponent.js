// ActiveFiltersComponent.js
import React from 'react';

function ActiveFiltersComponent({ unitFilters, handleClearFilters, clearFilters }) {
    const activeFilters = Object.keys(unitFilters).filter(unit => unitFilters[unit]);

    return (
        <div className="active-filters">
            <span>Active Filters:</span>
            {activeFilters.map((filter) => (
                <span key={filter} className="filter-tag">
                    {filter.replace('unit', 'Unit ')}
                </span>
            ))}

            <div className="filter-button-container">
                <button
                    className="control-bar-item"
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