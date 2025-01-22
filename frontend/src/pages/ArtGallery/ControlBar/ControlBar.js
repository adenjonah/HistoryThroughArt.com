import React, { useState } from "react";
import SearchComponent from "./SearchComponent";
import ActiveFiltersComponent from "./ActiveFiltersComponent";
import "./ControlBar.css";

function ControlBar({
  search,
  setSearch,
  layout,
  setLayout,
  setSort,
  sort,
  unitFilters,
  setUnitFilters,
  searchBy,
  setSearchBy,
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
    });
    setSort("Korus Sort");
    setSearch("");
    setClearFilters(true);
  };

  const areFiltersActive = Object.values(unitFilters).some((filter) => filter);

  return (
    <div className="w3-card-4 w3-padding w3-center control-bar-container">
      <SearchComponent
        search={search}
        setSearch={setSearch}
        setClearFilters={setClearFilters}
        unitFilters={unitFilters}
        setUnitFilters={setUnitFilters} // Pass setUnitFilters
        sort={sort}
        setSort={setSort}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
      />
      {areFiltersActive && (
        <ActiveFiltersComponent
          unitFilters={unitFilters}
          handleClearFilters={handleClearFilters}
          clearFilters={clearFilters}
          setUnitFilters={setUnitFilters} // Pass setUnitFilters
        />
      )}
    </div>
  );
}

export default ControlBar;
