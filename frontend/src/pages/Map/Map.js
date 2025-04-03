import React from "react";
import MapBox from "./MapBox";
import "./Map.css";

function Map() {
  return (
    <div className="map pagecontainer">
      <h1 className="title">Map</h1>
      <p className="blurb">Explore the locations of the 250 art pieces.</p>

      <div
        className="map-container"
        style={{ width: "100%", maxWidth: "1400px", height: "70vh", margin: "0 auto" }}
      >
        <MapBox />
      </div>
    </div>
  );
}

export default Map;
