import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./homepageBackground.webp";
import { Button } from "@/components/ui/button";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col justify-center items-center text-center min-h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] w-full overflow-x-hidden">
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

      {/* Deep aubergine radial overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(80% 80% at 50% 45%, rgba(25,7,34,0.55), rgba(13,4,20,0.92))",
        }}
      />

      {/* Gilded glass card */}
      <div className="relative z-10 w-full max-w-[720px] mx-auto px-4 sm:px-6">
        <div
          className="relative text-center rounded-[8px] px-6 py-12 sm:px-16 sm:py-14
                     border border-[var(--border-gold)]"
          style={{
            background: "rgba(13,5,20,0.55)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Inner soft-lavender frame — the "matted print" double-border look */}
          <div
            className="absolute inset-[10px] rounded-[4px] border border-[var(--border-soft)] pointer-events-none"
            aria-hidden="true"
          />

          <h1
            className="font-display text-[var(--text-strong)] m-0 font-normal
                       text-[2rem] sm:text-[2.75rem] md:text-[3.25rem]"
            style={{ lineHeight: 1.08, letterSpacing: "-0.02em" }}
          >
            Welcome to{" "}
            <span className="italic text-[var(--gold-soft)]">
              History Through Art
            </span>
          </h1>

          <p
            className="text-[var(--text-default)] max-w-[460px] mx-auto
                       text-base sm:text-[1.0625rem]"
            style={{ lineHeight: 1.6, marginTop: "22px" }}
          >
            Your interactive learning companion for exploring the AP Art History
            curriculum.
          </p>

          <div
            className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-[14px]"
            style={{ marginTop: "38px" }}
          >
            {/* Flashcards — solid gold */}
            <Button
              onClick={() => navigate("/flashcards")}
              className="w-full sm:w-auto min-w-[150px] py-[14px] px-7 touch-manipulation
                         bg-[var(--gold-color)] text-[var(--ink-on-gold)] border-0
                         hover:bg-[var(--gold-soft)] hover:text-[var(--ink-on-gold)]
                         font-semibold"
              size="lg"
            >
              Flashcards
            </Button>

            {/* Gallery — ghost */}
            <Button
              onClick={() => navigate("/artgallery")}
              className="w-full sm:w-auto min-w-[150px] py-[14px] px-7 touch-manipulation
                         bg-transparent text-[var(--text-strong)]
                         border border-[var(--border-gold)]
                         hover:bg-[var(--surface-1)] hover:border-[var(--gold-color)]"
              size="lg"
            >
              Gallery
            </Button>

            {/* Map — ghost */}
            <Button
              onClick={() => navigate("/map")}
              className="w-full sm:w-auto min-w-[150px] py-[14px] px-7 touch-manipulation
                         bg-transparent text-[var(--text-strong)]
                         border border-[var(--border-gold)]
                         hover:bg-[var(--surface-1)] hover:border-[var(--gold-color)]"
              size="lg"
            >
              Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
