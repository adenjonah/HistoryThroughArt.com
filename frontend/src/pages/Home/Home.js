import React from "react";

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
      <div className="absolute top-0 left-0 w-[200%] h-full bg-cover bg-top-left opacity-100 z-0 scrolling-background1"></div>
      <div className="absolute top-0 left-0 w-[200%] h-full bg-cover bg-top-left opacity-100 z-0 scrolling-background2"></div>
    </div>
  );
}

export default Home;
