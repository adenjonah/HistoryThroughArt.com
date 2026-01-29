import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./w3.css";

import NavBar from "./components/NavBar";

import About from "./pages/About/About";
import Exhibit from "./pages/Exhibit/Exhibit";
import Home from "./pages/Home/Home";
import Map from "./pages/Map/Map";
import ArtGallery from "./pages/ArtGallery/ArtGallery";
import Calendar from "./pages/Calendar/Calendar";
import Tutorial from "./pages/Tutorial/Tutorial";
import Flashcards from "./pages/Flashcards/Flashcards";

function App() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <NavBar menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/exhibit" element={<Exhibit />} />
          <Route path="/map" element={<Map />} />
          <Route path="/artgallery" element={<ArtGallery />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/flashcards" element={<Flashcards />} />
        </Routes>
      </div>

      {/* Feedback Button */}
      <button
        className="feedback-button"
        onClick={() => setFeedbackOpen(true)}
        aria-label="Open feedback form"
      >
        <i className="fas fa-comment-alt"></i>
      </button>

      {/* Feedback Modal */}
      {feedbackOpen && (
        <div
          className="feedback-modal-overlay"
          onClick={() => setFeedbackOpen(false)}
        >
          <div
            className="feedback-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="feedback-modal-header">
              <h2>Send Feedback</h2>
              <button
                className="feedback-modal-close"
                onClick={() => setFeedbackOpen(false)}
                aria-label="Close feedback form"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="feedback-modal-content">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSfwbzHhmrolpntZAJXfxvyDQ8x3IwsELA0mrZXPrbhKBmgZmw/viewform?embedded=true"
                title="Feedback Form"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
