import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./homepageBackground.webp";

const BTN_CLASS =
  "w-full sm:w-auto min-w-[140px] sm:min-w-[160px] " +
  "bg-[var(--button-color)] text-[var(--button-text-color)] " +
  "py-3 px-6 sm:px-8 rounded-lg font-medium " +
  "hover:bg-[var(--accent-color)] hover:text-[var(--text-color)] " +
  "active:scale-95 transition-all duration-300 border-none touch-manipulation";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col justify-center items-center text-center min-h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] w-full overflow-x-hidden">
      <div className="z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-white mb-4 sm:mb-6 font-bold">
          Welcome to HistoryThroughArt
        </h1>
        <p className="text-base sm:text-lg text-white mb-6 sm:mb-8 px-2 max-w-2xl mx-auto">
          Your interactive learning companion for exploring the AP Art History curriculum.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4 sm:px-0">
          <button onClick={() => navigate("/flashcards")} className={BTN_CLASS}>
            Flashcards
          </button>
          <button onClick={() => navigate("/artgallery")} className={BTN_CLASS}>
            Gallery
          </button>
          <button onClick={() => navigate("/map")} className={BTN_CLASS}>
            Map
          </button>
        </div>
      </div>

      {/* Animated scrolling backgrounds */}
      <div
        className="absolute top-0 left-0 w-[200%] h-full opacity-50 z-0 animate-scroll1
                   [background-size:cover] [background-position:top_left]"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div
        className="absolute top-0 left-0 w-[200%] h-full opacity-50 z-0 animate-scroll2
                   [background-size:cover] [background-position:top_left]"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
    </div>
  );
}

export default Home;
