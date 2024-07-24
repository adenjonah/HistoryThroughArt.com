import React, {useEffect} from 'react';

function ControlBar({ search, setSearch, layout, setLayout, setSort, unitFilters, setUnitFilters }) {

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

    const handleSortChange = (event) => {
        switch (event.target.innerHTML) {
            case 'Name Descending': {
                setSort('Name Descending');
                break;
            }
            case 'Name Ascending': {
                setSort('Name Ascending');
                break;
            }
            case 'Unit Descending': {
                setSort('Unit Descending');
                break;
            }
            case 'Unit Ascending': {
                setSort('Unit Ascending');
                break;
            }
            case 'ID Descending': {
                setSort('ID Descending');
                break;
            }
            case 'ID Ascending': {
                setSort('ID Ascending');
                break;
            }
            default:
                setSort('ID Ascending');
        }
    }

    const testing = (event) => {
        console.log(event.target.innerHTML);
    }

    console.log(unitFilters);
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
                    <button className='w3-block w3-dropdown-hover w3-padding-large w3-round-large'>
                        Sort
                        <div className='w3-dropdown-content w3-bar-block w3-border w3-round-large' style={{left: 0}}>
                            <div className='w3-bar-item w3-button'
                                 onClick={handleSortChange}>Name Descending
                            </div>
                            <div className='w3-bar-item w3-button'
                                 onClick={handleSortChange}>Name Ascending
                            </div>
                            <div className='w3-bar-item w3-button'
                                 onClick={handleSortChange}>Unit Descending
                            </div>
                            <div className='w3-bar-item w3-button'
                                 onClick={handleSortChange}>Unit Ascending
                            </div>
                            <div className='w3-bar-item w3-button'
                                 onClick={handleSortChange}>ID Descending
                            </div>
                            <div className='w3-bar-item w3-button'
                                 onClick={handleSortChange}>ID Ascending
                            </div>
                        </div>
                    </button>
                </div>

                {/*filters */}
                <div className='w3-col s12 m4 l4'>
                    <button className='w3-block w3-dropdown-hover w3-padding-large w3-round-large'>
                        Filter
                        <div className='w3-dropdown-content w3-bar-block w3-border w3-round-large' style={{left: 0}}>
                            <form>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit1'
                                           onChange={setUnitFilters(!unitFilters.unit1)}/>
                                    <label htmlFor='unit1'>Unit 1</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit2' />
                                    <label htmlFor='unit2'>Unit 2</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit3' />
                                    <label htmlFor='unit3'>Unit 3</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit4' />
                                    <label htmlFor='unit4'>Unit 4</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit5' />
                                    <label htmlFor='unit5'>Unit 5</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit6' />
                                    <label htmlFor='unit6'>Unit 6</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit7' />
                                    <label htmlFor='unit7'>Unit 7</label>
                                </div>
                                <div className='w3-bar-item'>
                                    <input className='w3-check' type='checkbox' id='unit8' />
                                    <label htmlFor='unit8'>Unit 8</label>
                                </div>

                            </form>
                        </div>
                    </button>
                </div>

                <div className='w3-col s12 m4 l4 '>
                    <button className=' w3-block w3-padding-large w3-round-large'>Group</button>
                </div>

            </div>
        </div>
    );
}

export default ControlBar;