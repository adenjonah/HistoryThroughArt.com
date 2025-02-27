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
  const handleFeelingLucky = () => {
    const randomId = Math.floor(Math.random() * 250) + 1;
    window.location.href = `/exhibit?id=${randomId}`;
  };

  const handleStartLearning = () => {
    window.location.href = "/tutorial";
  };

  const handleViewMap = () => {
    window.location.href = "/map";
  };

  return (
    <div className="relative flex flex-col justify-center items-center text-center min-h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] w-full overflow-x-hidden">
      <div className="z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl text-white mb-6">
          Welcome to HistoryThroughArt
        </h1>
        <p className="text-lg text-white mb-8">
          Your interactive learning companion for exploring the AP Art History curriculum.
        </p>

        {/* Buttons Grid - Always single column until lg breakpoint */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4">
          <button
            onClick={handleStartLearning}
            className="w-[160px] bg-[var(--button-color)] text-[var(--button-text-color)] py-3 px-6 rounded-lg font-medium hover:bg-[var(--accent-color)] hover:text-[var(--text-color)] transition-colors duration-300 border-none"
          >
            Tutorial
          </button>
          <button
            onClick={handleFeelingLucky}
            className="w-[160px] bg-[var(--button-color)] text-[var(--button-text-color)] py-3 px-6 rounded-lg font-medium hover:bg-[var(--accent-color)] hover:text-[var(--text-color)] transition-colors duration-300 border-none"
          >
            Random Art
          </button>
          <button
            onClick={handleViewMap}
            className="w-[160px] bg-[var(--button-color)] text-[var(--button-text-color)] py-3 px-6 rounded-lg font-medium hover:bg-[var(--accent-color)] hover:text-[var(--text-color)] transition-colors duration-300 border-none"
          >
            View Map
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
