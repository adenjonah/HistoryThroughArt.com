import React, { useState } from 'react';
import MapBox from './MapBox';

function Map() {
  const [mapType, setMapType] = useState('currentlyDisplayed');

    const handleMapToggle = () => {

        if(mapType === 'currentlyDisplayed'){
            setMapType('originated');
        }
        else{
            setMapType('currentlyDisplayed');
        }
    }

  return (
    <div className='map pagecontainer'>
      <h1 className="title">Map</h1>
      <p className='blurb'>Where the 250 art pieces {mapType === 'currentlyDisplayed' ? "are currently displayed" : "originated from"}</p>
      <button onClick={handleMapToggle}>Toggle Currently Displayed/Originated</button>
      <MapBox mapType={mapType}/>
    </div>
  );
}

export default Map;