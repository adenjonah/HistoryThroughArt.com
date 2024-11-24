import React, { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import PhotoGallery from "./PhotoGallery";
import MiniMap from "./MiniMap";
import artPiecesData from "../../Data/artworks.json";

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

  const formatDate = (date) => {
    let dateParts = date.split("/");

    const toBCE = (datePart) => {
      return datePart.startsWith("-") ? datePart.slice(1) + " BCE" : datePart;
    };

    if (dateParts.length === 2) {
      dateParts[0] = toBCE(dateParts[0]);
      dateParts[1] = toBCE(dateParts[1]);
      dateParts = dateParts.join(" - ");
    } else {
      dateParts[0] = toBCE(dateParts[0]);
      dateParts = dateParts[0];
    }

    return dateParts;
  };

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
          <div className={"w3-container w3-center"}>
            <p className={"blurb"}>
              Here's some more information on {artPiece.name}:
            </p>
            {artPiece.artist_culture !== "None" && (
              <p className={"blurb"}>
                Artist/Culture: {artPiece.artist_culture}
              </p>
            )}
            {artPiece.location !== "None" && (
              <p className={"blurb"}>Location Made: {artPiece.location}</p>
            )}
            {artPiece.date !== "None" && (
              <p className={"blurb"}>
                Year Created: {formatDate(artPiece.date)}
              </p>
            )}
            {artPiece.materials !== "None" && (
              <p className={"blurb"}>Materials: {artPiece.materials}</p>
            )}
            <p className={"blurb"}>Unit: {artPiece.unit}</p>
          </div>
        </div>
      </div>

      <span className={`w3-circle w3-badge`}></span>
    </div>
  );
}

export default Exhibit;
