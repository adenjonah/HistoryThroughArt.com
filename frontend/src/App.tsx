import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import NavBar from "./components/NavBar";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";

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
          <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
          <Route path="/about" element={<ErrorBoundary><About /></ErrorBoundary>} />
          <Route path="/exhibit" element={<ErrorBoundary><Exhibit /></ErrorBoundary>} />
          <Route path="/map" element={<ErrorBoundary><Map /></ErrorBoundary>} />
          <Route path="/artgallery" element={<ErrorBoundary><ArtGallery /></ErrorBoundary>} />
          <Route path="/calendar" element={<ErrorBoundary><Calendar /></ErrorBoundary>} />
          <Route path="/tutorial" element={<ErrorBoundary><Tutorial /></ErrorBoundary>} />
          <Route path="/flashcards" element={<ErrorBoundary><Flashcards /></ErrorBoundary>} />
        </Routes>
      </div>

      <Button
        className="feedback-button"
        onClick={() => setFeedbackOpen(true)}
        aria-label="Open feedback form"
      >
        <i className="fas fa-comment-alt"></i>
      </Button>

      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-2xl h-[80vh] flex flex-col bg-[#210b2c] border-[#55286f] text-[#d8b4e2]">
          <DialogHeader>
            <DialogTitle className="text-[#d8b4e2]">Send Feedback</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfwbzHhmrolpntZAJXfxvyDQ8x3IwsELA0mrZXPrbhKBmgZmw/viewform?embedded=true"
              title="Feedback Form"
              className="w-full h-full border-0"
            >
              Loading…
            </iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;
