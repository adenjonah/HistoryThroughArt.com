// App.js
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

const NewFeatureModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h2>New Features!</h2>

        <ul className="list-disc list-inside pl-4 text-left">
          <li>Nicer looking search bar</li>
          <li>Sorting and Filtering stays set when you refresh the page</li>
          <li>Default to Korus Sort</li>
          <li>
            Pronunciation of art titles (not perfect on non-english words)
          </li>
          <li>
            Navigation buttons to go forward and back at the bottom of each
            exhibit (based on Korus order)
          </li>
          <li>Bug fixes on dates and photos</li>
          <li>Attempted to fix logo problem (lmk)</li>
        </ul>
      </div>
    </div>
  );
};

function App() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem("newFeatureModalDismissed2", "true");
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
