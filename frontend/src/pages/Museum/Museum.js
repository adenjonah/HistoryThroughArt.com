import React from 'react'
import ControlBar from './ControlBar'
import ArtCard from './ArtCard'
import './Museum.css'

function Museum() {
    return (
        <div className='museum pagecontainer'>
            <h1 className="title">Art Gallery</h1>
            <p className='blurb'>Here are the 250 pieces</p>
            <div className='contentBox'>
                <ControlBar />
                <ArtCard />
                {/*<ArtCard />*/}
                {/*<ArtCard />*/}
            </div>
            
        </div>
    )
}

export default Museum