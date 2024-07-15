import React, {useState} from 'react'
import ControlBar from './ControlBar'
import './Museum.css'
import Catalog from './Catalog';

function Museum() {

    //Pass these as parameters to the ControlBar and ArtCard components
    const [search, setSearch] = useState('');
    const [artPiecesArray, setArtPiecesArray] = useState([]);

    return (
        <div className='museum pagecontainer'>
            <h1 className="title">Art Gallery</h1>
            <p className='blurb'>Here are the 250 pieces</p>
            <div className='contentBox'>
                <ControlBar search={search} setSearch={setSearch}/>
                <Catalog className={"catalog"} artPiecesArray={artPiecesArray} search={search} setArtPiecesArray={setArtPiecesArray}/>
            </div>
            
        </div>
    )
}

export default Museum