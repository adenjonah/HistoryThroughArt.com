import React from "react";
import MapBox from "./MapBox";
import "./Map.css";

function Map() {
  return (
    <div className="map-page-container flex flex-col items-center px-3 sm:px-4 py-6 sm:py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-color)]">
          Art Origins Map
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[var(--text-color)] opacity-60 mt-2 sm:mt-3 max-w-xl mx-auto px-2">
          Explore where artworks originated and where they're displayed today
        </p>
      </div>

      {/* Map container */}
      <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl
        h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh]
        min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
        <MapBox />
      </div>

      {/* Mobile hint */}
      <p className="mt-3 sm:mt-4 text-xs text-[var(--text-color)] opacity-40 text-center sm:hidden">
        Pinch to zoom • Tap markers for details
      </p>
    </div>
  );
}

export default Map;
