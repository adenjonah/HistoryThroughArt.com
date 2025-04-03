import MapBox from "../Map/MapBox";
import React, { useState } from "react";

function MiniMap({ artPiece, mapType: initialMapType, setMapType: parentSetMapType }) {
  const [mapType, setMapType] = useState(initialMapType || "originated");

  // Get the appropriate coordinates based on map type
  const getMapCoordinates = () => {
    if (mapType === "originated") {
      return artPiece.originatedLongitude && artPiece.originatedLatitude
        ? [artPiece.originatedLongitude, artPiece.originatedLatitude]
        : null;
    } else {
      return artPiece.displayedLongitude && artPiece.displayedLatitude
        ? [artPiece.displayedLongitude, artPiece.displayedLatitude]
        : null;
    }
  };

  const artPieceMapLocation = getMapCoordinates();

  const handleMapTypeChange = (newMapType) => {
    setMapType(newMapType);
    if (parentSetMapType) {
      parentSetMapType(newMapType);
    }
  };

  // Determine the display message
  const getDisplayMessage = () => {
    if (mapType === "currentlyDisplayed") {
      return artPiece.displayedLongitude === null
        ? "Art piece is not currently displayed"
        : "Currently Displayed";
    } else {
      return artPiece.originatedLongitude === null
        ? "Origin location unknown"
        : "Origin Location";
    }
  };

  return (
    <div className="w3-col s12 m6 l6 grid-item">
      <div className="w3-display-container">
        <MapBox
          center={artPieceMapLocation}
          zoom={artPieceMapLocation ? 5 : 1}
          size={{ width: "100%", height: "500px" }}
          onMapTypeChange={handleMapTypeChange}
          mapType={mapType}
        />
        <div 
          className="w3-display-topleft w3-padding w3-large"
          style={{ 
            marginLeft: "10px", 
            backgroundColor: "rgba(0,0,0,0.6)", 
            color: "white", 
            padding: "8px 12px",
            borderRadius: "0 0 4px 0"
          }}
        >
          {getDisplayMessage()}
        </div>
      </div>
    </div>
  );
}

export default MiniMap;
