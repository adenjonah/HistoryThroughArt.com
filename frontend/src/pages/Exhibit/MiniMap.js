import MapBox from "../Map/MapBox";
import React, { useState } from "react";

function MiniMap({ artPiece }) {
  const [mapType, setMapType] = useState('originated'); // Default to 'originated'

  // Determine the center based on the current mapType
  const artPieceMapLocation = mapType === 'originated' 
    ? [artPiece.originatedLongitude, artPiece.originatedLatitude] 
    : [artPiece.displayedLongitude, artPiece.displayedLatitude];

  // Callback function to update mapType when it changes in MapBox
  const handleMapTypeChange = (newMapType) => {
    setMapType(newMapType);
  };

  return (
    <div className="w3-col s12 m6 l6 grid-item">
      <div className='w3-display-container'>
        <MapBox
          center={artPieceMapLocation}
          zoom={artPieceMapLocation[0] === null ? 0 : 5}
          size={{ width: '100%', height: '500px' }}
          onMapTypeChange={handleMapTypeChange}  // Pass the callback function to MapBox
          mapType={mapType}  // Pass the current mapType as a prop
        />
        <div className='w3-display-topleft w3-padding w3-marginleft w3-large'>
          {mapType === 'currentlyDisplayed' 
            ? (artPiece.displayedLongitude === null ? "Art piece is not currently displayed" : "Currently Displayed") 
            : (artPiece.originatedLongitude === null ? "No originated location for this art piece" : "Originated")}
        </div>
      </div>
    </div>
  );
}

export default MiniMap;