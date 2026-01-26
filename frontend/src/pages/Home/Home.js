import React from "react";
import backgroundImage from "./homepageBackground.webp";
import styled from "@emotion/styled";

// Styled components for the animated backgrounds
const ScrollingBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: top left;
  opacity: 0.5;
  z-index: 0;
  animation: ${props => props.animation} 200s linear infinite;

  @media (max-width: 768px) {
    width: 300%;
    background-size: auto 100%;
  }

  @keyframes scroll1 {
    0% { transform: translateX(0%); }
    50% { transform: translateX(-100%); }
    50.01% { transform: translateX(100%); }
    100% { transform: translateX(0%); }
  }

  @keyframes scroll2 {
    from { transform: translateX(100%); }
    to { transform: translateX(-100%); }
  }
`;

function Home() {
  const handleFlashcards = () => {
    window.location.href = "/flashcards";
  };

  const handleGallery = () => {
    window.location.href = "/artgallery";
  };

  const handleViewMap = () => {
    window.location.href = "/map";
  };

  return (
    <div className="relative flex flex-col justify-center items-center text-center min-h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] w-full overflow-x-hidden">
      <div className="z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-white mb-4 sm:mb-6 font-bold">
          Welcome to HistoryThroughArt
        </h1>
        <p className="text-base sm:text-lg text-white mb-6 sm:mb-8 px-2 max-w-2xl mx-auto">
          Your interactive learning companion for exploring the AP Art History curriculum.
        </p>

        {/* Buttons Grid - Responsive layout */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4 sm:px-0">
          <button
            onClick={handleFlashcards}
            className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px]
                       bg-[var(--button-color)] text-[var(--button-text-color)]
                       py-3 sm:py-3 px-6 sm:px-8 rounded-lg font-medium
                       hover:bg-[var(--accent-color)] hover:text-[var(--text-color)]
                       active:scale-95 transition-all duration-300 border-none
                       touch-manipulation"
          >
            Flashcards
          </button>
          <button
            onClick={handleGallery}
            className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px]
                       bg-[var(--button-color)] text-[var(--button-text-color)]
                       py-3 sm:py-3 px-6 sm:px-8 rounded-lg font-medium
                       hover:bg-[var(--accent-color)] hover:text-[var(--text-color)]
                       active:scale-95 transition-all duration-300 border-none
                       touch-manipulation"
          >
            Gallery
          </button>
          <button
            onClick={handleViewMap}
            className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px]
                       bg-[var(--button-color)] text-[var(--button-text-color)]
                       py-3 sm:py-3 px-6 sm:px-8 rounded-lg font-medium
                       hover:bg-[var(--accent-color)] hover:text-[var(--text-color)]
                       active:scale-95 transition-all duration-300 border-none
                       touch-manipulation"
          >
            Map
          </button>
        </div>
      </div>

      {/* Background Elements */}
      <ScrollingBackground image={backgroundImage} animation="scroll1" />
      <ScrollingBackground image={backgroundImage} animation="scroll2" />
    </div>
  );
}

export default Home;
