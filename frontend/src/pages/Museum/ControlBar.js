import React, {useEffect} from 'react';

function ControlBar({ search, setSearch, layout, setLayout }) {

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

    return (
        <div className='controlBar'>
            <button className='cb-Item'>Sort</button>
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
            <button className='layout-toggle' onClick={toggleLayout}>
                {layout === 'column' ? 'Switch View' : 'Switch View'}
            </button>
        </div>
    );
}

export default ControlBar;