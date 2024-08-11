import React, { useState } from 'react';

function ControlBar({ search, setSearch, layout, setLayout, setSort, sort, unitFilters, setUnitFilters }) {
    const [clearFilters, setClearFilters] = useState(true);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setClearFilters(event.target.value.length === 0 && Object.values(unitFilters).every(v => !v) && sort === 'ID Ascending');
    };

    const handleSortChange = (event) => {
        setClearFilters(false);
        switch (event.target.innerHTML) {
            case 'Name: Z-A':
                setSort('Name Descending');
                break;
            case 'Name: A-Z':
                setSort('Name Ascending');
                break;
            case 'Unit Descending':
                setSort('Unit Descending');
                break;
            case 'Unit Ascending':
                setSort('Unit Ascending');
                break;
            case 'ID Descending':
                setSort('ID Descending');
                break;
            case 'ID Ascending':
                setSort('ID Ascending');
                setClearFilters(true);
                break;
            default:
                setClearFilters(true);
                setSort('ID Ascending');
        }
    };

    const handleFilterChange = (event) => {
        const { id, checked } = event.target;
        setUnitFilters(items => ({
            ...items, [id]: checked
        }));

        // Enables clear filters button
        setClearFilters(false);
    };

    const handleClearFilters = () => {
        setUnitFilters({
            unit1: false, unit2: false, unit3: false, unit4: false,
            unit5: false, unit6: false, unit7: false, unit8: false
        });
        setSort('ID Ascending');
        setSearch('');
        setClearFilters(true);
    };

    const toggleLayout = () => {
        setLayout(layout === 'column' ? 'table' : 'column');
    };

    return (
        <div className='w3-container w3-card ControlBar w3-round-xlarge w3-padding-16'>
            <div className='w3-row'>
                <div className='w3-col s12 m12 l12 w3-margin-bottom'>
                    <input
                        type='text'
                        className='w3-input w3-border w3-round-large'
                        placeholder='Search...'
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className='w3-col s12 m4 l4'>
                    <div className='w3-dropdown-hover w3-padding-large w3-round-large'>
                        <select className='w3-select' value={sort} onChange={handleSortChange}>
                            <option value="ID Ascending">ID Ascending</option>
                            <option value="ID Descending">ID Descending</option>
                            <option value="Name Ascending">Name: A-Z</option>
                            <option value="Name Descending">Name: Z-A</option>
                            <option value="Unit Ascending">Unit Ascending</option>
                            <option value="Unit Descending">Unit Descending</option>
                        </select>
                    </div>
                </div>

                {/* filters */}
                <div className='w3-col s12 m4 l4'>
                    <button className='w3-block w3-dropdown-hover w3-padding-large w3-round-large'>
                        Filter
                        <div className='w3-dropdown-content w3-bar-block w3-border w3-round-large' style={{ left: 0 }}>
                            <form>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit1'
                                        checked={unitFilters.unit1}
                                        onChange={handleFilterChange} />
                                    <label htmlFor='unit1'>Unit 1</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit2'
                                        checked={unitFilters.unit2}
                                        onChange={handleFilterChange} />
                                    <label htmlFor='unit2'>Unit 2</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit3'
                                        checked={unitFilters.unit3}
                                        onChange={handleFilterChange} />
                                    <label htmlFor='unit3'>Unit 3</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit4'
                                        checked={unitFilters.unit4}
                                        onChange={handleFilterChange} />
                                    <label htmlFor='unit4'>Unit 4</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit5'
                                        checked={unitFilters.unit5}
                                        onChange={handleFilterChange} />
                                    <label htmlFor='unit5'>Unit 5</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit6'
                                        checked={unitFilters.unit6}
                                        onChange={handleFilterChange} />
                                    <label htmlFor='unit6'>Unit 6</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit7'
                                        checked={unitFilters.unit7}
                                        onChange={handleFilterChange} />
                                    <label htmlFor='unit7'>Unit 7</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit8'
                                        checked={unitFilters.unit8}
                                        onChange={handleFilterChange} />
                                    <label htmlFor='unit8'>Unit 8</label>
                                </div>
                            </form>
                        </div>
                    </button>
                </div>

                <div className='w3-col s12 m4 l4'>
                    <button className='w3-button w3-padding-large w3-round-large'
                        disabled={clearFilters}
                        onClick={handleClearFilters}
                    >Clear Filters</button>
                </div>

                <div className='w3-col s12 m4 l4'>
                    <button className='w3-button w3-padding-large w3-round-large' onClick={toggleLayout}>
                        {layout === 'column' ? 'Switch to Grid' : 'Switch to Column'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ControlBar;