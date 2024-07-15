import React from 'react';

function ControlBar({ search, setSearch, layout, setLayout }) {
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    const toggleLayout = () => {
        setLayout(layout === 'column' ? 'table' : 'column');
    }

    return (
        <div className='controlBar'>
            <button className='cb-Item'>Sort</button>
            <button className='cb-Item'>Filter</button>
            <button className='cb-Item'>Group</button>
            <input 
                type='text' 
                className='search-input' 
                placeholder='Search...' 
                value={search} 
                onChange={handleSearchChange} 
            />
            <button className='layout-toggle' onClick={toggleLayout}>
                {layout === 'column' ? 'Switch to Table View' : 'Switch to Column View'}
            </button>
        </div>
    );
}

export default ControlBar;