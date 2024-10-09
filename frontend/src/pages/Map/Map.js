import React from 'react';
import MapBox from './MapBox';
import './Map.css';

function Map() {
  return (
    <div className="map pagecontainer">
      <h1 className="title">Map</h1>
      <p className="blurb">
        Explore the locations of the 250 art pieces.
      </p>

      {/* MapBox component */}
      <div className="w3-display-container" style={{ width: '80%', maxWidth: '100%', Height: '60vh' }}>
        <MapBox />
      </div>
    </div>
  );
}

export default Map;