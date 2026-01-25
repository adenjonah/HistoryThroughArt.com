import React, { useState } from "react";
import SearchComponent from "./SearchComponent";
import ActiveFiltersComponent from "./ActiveFiltersComponent";

function ControlBar({
  search,
  setSearch,
  layout,
  setLayout,
  setSort,
  sort,
  unitFilters,
  setUnitFilters,
}) {
  const [clearFilters, setClearFilters] = useState(true);

  const handleClearFilters = () => {
    setUnitFilters({
      unit1: false,
      unit2: false,
      unit3: false,
      unit4: false,
      unit5: false,
      unit6: false,
      unit7: false,
      unit8: false,
      unit9: false,
      unit10: false,
    });
    setSort("Relevance");
    setSearch("");
    setClearFilters(true);
  };

  const areFiltersActive = Object.values(unitFilters).some((filter) => filter);

  return (
    <div className="bg-[var(--foreground-color)] rounded-xl shadow-lg p-4 sm:p-6 max-w-6xl mx-auto">
      <SearchComponent
        search={search}
        setSearch={setSearch}
        setClearFilters={setClearFilters}
        unitFilters={unitFilters}
        setUnitFilters={setUnitFilters}
        sort={sort}
        setSort={setSort}
      />
      {areFiltersActive && (
        <ActiveFiltersComponent
          unitFilters={unitFilters}
          handleClearFilters={handleClearFilters}
          clearFilters={clearFilters}
          setUnitFilters={setUnitFilters}
        />
      )}
    </div>
  );
}

export default ControlBar;
