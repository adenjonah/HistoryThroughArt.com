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

    // const toggleLayout = () => {
    //     setLayout(layout === 'column' ? 'table' : 'column');
    // }

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
        <div className='w3-container w3-card ControlBar w3-round-xlarge w3-padding-16'>
            <div className='w3-row'>
                <div className='w3-col s12 m12 l12 w3-margin-bottom'>
                    <form className='w3-form'>
                        <input
                            type='text'
                            className='w3-input w3-border w3-round-large'
                            placeholder='Search...'
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </form>
                </div>

                <div className='w3-col s12 m4 l4'>
                    <button className='w3-block w3-dropdown-hover w3-padding-large w3-round-large'>
                        Sort
                        <div className='w3-dropdown-content w3-bar-block w3-border w3-round-large' style={{left: 0}}>
                            <div className='w3-bar-item w3-button'
                                 onClick={() => handleSortChange("Name Descending")}>Name Descending
                            </div>
                            <div className='w3-bar-item w3-button'
                                 onClick={() => handleSortChange("Name Ascending")}>Name Ascending
                            </div>
                            <div className='w3-bar-item w3-button'
                                 onClick={() => handleSortChange("Unit Descending")}>Unit Descending
                            </div>
                            <div className='w3-bar-item w3-button'
                                 onClick={() => handleSortChange("Unit Ascending")}>Unit Ascending
                            </div>
                            <div className='w3-bar-item w3-button' onClick={() => handleSortChange("ID Descending")}>ID
                                Descending
                            </div>
                            <div className='w3-bar-item w3-button' onClick={() => handleSortChange("ID Ascending")}>ID
                                Ascending
                            </div>
                        </div>
                    </button>
                </div>


                <div className='w3-col s12 m4 l4 '>
                    <button className=' w3-block w3-padding-large w3-round-large'>Filter</button>
                </div>
                <div className='w3-col s12 m4 l4 '>
                    <button className=' w3-block w3-padding-large w3-round-large'>Group</button>
                </div>

                </div>
            </div>
            );
            }

            export default ControlBar;