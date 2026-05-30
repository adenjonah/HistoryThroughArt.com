import MapBox from "../Map/MapBox";
import React, { useState } from "react";

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

  const hasOrigin = artPiece.originatedLongitude != null && artPiece.originatedLatitude != null;
  const hasDisplayed = artPiece.displayedLongitude != null && artPiece.displayedLatitude != null;

  const displayMessage =
    mapType === "currentlyDisplayed"
      ? !hasDisplayed
        ? "Art piece is not currently displayed"
        : "Currently Displayed"
      : !hasOrigin
      ? "Origin location unknown"
      : "Origin Location";

  return (
    <div className="w-full">
      {/* Map Type Toggle — gold fill for active, ghost border for inactive */}
      <div className="flex justify-center gap-2 mb-4">
        {[
          { value: "originated", label: "Origin Location" },
          { value: "currentlyDisplayed", label: "Currently Displayed" },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleMapTypeChange(value)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors duration-200 ${
              mapType === value
                ? "bg-[var(--gold-color)] text-[var(--ink-on-gold)]"
                : "bg-transparent text-[var(--text-default)] border border-[var(--border-gold)] opacity-70 hover:opacity-100"
            }`}
            aria-pressed={mapType === value}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Map Container — keep real MapBox, restyle overlays */}
      <div className="relative rounded-xl overflow-hidden border border-[var(--border-soft)]">
        <MapBox
          center={artPieceMapLocation}
          zoom={artPieceMapLocation ? 5 : 1}
          size={{ width: "100%", height: "400px" }}
          onMapTypeChange={handleMapTypeChange}
          mapType={mapType}
        />

        {/* Status pill — gold bg + ink-on-gold for "Origin Location", dark glass otherwise */}
        <div
          className="absolute top-4 left-4 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm"
          style={{
            background:
              mapType === "originated" && hasOrigin
                ? "var(--gold-color)"
                : "rgba(0,0,0,0.6)",
            color:
              mapType === "originated" && hasOrigin
                ? "var(--ink-on-gold)"
                : "#ffffff",
          }}
        >
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
