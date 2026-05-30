import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import PhotoGallery from "./PhotoGallery";
import MiniMap from "./MiniMap";
import Identifiers from "./Identifiers";
import { korusOrder } from "../../data/korusOrder";
import { useArtwork } from "../../hooks/useSanityData";
import { Volume2 } from "lucide-react";

function Exhibit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const exhibitID = parseInt(searchParams.get("id") ?? "");

  const [mapType, setMapType] = useState(
    searchParams.get("mapType") || "currentlyDisplayed"
  );

  const { artwork: artPiece, loading, error } = useArtwork(exhibitID);

  const pronounceTitle = () => {
    if (artPiece && artPiece.name) {
      const utterance = new SpeechSynthesisUtterance(artPiece.name);
      utterance.lang = artPiece.language || "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const getNextID = () => {
    const currentIndex = korusOrder.indexOf(exhibitID);
    // Unknown IDs (e.g. a new artwork absent from korusOrder) index to -1;
    // fall back to the first entry so navigation never lands on undefined.
    return currentIndex === -1 || currentIndex === korusOrder.length - 1
      ? korusOrder[0]
      : korusOrder[currentIndex + 1];
  };

  const getPreviousID = () => {
    const currentIndex = korusOrder.indexOf(exhibitID);
    // Unknown IDs (e.g. a new artwork absent from korusOrder) index to -1;
    // fall back to the first entry so Previous stays consistent with Next
    // instead of jumping to the opposite end of the list.
    if (currentIndex === -1) {
      return korusOrder[0];
    }
    return currentIndex === 0
      ? korusOrder[korusOrder.length - 1]
      : korusOrder[currentIndex - 1];
  };

  const handleNavigation = (newID) => {
    navigate(`/exhibit?id=${newID}&mapType=${mapType}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-lg text-[var(--text-color)]">
          Loading artwork...
        </div>
      </div>
    );
  }

  if (error || !artPiece) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg text-red-500">
          {error ? "Failed to load artwork" : "Artwork not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header — centered title row: gold "ID." + serif name + audio chip */}
      <header className="mb-8">
        <div className="flex items-baseline justify-center gap-3 flex-wrap">
          <span
            className="font-display text-3xl sm:text-4xl text-[var(--gold-color)]"
            aria-hidden="true"
          >
            {artPiece.id}.
          </span>
          <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-[var(--text-strong)] text-center">
            {artPiece.name}
          </h1>
          {/* Audio / pronounce chip */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full
                       bg-[var(--surface-2)] border border-[var(--border-gold)]
                       text-[var(--gold-soft)] hover:bg-[var(--surface-3)]
                       transition-colors duration-200 flex-shrink-0"
            onClick={pronounceTitle}
            aria-label={`Pronounce ${artPiece.name}`}
            title="Pronounce artwork name"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Video — subtle purple-tint rounded container */}
      <section className="mb-8">
        <div
          className="rounded-xl p-4 sm:p-5 border border-[var(--border-soft)]"
          style={{ background: "rgba(85,40,111,0.12)" }}
        >
          <VideoPlayer id={exhibitID.toString()} />
        </div>
      </section>

      {/* Identifiers + Photo Gallery */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="order-2 lg:order-1">
            <Identifiers artPiece={artPiece} />
          </div>
          <div className="order-1 lg:order-2">
            <PhotoGallery id={exhibitID.toString()} />
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="mb-8">
        <MiniMap
          mapType={mapType}
          setMapType={setMapType}
          artPiece={artPiece}
        />
      </section>

      {/* Prev / Next navigation bar */}
      <nav className="mt-6 mb-8" aria-label="Artwork navigation">
        <div className="bg-[var(--surface-1)] rounded-xl px-5 py-4 flex items-center justify-center gap-6 sm:gap-8">
          <button
            onClick={() => handleNavigation(getPreviousID())}
            className="flex-1 max-w-[170px] min-h-[44px] px-4 sm:px-6 rounded
                       bg-[var(--gold-color)] text-[var(--ink-on-gold)]
                       font-medium text-sm sm:text-base
                       hover:bg-[var(--gold-soft)] transition-colors duration-200
                       flex items-center justify-center gap-1 touch-manipulation"
            aria-label="Previous artwork"
          >
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          {/* mono position counter */}
          <div
            className="hidden md:block text-[var(--text-muted)] text-sm whitespace-nowrap"
            style={{ fontFamily: "var(--font-mono)" }}
            aria-label={`Artwork ${korusOrder.indexOf(exhibitID) + 1} of ${korusOrder.length}`}
          >
            {korusOrder.indexOf(exhibitID) + 1} / {korusOrder.length}
          </div>

          <button
            onClick={() => handleNavigation(getNextID())}
            className="flex-1 max-w-[170px] min-h-[44px] px-4 sm:px-6 rounded
                       bg-[var(--gold-color)] text-[var(--ink-on-gold)]
                       font-medium text-sm sm:text-base
                       hover:bg-[var(--gold-soft)] transition-colors duration-200
                       flex items-center justify-center gap-1 touch-manipulation"
            aria-label="Next artwork"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* mobile position counter */}
        <div
          className="mt-3 text-center text-[var(--text-muted)] text-xs md:hidden"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Artwork {korusOrder.indexOf(exhibitID) + 1} of {korusOrder.length}
        </div>
      </nav>
    </div>
  );
}

export default Exhibit;
