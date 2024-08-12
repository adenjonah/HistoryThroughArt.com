// SortComponent.js
import React from 'react';

function SortComponent({ sort, setSort, setClearFilters }) {
    
    const handleSortChange = (event) => {
        const value = event.target.value;
        setSort(value);
        setClearFilters(value === 'ID Ascending');
    };

    return (
        <div className="sort-select-container">
            <select
                className="control-bar-item"
                value={sort}
                onChange={handleSortChange}
            >
                <option value="ID Ascending">Sort By: ID Ascending</option>
                <option value="ID Descending">Sort By: ID Descending</option>
                <option value="Name Ascending">Sort By: Name: A-Z</option>
                <option value="Name Descending">Sort By: Name: Z-A</option>
                <option value="Unit Ascending">Sort By: Unit Ascending</option>
                <option value="Unit Descending">Sort By: Unit Descending</option>
            </select>
        </div>
    );
}

export default SortComponent;