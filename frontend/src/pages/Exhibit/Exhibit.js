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
      <h1 className="w3-center title">{artPiece.id + ". " + artPiece.name}</h1>
      <div className="w3-row-padding w3-margin-top">
        <div className="w3-col s12">
          <VideoPlayer id={exhibitID} />
        </div>
      </div>
      <div className="w3-row-padding w3-margin-top">
        <MiniMap
          mapType={mapType}
          setMapType={setMapType}
          artPiece={artPiece}
        />
        <div className="w3-col s12 m6 l6 grid-item">
          <PhotoGallery id={exhibitID} />
        </div>
      </div>
      <div className="w3-row-padding w3-margin-top">
        <div className="w3-col s12">
          <Identifiers artPiece={artPiece} />
        </div>
      </div>

      <span className={`w3-circle w3-badge`}></span>
    </div>
  );
}

export default Exhibit;
