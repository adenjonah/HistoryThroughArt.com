import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./homepageBackground.webp";
import { Button } from "@/components/ui/button";

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
          <Button
            onClick={() => navigate("/flashcards")}
            className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px] py-3 px-6 sm:px-8 touch-manipulation"
            size="lg"
          >
            Flashcards
          </Button>
          <Button
            onClick={() => navigate("/artgallery")}
            className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px] py-3 px-6 sm:px-8 touch-manipulation"
            size="lg"
          >
            Gallery
          </Button>
          <Button
            onClick={() => navigate("/map")}
            className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px] py-3 px-6 sm:px-8 touch-manipulation"
            size="lg"
          >
            Map
          </Button>
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
