import React from "react";
import MapBox from "./MapBox";
import "./Map.css";
import PageHeading from "../../components/PageHeading";

function Map() {
  return (
    <div className="map-page-container flex flex-col px-4 sm:px-8 lg:px-16 py-6 sm:py-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <PageHeading
        title="Art Origins Map"
        subtitle="Explore where artworks originated and where they're displayed today"
        className="mb-4 sm:mb-6 w-full"
      />

      {/* Map container — Nocturne gold border + deep shadow */}
      <div
        className="w-full rounded-2xl overflow-hidden border border-[var(--border-gold)]
          h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh]
          min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px]"
        style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}
      >
        <MapBox />
      </div>

      {/* Mobile hint */}
      <p className="mt-3 sm:mt-4 text-xs text-[var(--text-muted)] text-center sm:hidden">
        Pinch to zoom • Tap markers for details
      </p>
    </div>
  );
}

export default Map;
