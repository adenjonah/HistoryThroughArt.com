import React from 'react';
import SortComponent from './SortComponent';
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
        <div className="w3-row w3-padding">
            <div className="w3-col s4 m4 l2">
                <select className="w3-select w3-border w3-light-gray" value={searchBy} onChange={handleSearchByChange}>
                    <option value={'all'}>By All</option>
                    <option value="name">By Name</option>
                    <option value="id">By ID</option>
                    <option value="culture/artist">By Culture/Artist</option>
                    <option value="year">By Year</option>
                    <option value="medium">By Medium</option>
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
            <div className="w3-col s6 m6 l2">
                <select className="w3-select w3-border w3-light-gray" onChange={handleFilterChange} value="">
                    <option value="" disabled>Filters</option>
                    {Object.keys(unitFilters).map((unit) => (
                        <option key={unit} value={unit}>
                            {unit.replace('unit', 'Unit ')} {unitFilters[unit] ? '✓' : ''}
                        </option>
                    ))}
                </select>
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