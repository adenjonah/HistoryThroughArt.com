import React from "react";
import "./SearchComponent.css";
function SortComponent({ sort, setSort, setClearFilters }) {
  const handleSortChange = (event) => {
    const value = event.target.value;
    setSort(value);
    setClearFilters(value === "ID Ascending");
  };

  return (
    <div className="w3-col s6 m6 l3">
      <select
        className="w3-select w3-border w3-light-gray"
        value={sort}
        onChange={handleSortChange}
      >
        <option value="ID Ascending">Sort By: ID Ascending</option>
        <option value="ID Descending">Sort By: ID Descending</option>
        <option value="Name Ascending">Sort By: Name: A-Z</option>
        <option value="Name Descending">Sort By: Name: Z-A</option>
        <option value="Unit Ascending">Sort By: Unit Ascending</option>
        <option value="Unit Descending">Sort By: Unit Descending</option>
        <option value={"Date Ascending"}>Sort By: Date Ascending</option>
        <option value={"Date Descending"}>Sort By: Date Descending</option>
        <option value={"Korus Sort"}>Sort By: Korus Sort</option>
      </select>
    </div>
  );
}

export default SortComponent;
