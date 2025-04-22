// SearchComponent.js
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setClearFilters(
      value.length === 0 &&
        Object.values(unitFilters).every((v) => !v) &&
        sort === "ID Ascending"
    );
  };

  const handleSearchByChange = (e) => {
    const value = e.target.value;
    setSearchBy(value);
    setClearFilters(
      value.length === 0 &&
        Object.values(unitFilters).every((v) => !v) &&
        sort === "ID Ascending"
    );
  };

  const handleFilterChange = (unit) => {
    setUnitFilters((prev) => ({
      ...prev,
      [unit]: !prev[unit],
    }));
    setClearFilters(false);
  };

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 m-4 border border-gray-300 bg-white rounded shadow-sm">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4 sm:col-span-4 md:col-span-4 lg:col-span-2">
          <select
            className="w-full p-2 border border-gray-300 rounded bg-gray-200 text-gray-700"
            value={searchBy}
            onChange={handleSearchByChange}
          >
            <option value="all">By All</option>
            <option value="name">By Name</option>
            <option value="id">By ID</option>
            <option value="year">By Year</option>
            <option value="location">By Location</option>
          </select>
        </div>

        <div className="col-span-8 sm:col-span-8 md:col-span-8 lg:col-span-5">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded text-gray-700"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div
          className="col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-2 relative"
          ref={dropdownRef}
        >
          <button
            className="flex items-center w-full px-4 py-2 border border-gray-300 rounded bg-gray-200 text-gray-700 justify-between"
            onClick={toggleDropdown}
          >
            <span>Filters</span>
            <span>{dropdownOpen ? "▲" : "▼"}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow z-10">
              {Object.keys(unitFilters).map((unit) => (
                <div
                  key={unit}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleFilterChange(unit)}
                >
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4"
                      checked={unitFilters[unit]}
                      readOnly
                    />
                    <span>
                      {getContentAreaName(unit)}
                      {unitFilters[unit] ? " ✓" : ""}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-3">
          <SortComponent
            sort={sort}
            setSort={setSort}
            setClearFilters={setClearFilters}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchComponent;
