import React, { useState } from 'react';
import MapBox from './MapBox';
import './Map.css';

function Map() {
  const [mapType, setMapType] = useState('originated'); // Default to 'originated'

  const handleMapToggle = () => {
    if (mapType === 'originated') {
      setMapType('currentlyDisplayed');
    } else {
      setMapType('originated');
    }
  };

  return (
    <div className="map pagecontainer">
      <h1 className="title">Map</h1>
      <p className="blurb">
        Where the 250 art pieces {mapType === 'currentlyDisplayed' ? 'are currently displayed' : 'originated from'}
      </p>
      <button onClick={handleMapToggle}>
        Toggle Currently Displayed/Originated
      </button>

      {/* MapBox component */}
      <div className="w3-display-container" style={{ width: '80%', maxWidth: '100%' }}>
        <MapBox mapType={mapType} />
        <div className="w3-display-topleft w3-padding w3-marginleft w3-large">
          {mapType === 'currentlyDisplayed' ? 'Currently Displayed' : 'Originated'}
        </div>
      </div>
    </div>
  );
}

export default Map;