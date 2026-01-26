import React, { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import PhotoGallery from "./PhotoGallery";
import MiniMap from "./MiniMap";
import artPiecesData from "../../data/artworks.json";
import Identifiers from "./Identifiers";
import { korusOrder } from "../../data/korusOrder";

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
      utterance.lang = artPiece.language || "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const getNextID = () => {
    const currentIndex = korusOrder.indexOf(exhibitID);
    return currentIndex === korusOrder.length - 1
      ? korusOrder[0]
      : korusOrder[currentIndex + 1];
  };

  const getPreviousID = () => {
    const currentIndex = korusOrder.indexOf(exhibitID);
    return currentIndex === 0
      ? korusOrder[korusOrder.length - 1]
      : korusOrder[currentIndex - 1];
  };

  const handleNavigation = (newID) => {
    window.location.search = `?id=${newID}&mapType=${mapType}`;
  };

  if (!artPiece) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-pulse text-lg text-[var(--text-color)]">
            Loading artwork...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-color)] text-center">
            <span className="text-[var(--foreground-color)] font-medium">
              {artPiece.id}.
            </span>{" "}
            {artPiece.name}
          </h1>
          <button
            className="h-10 w-10 flex items-center justify-center rounded-full
                       bg-[var(--accent-color)] hover:bg-[var(--button-color)]
                       transition-colors duration-200 text-xl"
            onClick={pronounceTitle}
            aria-label={`Pronounce ${artPiece.name}`}
            title="Pronounce artwork name"
          >
            🔊
          </button>
        </div>
      </header>

      {/* Video Section */}
      <section className="mb-10">
        <div className="bg-[var(--accent-color)]/30 rounded-xl p-4 sm:p-6">
          <VideoPlayer id={exhibitID.toString()} />
        </div>
      </section>

      {/* Main Content Grid - Identifiers and Photo Gallery */}
      <section className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="order-2 lg:order-1">
            <Identifiers artPiece={artPiece} />
          </div>
          <div className="order-1 lg:order-2">
            <PhotoGallery id={exhibitID.toString()} />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="mb-10">
        <div className="bg-[var(--accent-color)]/20 rounded-xl p-4 sm:p-6">
          <MiniMap
            mapType={mapType}
            setMapType={setMapType}
            artPiece={artPiece}
          />
        </div>
      </section>

      {/* Navigation Section */}
      <nav className="mt-8 sm:mt-12 mb-8">
        <div className="bg-[var(--background-color)] rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex justify-center items-center gap-3 sm:gap-6 md:gap-8">
            <button
              className="flex-1 max-w-[160px] sm:max-w-[200px] min-h-[48px] px-3 py-3 sm:px-6 sm:py-4
                         bg-[var(--button-color)] text-[var(--button-text-color)]
                         font-semibold rounded-lg
                         hover:brightness-110 active:scale-95
                         transition-all duration-200
                         flex items-center justify-center gap-1 sm:gap-2
                         touch-manipulation"
              onClick={() => handleNavigation(getPreviousID())}
            >
              <span className="text-lg sm:text-xl">←</span>
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden text-sm">Prev</span>
            </button>

            <div className="text-sm sm:text-base text-[var(--text-color)] opacity-70 hidden md:block">
              {korusOrder.indexOf(exhibitID) + 1} / {korusOrder.length}
            </div>

            <button
              className="flex-1 max-w-[160px] sm:max-w-[200px] min-h-[48px] px-3 py-3 sm:px-6 sm:py-4
                         bg-[var(--button-color)] text-[var(--button-text-color)]
                         font-semibold rounded-lg
                         hover:brightness-110 active:scale-95
                         transition-all duration-200
                         flex items-center justify-center gap-1 sm:gap-2
                         touch-manipulation"
              onClick={() => handleNavigation(getNextID())}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden text-sm">Next</span>
              <span className="text-lg sm:text-xl">→</span>
            </button>
          </div>

          {/* Mobile position indicator */}
          <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-[var(--text-color)] opacity-70 md:hidden">
            Artwork {korusOrder.indexOf(exhibitID) + 1} of {korusOrder.length}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Exhibit;
