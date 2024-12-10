import React, { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import PhotoGallery from "./PhotoGallery";
import MiniMap from "./MiniMap";
import artPiecesData from "../../Data/artworks.json";
import Identifiers from "./Identifiers";

function Exhibit() {
  const [artPiece, setArtPiece] = useState(null);

  const urlParam = new URLSearchParams(window.location.search);
  const exhibitID = urlParam.get("id");

  const [mapType, setMapType] = useState(
    urlParam.get("mapType") || "currentlyDisplayed"
  );

  useEffect(() => {
    const foundArtPiece = artPiecesData.find(
      (piece) => piece.id.toString() === exhibitID
    );
    setArtPiece(foundArtPiece);
  }, [exhibitID]);

  if (!artPiece) {
    return (
      <div className="w3-container w3-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w3-container">
      <h1 className="w3-center title border border-white">
        {artPiece.id + ". " + artPiece.name}
      </h1>
      {/* Video Section */}
      <div className="w3-row-padding w3-margin-top">
        <div className="w3-col s12 border border-white">
          <VideoPlayer id={exhibitID} />
        </div>
      </div>
      {/* Identifiers and Photo Gallery */}
      <div className="w3-row-padding w3-margin-top grid-container">
        <div className="w3-col s12 m6 l6 identifiers-section border border-white">
          <Identifiers artPiece={artPiece} />
        </div>
        <div className="w3-col s12 m6 l6 photo-gallery-section border border-white">
          <PhotoGallery id={exhibitID} />
        </div>
      </div>
      {/* Centered Map Section */}
      <div className="w3-row-padding w3-margin-top flex-center border border-white">
        <MiniMap
          mapType={mapType}
          setMapType={setMapType}
          artPiece={artPiece}
        />
      </div>
    </div>
  );
}

export default Exhibit;
