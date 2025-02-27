import React from "react";

function Tutorial() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background-color)] px-4 py-10 md:py-20">
      <h1 className="text-4xl md:text-5xl text-[var(--text-color)] font-bold mb-6">Tutorial</h1>
      <p className="text-lg text-[var(--text-color)] mb-6 text-center max-w-2xl">
        The following video provides a comprehensive walkthrough of this site's
        features and design, explaining common uses and ideas for utilizing this
        learning aid:
      </p>

      <div className="w-full max-w-4xl">
        <div className="relative" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded shadow-lg"
            src="https://www.youtube.com/embed/pv1N-USnLhE"
            title="Tutorial"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
