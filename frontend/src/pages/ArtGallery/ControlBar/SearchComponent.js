import React from 'react';
import "./SearchComponent.css";

function SearchComponent({
    search,
    setSearch,
    setClearFilters,
    unitFilters,
    setUnitFilters,
    sort,
    searchBy,
    setSearchBy
}) {

    const handleSearchChange = (event) => {
        const searchValue = event.target.value;
        setSearch(searchValue);
        setClearFilters(
            searchValue.length === 0 &&
            Object.values(unitFilters).every(v => !v) &&
            sort === 'ID Ascending'
        );
    };

    const handleSearchByChange = (event) => {
        const searchValue = event.target.value;
        setSearchBy(searchValue);
        setClearFilters(
            searchValue.length === 0 &&
            Object.values(unitFilters).every(v => !v) &&
            sort === 'ID Ascending'
        );
    };

    const handleFilterChange = (event) => {
        const { value } = event.target;
        setUnitFilters(prevFilters => ({
            ...prevFilters,
            [value]: !prevFilters[value]
        }));
        setClearFilters(false);
    };

    return (
        <div className="search-input-container">
            <select className="search-by" value={searchBy} onChange={handleSearchByChange}>
                <option value="name">By Name</option>
                <option value="id">By ID</option>
                <option value="culture/artist">By Culture/Artist</option>
                <option value="time">By Time</option>
                <option value="color">By Color</option>
                <option value="medium">By Medium</option>
                <option value="concept">By Concept</option>
            </select>
            <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
            />

            <select className="filter-by" onChange={handleFilterChange} value="">
                <option value="" disabled>
                    Filters
                </option>
                {Object.keys(unitFilters).map((unit) => (
                    <option key={unit} value={unit}>
                        {unit.replace('unit', 'Unit ')} {unitFilters[unit] ? '✓' : ''}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SearchComponent;