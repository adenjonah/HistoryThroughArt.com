// App.js
import React, { useState, useEffect } from "react";
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

const NewFeatureModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h2>New Features!</h2>

        <ul className="list-disc list-inside pl-4 text-left">
          <li>Flashcards now save your progress automatically!</li>
          <li>Flashcards now default to showing only pieces you've learned</li>
          <li>Added "View Details" button to flashcards for more information</li>
          <li>Improved Calendar layout and visual design</li>
          <li>Enhanced Art Gallery display for mobile devices</li>
          <li>Fixed various identifier-related errors throughout the site</li>
        </ul>
      </div>
    </div>
  );
};

function App() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if the modal has been dismissed before
    const modalDismissed = localStorage.getItem("newFeatureModalDismissed3");
    if (!modalDismissed) {
      setShowModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem("newFeatureModalDismissed3", "true");
  };

  return (
    <>
      <NavBar menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      <div>
        {showModal && <NewFeatureModal onClose={handleCloseModal} />}
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
      <button
        className="feedback-button"
        onClick={() =>
          window.open("https://forms.gle/3Bngm7bphSjygE2Q7", "_blank")
        }
      >
        <i className="fas fa-comment-alt"></i>
      </button>
    </>
  );
}

export default App;
