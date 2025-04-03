import React, { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import PhotoGallery from "./PhotoGallery";
import MiniMap from "./MiniMap";
import artPiecesData from "../../data/artworks.json";
import Identifiers from "./Identifiers";

function Exhibit() {
  const [artPiece, setArtPiece] = useState(null);

  const urlParam = new URLSearchParams(window.location.search);
  const exhibitID = parseInt(urlParam.get("id"));

  const [mapType, setMapType] = useState(
    urlParam.get("mapType") || "currentlyDisplayed"
  );

  useEffect(() => {
    const foundArtPiece = artPiecesData.find((piece) => piece.id === exhibitID);
    setArtPiece(foundArtPiece);
  }, [exhibitID]);

  const pronounceTitle = () => {
    if (artPiece && artPiece.name) {
      const utterance = new SpeechSynthesisUtterance(artPiece.name);
      utterance.lang = artPiece.language || "en-US"; // Default to English
      window.speechSynthesis.speak(utterance);
    }
  };

  const korusArray = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 19, 25, 30, 13, 15, 17, 18,
    20, 21, 22, 23, 24, 26, 27, 28, 33, 34, 35, 36, 37, 38, 41, 29, 31, 32, 39,
    40, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 58, 59, 60, 61,
    62, 64, 63, 67, 69, 70, 71, 72, 73, 76, 75, 80, 78, 66, 68, 74, 77, 79, 83,
    82, 85, 86, 87, 88, 89, 91, 92, 93, 96, 98, 153, 159, 160, 161, 162, 155,
    157, 158, 154, 156, 163, 164, 165, 166, 81, 90, 94, 95, 97, 99, 167, 168,
    169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 213, 217, 221,
    218, 214, 215, 216, 219, 220, 222, 223, 181, 183, 185, 186, 187, 56, 57, 65,
    188, 189, 190, 191, 208, 209, 84, 202, 200, 192, 199, 182, 198, 184, 195,
    197, 207, 193, 194, 201, 204, 206, 212, 205, 196, 203, 210, 211, 100, 101,
    102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 110, 114, 117, 127, 113,
    116, 118, 115, 119, 120, 121, 122, 123, 124, 125, 126, 128, 129, 130, 131,
    132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146,
    147, 148, 149, 150, 151, 152, 224, 225, 226, 227, 228, 229, 230, 231, 232,
    233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247,
    248, 249, 250,
  ];

  // Function to get the next exhibit ID
  const getNextID = () => {
    const currentIndex = korusArray.indexOf(exhibitID);
    return currentIndex === korusArray.length - 1
      ? korusArray[0]
      : korusArray[currentIndex + 1];
  };

  // Function to get the previous exhibit ID
  const getPreviousID = () => {
    const currentIndex = korusArray.indexOf(exhibitID);
    return currentIndex === 0
      ? korusArray[korusArray.length - 1]
      : korusArray[currentIndex - 1];
  };

  // Function to handle navigation
  const handleNavigation = (newID) => {
    window.location.search = `?id=${newID}&mapType=${mapType}`;
  };
  if (!artPiece) {
    return (
      <div className="w3-container w3-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-4 md:py-6">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold title">
            {artPiece.id + ". " + artPiece.name}
          </h1>
          <button
            className="pronounce-button ml-2 h-8 w-8 flex items-center justify-center rounded-full focus:outline-none"
            onClick={pronounceTitle}
            aria-label={`Pronounce ${artPiece.name}`}
          >
            🔊
          </button>
        </div>
      </div>

      {/* Video Section */}
      <div className="my-4 md:my-8 lg:my-10">
        <div className="w-full">
          <VideoPlayer id={exhibitID.toString()} />
        </div>
      </div>

      {/* Identifiers and Photo Gallery */}
      <div className="my-6 md:my-10 lg:grid lg:grid-cols-2 lg:gap-8">
        <div className="mb-6 lg:mb-0">
          <Identifiers artPiece={artPiece} />
        </div>
        <div className="mt-6 lg:mt-0">
          <PhotoGallery id={exhibitID.toString()} />
        </div>
      </div>

      {/* Centered Map Section */}
      <div className="my-6 md:my-10">
        <MiniMap
          mapType={mapType}
          setMapType={setMapType}
          artPiece={artPiece}
        />
      </div>

      {/* Navigation Buttons - Fixed at bottom with margin */}
      <div className="mt-8 md:mt-12 lg:mt-16 mb-6">
        <div
          className="shadow-md py-4 sm:py-6 lg:py-8 w-full rounded-lg"
          style={{ backgroundColor: "var(--background-color)" }}
        >
          <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 px-2">
            <button
              className="px-4 py-2 sm:px-5 md:px-8 md:py-3 text-sm md:text-base lg:text-lg font-medium rounded-md focus:outline-none shadow-sm hover:shadow transition-all duration-200 w-[45%] md:w-[35%] lg:w-[25%]"
              style={{
                backgroundColor: "var(--button-color)",
                color: "var(--button-text-color)",
              }}
              onClick={() => handleNavigation(getPreviousID())}
            >
              <span className="flex items-center justify-center">
                <span className="mr-1 md:mr-2 text-lg md:text-xl">←</span> 
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">Previous</span>
              </span>
            </button>
            <button
              className="px-4 py-2 sm:px-5 md:px-8 md:py-3 text-sm md:text-base lg:text-lg font-medium rounded-md focus:outline-none shadow-sm hover:shadow transition-all duration-200 w-[45%] md:w-[35%] lg:w-[25%]"
              style={{
                backgroundColor: "var(--button-color)",
                color: "var(--button-text-color)",
              }}
              onClick={() => handleNavigation(getNextID())}
            >
              <span className="flex items-center justify-center">
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">Next</span>
                <span className="ml-1 md:ml-2 text-lg md:text-xl">→</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Add bottom spacing for mobile */}
      <div className="h-6 md:h-12"></div>
    </div>
  );
}

export default Exhibit;
