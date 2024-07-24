import React, { useState } from 'react';
import ControlBar from './ControlBar';
import './Museum.css';
import Catalog from './Catalog';

function Museum() {
    const [search, setSearch] = useState('');
    const [artPiecesArray, setArtPiecesArray] = useState([]);
    const [layout, setLayout] = useState('column'); // New state for layout
    const [sort, setSort] = useState('ID Ascending');
    const [unitFilters, setUnitFilters] = useState({
        unit1: false, unit2: false, unit3: false, unit4: false,
        unit5: false, unit6: false, unit7: false, unit8: false})

    return (
        <div className='museum pagecontainer'>
            <h1 className="title">Art Gallery</h1>
            <div className='contentBox'>
                <ControlBar search={search} setSearch={setSearch} layout={layout} setLayout={setLayout} setSort={setSort} unitFilters={unitFilters} setUnitFilters={setUnitFilters}/>
                <Catalog className={"catalog"} artPiecesArray={artPiecesArray} search={search} setArtPiecesArray={setArtPiecesArray} layout={layout} sort={sort} />
            </div>
        </div>
    );
}

export default Museum;