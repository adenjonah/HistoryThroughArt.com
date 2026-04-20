import MapBox from "../Map/MapBox";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

function MiniMap({ artPiece, mapType: initialMapType, setMapType: parentSetMapType }) {
  const [mapType, setMapType] = useState(initialMapType || "originated");

  const coordinates = {
    originated:
      artPiece.originatedLongitude != null && artPiece.originatedLatitude != null
        ? [artPiece.originatedLongitude, artPiece.originatedLatitude]
        : null,
    currentlyDisplayed:
      artPiece.displayedLongitude != null && artPiece.displayedLatitude != null
        ? [artPiece.displayedLongitude, artPiece.displayedLatitude]
        : null,
  };

  const artPieceMapLocation = coordinates[mapType];

  const handleMapTypeChange = (newMapType) => {
    setMapType(newMapType);
    parentSetMapType?.(newMapType);
  };

  const displayMessage =
    mapType === "currentlyDisplayed"
      ? artPiece.displayedLongitude == null
        ? "Art piece is not currently displayed"
        : "Currently Displayed"
      : artPiece.originatedLongitude == null
      ? "Origin location unknown"
      : "Origin Location";

  const hasOrigin = artPiece.originatedLongitude != null && artPiece.originatedLatitude != null;
  const hasDisplayed = artPiece.displayedLongitude != null && artPiece.displayedLatitude != null;

  return (
    <div className="w-full">
      {/* Map Type Toggle */}
      <div className="flex justify-center gap-2 mb-4">
        {[
          { value: "originated", label: "Origin Location" },
          { value: "currentlyDisplayed", label: "Currently Displayed" },
        ].map(({ value, label }) => (
          <Button
            key={value}
            variant={mapType === value ? "default" : "outline"}
            onClick={() => handleMapTypeChange(value)}
            className={mapType !== value ? "opacity-70" : ""}
          >
            {label}
          </Button>
        ))}
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

        <div className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-black/60 text-white text-sm font-medium backdrop-blur-sm">
          {displayMessage}
        </div>

        {mapType === "currentlyDisplayed" && hasDisplayed && (
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black/60 text-white text-sm backdrop-blur-sm">
            <span className="font-medium">Museum:</span> {artPiece.museum || "Unknown"}
            {artPiece.displayedLocation && (
              <>
                <br />
                <span className="font-medium">Location:</span> {artPiece.displayedLocation}
              </>
            )}
          </div>
        )}

        {mapType === "originated" && hasOrigin && artPiece.location && (
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black/60 text-white text-sm backdrop-blur-sm">
            <span className="font-medium">Created in:</span> {artPiece.location}
          </div>
        )}
      </div>
    </div>
  );
}

export default MiniMap;
