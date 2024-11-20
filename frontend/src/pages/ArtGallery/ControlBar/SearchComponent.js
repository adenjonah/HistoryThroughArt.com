import React, { useState, useRef, useEffect } from "react";
import SortComponent from "./SortComponent";
import "./SearchComponent.css";

function SearchComponent({
  search,
  setSearch,
  setClearFilters,
  unitFilters,
  setUnitFilters,
  sort,
  setSort,
  searchBy,
  setSearchBy,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearch(searchValue);
    setClearFilters(
      searchValue.length === 0 &&
        Object.values(unitFilters).every((v) => !v) &&
        sort === "ID Ascending"
    );
  };

  const handleSearchByChange = (event) => {
    const searchValue = event.target.value;
    setSearchBy(searchValue);
    setClearFilters(
      searchValue.length === 0 &&
        Object.values(unitFilters).every((v) => !v) &&
        sort === "ID Ascending"
    );
  };

  const handleFilterChange = (unit) => {
    setUnitFilters((prevFilters) => ({
      ...prevFilters,
      [unit]: !prevFilters[unit],
    }));
    setClearFilters(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w3-row w3-padding">
      <div className="w3-col s4 m4 l2">
        <select
          className="w3-select w3-border w3-light-gray"
          value={searchBy}
          onChange={handleSearchByChange}
        >
          <option value={"all"}>By All</option>
          <option value="name">By Name</option>
          <option value="id">By ID</option>
          <option value="year">By Year</option>
          <option value="location">By Location</option>
        </select>
      </div>
      <div className="w3-col s8 m8 l5">
        <input
          type="text"
          className="w3-input w3-border"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <div className="w3-col s6 m6 l2" ref={dropdownRef}>
        <button
          className="w3-button w3-border w3-light-gray"
          onClick={toggleDropdown}
        >
          Filters {dropdownOpen ? "▲" : "▼"}
        </button>
        {dropdownOpen && (
          <div
            className="dropdown-content w3-border w3-light-gray"
            style={{ position: "absolute", zIndex: 1 }}
          >
            {Object.keys(unitFilters).map((unit) => (
              <div
                key={unit}
                className="dropdown-item"
                onClick={() => handleFilterChange(unit)}
              >
                <label>
                  <input type="checkbox" checked={unitFilters[unit]} readOnly />
                  {unit.replace("unit", "Unit ")} {unitFilters[unit] ? "✓" : ""}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      <SortComponent
        sort={sort}
        setSort={setSort}
        setClearFilters={setClearFilters}
      />
    </div>
  );
}

export default SearchComponent;
