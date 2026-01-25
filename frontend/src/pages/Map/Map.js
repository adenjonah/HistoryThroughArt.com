import React from "react";
import MapBox from "./MapBox";
import "./Map.css";

function Map() {
  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-color)]">
          Art Origins Map
        </h1>
        <p className="text-sm md:text-base text-[var(--text-color)] opacity-60 mt-3 max-w-xl mx-auto">
          Explore where artworks originated and where they're displayed today
        </p>
      </div>

      <div className="w-full rounded-2xl overflow-hidden shadow-xl">
        <MapBox />
      </div>
    </div>
  );
}

export default Map;
