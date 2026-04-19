import MapBox from "../Map/MapBox";
import React, { useState } from "react";

function MiniMap({
  artPiece,
  mapType: initialMapType,
  setMapType: parentSetMapType,
}) {
  const [mapType, setMapType] = useState(initialMapType || "originated");

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

  const hasOrigin =
    artPiece.originatedLongitude !== null &&
    artPiece.originatedLatitude !== null;
  const hasDisplayed =
    artPiece.displayedLongitude !== null &&
    artPiece.displayedLatitude !== null;

  return (
    <div className="w-full">
      {/* Map Type Toggle */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            mapType === "originated"
              ? "bg-[var(--button-color)] text-[var(--button-text-color)]"
              : "bg-[var(--accent-color)]/30 text-[var(--text-color)] hover:bg-[var(--accent-color)]/50"
          }`}
          onClick={() => handleMapTypeChange("originated")}
        >
          Origin Location
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            mapType === "currentlyDisplayed"
              ? "bg-[var(--button-color)] text-[var(--button-text-color)]"
              : "bg-[var(--accent-color)]/30 text-[var(--text-color)] hover:bg-[var(--accent-color)]/50"
          }`}
          onClick={() => handleMapTypeChange("currentlyDisplayed")}
        >
          Currently Displayed
        </button>
      </div>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden">
        <MapBox
          center={artPieceMapLocation}
          zoom={artPieceMapLocation ? 5 : 1}
          size={{ width: "100%", height: "400px" }}
          onMapTypeChange={handleMapTypeChange}
          mapType={mapType}
        />

        {/* Location Badge */}
        <div
          className="absolute top-4 left-4 px-4 py-2 rounded-lg
                     bg-black/60 text-white text-sm font-medium backdrop-blur-sm"
        >
          {getDisplayMessage()}
        </div>

        {/* Location Info */}
        {mapType === "currentlyDisplayed" && hasDisplayed && (
          <div
            className="absolute bottom-4 left-4 right-4 p-3 rounded-lg
                       bg-black/60 text-white text-sm backdrop-blur-sm"
          >
            <span className="font-medium">Museum:</span>{" "}
            {artPiece.museum || "Unknown"}
            {artPiece.displayedLocation && (
              <>
                <br />
                <span className="font-medium">Location:</span>{" "}
                {artPiece.displayedLocation}
              </>
            )}
          </div>
        )}

        {mapType === "originated" && hasOrigin && artPiece.location && (
          <div
            className="absolute bottom-4 left-4 right-4 p-3 rounded-lg
                       bg-black/60 text-white text-sm backdrop-blur-sm"
          >
            <span className="font-medium">Created in:</span> {artPiece.location}
          </div>
        )}
      </div>
    </div>
  );
}

export default MiniMap;
