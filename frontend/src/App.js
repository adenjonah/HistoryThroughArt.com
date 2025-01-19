import React, { useEffect, useState } from "react";
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
        <h2>Please Submit Feedback!</h2>
        <p>
          Tomorrow, Jonah will be visiting during Korus' class to talk about
          what you like and dislike about the site, please fill out the feedback
          form (in the bottom right corner) tonight with any questions, feature
          improvements, or issues so that he can prepare what to talk about!
        </p>
      </div>
    </div>
  );
};

function App() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check local storage to see if the modal has been dismissed
    const isModalDismissed = localStorage.getItem("newFeatureModalDismissed1");
    if (!isModalDismissed) {
      setShowModal(false);
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem("newFeatureModalDismissed", "true");
  };

  return (
    <>
      <NavBar menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      <div className={`spacer ${menuOpened ? "spaceopen" : "spaceclosed"}`}>
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
