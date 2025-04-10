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
  // Define styles to ensure visibility
  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 9999999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: {
      backgroundColor: '#bc96e6',
      color: '#210b2c',
      borderRadius: '8px',
      padding: '25px',
      width: '90%',
      maxWidth: '500px', 
      position: 'relative',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '15px',
      background: 'transparent',
      border: 'none',
      fontSize: '30px',
      cursor: 'pointer',
      color: '#210b2c'
    },
    header: {
      fontSize: '26px',
      fontWeight: 'bold',
      marginBottom: '20px'
    },
    list: {
      textAlign: 'left',
      paddingLeft: '20px'
    },
    listItem: {
      margin: '10px 0',
      fontSize: '16px'
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <button 
          style={modalStyles.closeButton}
          onClick={onClose}
        >
          &times;
        </button>
        
        <h2 style={modalStyles.header}>New Features!</h2>
        
        <ul style={modalStyles.list}>
          <li style={modalStyles.listItem}>Flashcards now support swiping gestures on mobile (left=Bad, up=Good, right=Great)</li>
          <li style={modalStyles.listItem}>Added keyboard shortcuts for flashcards (1=Bad, 2=Good, 3=Great, Space=Flip)</li>
          <li style={modalStyles.listItem}>When rating as "Bad", a duplicate card is added for review</li>
          <li style={modalStyles.listItem}>Improved flashcard animations and transitions</li>
          <li style={modalStyles.listItem}>Made flashcard layout better on mobile devices</li>
        </ul>
      </div>
    </div>
  );
};

function App() {
  // Use a simpler approach: check localStorage at startup only
  const hasSeenModal = localStorage.getItem("newFeaturesModalSeen1") === "true";
  
  // Debug what's happening with localStorage
  console.log("Initial state check:", { hasSeenModal });
  
  // Initialize state - show by default unless already seen
  const [menuOpened, setMenuOpened] = useState(false);
  const [showModal, setShowModal] = useState(!hasSeenModal);
  
  // IMPORTANT: Remove any useEffect that might be toggling the modal visibility
  // No useEffect that modifies showModal state should run on mount
  
  // Handle modal close - only way to dismiss
  const handleCloseModal = () => {
    console.log("Modal closed by user - setting localStorage");
    setShowModal(false);
    localStorage.setItem("newFeaturesModalSeen1", "true");
  };

  // Update our render
  return (
    <>
      <NavBar menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      <div>
        {/* Modal rendering - simple condition */}
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
