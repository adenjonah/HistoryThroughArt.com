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
import AdminDashboard from "./pages/Admin/AdminDashboard";
import DebugPage from "./pages/Admin/DebugPage";
import SupabaseDebug from "./pages/SupabaseDebug";
import ChartTester from "./components/ChartTester";

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
          <li style={modalStyles.listItem}>Added bulk image download functionality in Exhibit and PhotoGallery</li>
          <li style={modalStyles.listItem}>Fixed Flashcard details bug</li>
        </ul>
      </div>
    </div>
  );
};

function App() {
  // Use a simpler approach: check localStorage at startup only
  const hasSeenModal = localStorage.getItem("newFeaturesModalSeen2") === "true";
  
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
    localStorage.setItem("newFeaturesModalSeen2", "true");
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/debug" element={<DebugPage />} />
          <Route path="/admin/supabase-debug" element={<SupabaseDebug />} />
          <Route path="/admin/chart-test" element={<ChartTester />} />
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
