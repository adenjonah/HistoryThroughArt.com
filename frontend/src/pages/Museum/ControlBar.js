import React, {useEffect} from 'react';

function ControlBar({ search, setSearch, layout, setLayout, setSort }) {

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth <= 992) {
                setLayout('table');
            }
            else {
                setLayout('column');
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setLayout]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    const toggleLayout = () => {
        setLayout(layout === 'column' ? 'table' : 'column');
    }

    const handleSortChange = (sort) => {
        if(sort === 'Name Descending') {
            setSort('Name Descending');
        }
        else if(sort === 'Name Ascending') {
            setSort('Name Ascending');
        }
        else if(sort === 'Unit Descending') {
            setSort('Unit Descending');
        }
        else if(sort === 'Unit Ascending') {
            setSort('Unit Ascending');
        }
        else if(sort === 'ID Descending') {
            setSort('ID Descending');
        }
        else if(sort === 'ID Ascending') {
            setSort('ID Ascending');
        }
    }

    return (
        <div className='controlBar'>
            <button className={`cb-Item w3-dropdown-hover `}>Sort
                <div className={`w3-dropdown-content`} style={{ left: 0}}>
                    <div className={`w3-bar-item w3-button`} onClick={() => {handleSortChange("Name Descending")}}>Name Descending</div>
                    <div className={`w3-bar-item w3-button`} onClick={() => {handleSortChange("Name Ascending")}}>Name Ascending</div>
                    <div className={`w3-bar-item w3-button`} onClick={() => {handleSortChange("Unit Descending")}}>Unit Descending</div>
                    <div className={`w3-bar-item w3-button`} onClick={() => {handleSortChange("Unit Ascending")}}>Unit Ascending</div>
                    <div className={`w3-bar-item w3-button`} onClick={() => {handleSortChange("ID Descending")}}>ID Descending</div>
                    <div className={`w3-bar-item w3-button`} onClick={() => {handleSortChange("ID Ascending")}}>ID Ascending</div>
                </div>
            </button>
            <button className='cb-Item'>Filter</button>
            <button className='cb-Item'>Group</button>
            <form>
                <input
                type='text'
                className='search-input'
                placeholder='Search...'
                value={search}
                onChange={handleSearchChange}
                />
            </form>
            <button className='layout-toggle cb-Item' onClick={toggleLayout}>
                {layout === 'column' ? 'Switch View' : 'Switch View'}
            </button>
        </div>
    );
}

export default ControlBar;