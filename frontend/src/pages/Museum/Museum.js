import React, { useState } from 'react';
import ControlBar from './ControlBar';
import './Museum.css';
import Catalog from './Catalog';

function Museum() {
    const [search, setSearch] = useState('');
    const [artPiecesArray, setArtPiecesArray] = useState([]);
    const [layout, setLayout] = useState('column'); // New state for layout

    return (
        <div className='museum pagecontainer'>
            <h1 className="title">Art Gallery</h1>
            <div className='contentBox'>
                <ControlBar search={search} setSearch={setSearch} layout={layout} setLayout={setLayout} />
                <Catalog className={"catalog"} artPiecesArray={artPiecesArray} search={search} setArtPiecesArray={setArtPiecesArray} layout={layout} />
            </div>
        </div>
    );
}

export default Museum;