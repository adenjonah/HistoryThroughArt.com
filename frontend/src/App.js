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
    <div className="modal-overlay" style={{ zIndex: 99999 }}>
      <div className="modal-content w3-animate-zoom" style={{ zIndex: 100000 }}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '15px' }}>New Features!</h2>

        <ul className="list-disc list-inside pl-4 text-left">
          <li>Flashcards now support swiping gestures on mobile (left=Bad, up=Good, right=Great)</li>
          <li>Added keyboard shortcuts for flashcards (1=Bad, 2=Good, 3=Great, Space=Flip)</li>
          <li>Improved flashcard animations and transitions</li>
          <li>Made flashcard layout better on mobile devices</li>
        </ul>
      </div>
    </div>
  );
};

function App() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [showModal, setShowModal] = useState(true); // Always start with the modal visible
  
  // Use a separate effect to force display for April 2024
  useEffect(() => {
    // Force display modal until a specified date (April 12, 2024)
    const forceDisplayUntil = new Date('2024-04-12T23:59:59');
    const today = new Date();
    
    // If current date is before April 12, force show the modal
    if (today <= forceDisplayUntil) {
      console.log("Showing modal until April 12th");
      // Clear any previous settings to ensure the modal shows
      localStorage.removeItem("newFeatureModalDismissed3");
      
      // Set the modal to be visible
      setShowModal(true);
      
      // Log to console for debugging
      console.log("Feature modal should be visible: forceDisplayUntil=", forceDisplayUntil, "today=", today);
    }
  }, []);

  const handleCloseModal = () => {
    console.log("Modal closed by user");
    setShowModal(false);
    
    // Store in sessionStorage that we've closed it for this session
    sessionStorage.setItem("newFeatureModalDismissed", "true");
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
