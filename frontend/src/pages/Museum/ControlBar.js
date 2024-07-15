import React from 'react';

function ControlBar({ search, setSearch }) {
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    return (
        <div className='controlBar'>
            <div className='cb-Item'>Sort</div>
            <div className='cb-Item'>Filter</div>
            <div className='cb-Item'>Group</div>
            <input 
                type='text' 
                className='search-input' 
                placeholder='Search...' 
                value={search} 
                onChange={handleSearchChange} 
            />
        </div>
    );
}

export default ControlBar;