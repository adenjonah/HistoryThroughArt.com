import React, { useEffect } from "react";
import { X } from "lucide-react";
import { getContentAreaNameByKey } from "../../../data/contentAreas";

function ActiveFiltersComponent({
  unitFilters,
  handleClearFilters,
  clearFilters,
  setUnitFilters,
}) {
  const activeFilters = Object.keys(unitFilters).filter(
    (unit) => unitFilters[unit]
  );

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
    const stored = localStorage.getItem("unitFilters");
    if (!stored) return;
    try {
      const savedFilters = JSON.parse(stored);
      if (savedFilters) {
        setUnitFilters(savedFilters);
      }
    } catch {
      // Ignore corrupt stored filters and keep current state
    }
  }, [setUnitFilters]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 p-3 bg-[var(--surface-2)] border border-[var(--border-soft)] rounded-lg">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-[var(--text-muted)]">
          Active Filters:
        </span>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <span
              key={filter}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                         text-xs sm:text-sm font-medium
                         bg-[var(--surface-3)] border border-[var(--border-gold)]
                         text-[var(--text-default)]"
            >
              {getContentAreaNameByKey(filter)}
              <button
                onClick={() => handleRemoveFilter(filter)}
                className="ml-1 text-[var(--text-muted)] hover:text-[var(--gold-soft)] transition-colors
                           focus:outline-none focus:ring-1 focus:ring-[var(--gold-color)] rounded-full"
                aria-label={`Remove ${getContentAreaNameByKey(filter)} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        className="min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium
                   bg-[var(--gold-color)] text-[var(--ink-on-gold)]
                   hover:bg-[var(--gold-soft)] transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-[var(--gold-color)] focus:ring-offset-2
                   disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={handleClearFilters}
        disabled={clearFilters}
      >
        Clear All Filters
      </button>
    </div>
  );
}

export default ActiveFiltersComponent;
