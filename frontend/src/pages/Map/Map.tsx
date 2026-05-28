import React from "react";
import MapBox from "./MapBox";
import "./Map.css";
import PageHeading from "../../components/PageHeading";

function Map() {
  return (
    <div className="map-page-container flex flex-col items-center px-3 sm:px-4 py-6 sm:py-8 max-w-6xl mx-auto">
      {/* Header */}
      <PageHeading
        title="Art Origins Map"
        subtitle="Explore where artworks originated and where they're displayed today"
        className="mb-4 sm:mb-6 w-full"
      />

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
