import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Flashcards.css";
import artPiecesData from "../../data/artworks.json";

const Flashcards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState([]);
  const [excludedCardIds, setExcludedCardIds] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize shuffleDeck function to avoid recreation on every render
  const shuffleDeck = useCallback((isInitial = false) => {
    const filteredDeck = artPiecesData.filter(
      (card) =>
        (selectedUnits.length === 0 || selectedUnits.includes(card.unit)) &&
        !excludedCardIds.includes(card.id)
    );
    const shuffledDeck = [...filteredDeck].sort(() => Math.random() - 0.5);
    setDeck(shuffledDeck);
    setCurrentCard(0);
    setIsFlipped(false);

    // Clear saved deck if this is a manual reset (not initial load)
    if (!isInitial) {
      localStorage.removeItem("flashcards_deck");
      localStorage.removeItem("flashcards_currentCard");
    }
  }, [selectedUnits, excludedCardIds]);

  // Load saved progress from localStorage - runs only once
  useEffect(() => {
    const savedExcludedIds = localStorage.getItem("flashcards_excludedIds");
    const savedSelectedUnits = localStorage.getItem("flashcards_selectedUnits");
    const savedDeck = localStorage.getItem("flashcards_deck");
    const savedCurrentCard = localStorage.getItem("flashcards_currentCard");

    if (savedExcludedIds) {
      setExcludedCardIds(JSON.parse(savedExcludedIds));
    }
    
    if (savedSelectedUnits) {
      setSelectedUnits(JSON.parse(savedSelectedUnits));
    }

    if (savedDeck && savedCurrentCard) {
      setDeck(JSON.parse(savedDeck));
      setCurrentCard(parseInt(savedCurrentCard, 10));
    } else {
      // If no saved deck, initialize with the full deck
      shuffleDeck(true);
    }
    
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally leaving shuffleDeck out of deps to avoid re-running on mount

  // Create a memoized function to handle the saving logic
  const saveProgress = useCallback(() => {
    if (isInitialized && deck.length > 0) {
      setIsSaving(true);
      localStorage.setItem("flashcards_deck", JSON.stringify(deck));
      localStorage.setItem("flashcards_currentCard", currentCard.toString());
      localStorage.setItem("flashcards_excludedIds", JSON.stringify(excludedCardIds));
      localStorage.setItem("flashcards_selectedUnits", JSON.stringify(selectedUnits));
      
      // Hide the saving indicator after a delay
      const timer = setTimeout(() => {
        setIsSaving(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [deck, currentCard, excludedCardIds, selectedUnits, isInitialized]);

  // Save progress whenever relevant state changes
  useEffect(() => {
    // Only save after initial loading is complete and when deck changes
    if (isInitialized && deck.length > 0) {
      saveProgress();
    }
  }, [deck, currentCard, excludedCardIds, selectedUnits, saveProgress, isInitialized]);

  const handleFlip = () => {
    if (!isTransitioning) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAction = (action) => {
    if (isTransitioning) return;

    // Start transition
    setIsTransitioning(true);

    // First, handle card flip if it's currently flipped
    if (isFlipped) {
      setIsFlipped(false);
    }

    // Process the card immediately
    let updatedDeck = [...deck];
    let nextCardIndex = currentCard;

    if (action === "great") {
      // Remove current card from deck
      updatedDeck = updatedDeck.filter((_, index) => index !== currentCard);
      
      // If we removed the last card in the deck or the current card was the last one
      if (updatedDeck.length === 0 || currentCard >= updatedDeck.length) {
        nextCardIndex = 0;
      }
    } else if (action === "bad") {
      // Move current card to the end
      const currentCardData = deck[currentCard];
      updatedDeck = updatedDeck.filter((_, index) => index !== currentCard);
      updatedDeck.push(currentCardData);
      
      // If we were at the last card, go to the first card
      if (currentCard >= updatedDeck.length - 1) {
        nextCardIndex = 0;
      }
    } else {
      // For "good", just move to the next card
      nextCardIndex = (currentCard + 1) % updatedDeck.length;
    }
    
    // Update the deck and current card immediately
    setDeck(updatedDeck);
    setCurrentCard(nextCardIndex);
    
    // End transition after a brief delay to prevent accidental clicks
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  };

  const resetDeck = () => {
    shuffleDeck();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleExcludedIdsChange = (event) => {
    const ids = event.target.value
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id)
      .map(Number);
    setExcludedCardIds(ids);
  };

  const handleUnitSelection = (event) => {
    const unit = Number(event.target.value);
    if (event.target.checked) {
      setSelectedUnits([...selectedUnits, unit]);
    } else {
      setSelectedUnits(selectedUnits.filter((u) => u !== unit));
    }
  };

  if (deck.length === 0) {
    return (
      <div className="flashcards-container">
        <h1 className="title">Flashcards</h1>
        <div className="end-of-deck-message">
          <h2>All cards marked as Great!</h2>
          <p>Reset the deck to continue studying.</p>
        </div>
        <button className="reset-button" onClick={resetDeck}>
          Reset Deck
        </button>
      </div>
    );
  }

  const toBCE = (date) => {
    date = date.split("/");
    if (date.length === 2) {
      date[0] = date[0].startsWith("-") ? date[0].slice(1) + " BCE" : date[0];
      date[1] = date[1].startsWith("-") ? date[1].slice(1) + " BCE" : date[1];
      return date.join(" - ");
    }

    return date[0].startsWith("-") ? date[0].slice(1) + " BCE" : date[0];
  };

  // Ensure we have a valid card to display
  const cardToShow = deck[currentCard] || deck[0];
  if (!cardToShow) {
    return (
      <div className="flashcards-container">
        <h1 className="title">Flashcards</h1>
        <div className="end-of-deck-message">
          <h2>Error loading cards</h2>
          <p>Please reset the deck to continue.</p>
        </div>
        <button className="reset-button" onClick={resetDeck}>
          Reset Deck
        </button>
      </div>
    );
  }

  return (
    <div className="flashcards-container">
      <h1 className="title">Flashcards</h1>
      <div className="progress">{deck.length} cards remaining</div>
      <div className={`saving-indicator ${isSaving ? "show" : ""}`}>
        Progress saved
      </div>
      <div
        className={`flashcard ${isFlipped ? "flipped" : ""}`}
        onClick={!isTransitioning ? handleFlip : null}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <img
              src={require(`../../artImages/${cardToShow.image[0]}`)}
              alt={cardToShow.name}
              className="flashcard-image"
            />
            <Link
              to={`/exhibit?id=${cardToShow.id}`}
              className="full-page-button"
              onClick={(e) => e.stopPropagation()}
            >
              View Details
            </Link>
          </div>

          <div className="flashcard-back">
            {isFlipped && (
              <>
                <h3 className="flashcard-title">
                  {cardToShow.id}.{" "}
                  <strong>{cardToShow.name}</strong>
                </h3>
                <p>Location: {cardToShow.location}</p>
                <p>
                  Artist/Culture:{" "}
                  {cardToShow.artist_culture || "Unknown"}
                </p>
                <p>Date: {toBCE(cardToShow.date)}</p>
                <p>Materials: {cardToShow.materials}</p>
                <Link
                  to={`/exhibit?id=${cardToShow.id}`}
                  className="full-page-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <button
          className="bad-button"
          onClick={!isTransitioning ? () => handleAction("bad") : null}
          disabled={isTransitioning}
        >
          Bad
        </button>
        <button
          className="good-button"
          onClick={!isTransitioning ? () => handleAction("good") : null}
          disabled={isTransitioning}
        >
          Good
        </button>
        <button
          className="great-button"
          onClick={!isTransitioning ? () => handleAction("great") : null}
          disabled={isTransitioning}
        >
          Great
        </button>
      </div>
      <button 
        className="reset-button" 
        onClick={!isTransitioning ? resetDeck : null}
        disabled={isTransitioning}
      >
        Reset Deck
      </button>

      <button 
        className="settings-button" 
        onClick={!isTransitioning ? toggleSettings : null}
        disabled={isTransitioning}
      >
        <i className="fas fa-cog"></i>
      </button>

      <div className={`settings-modal ${showSettings ? "show" : ""}`}>
        <h3>Settings</h3>
        <div className="unit-selection">
          <h4>Select Units to Include</h4>
          {[...new Set(artPiecesData.map((item) => item.unit))].map((unit) => (
            <label key={unit}>
              <input
                type="checkbox"
                value={unit}
                onChange={handleUnitSelection}
                checked={selectedUnits.includes(unit)}
              />
              Unit {unit}
            </label>
          ))}
        </div>
        <div className="exclude-ids">
          <h4>Exclude Specific Card IDs</h4>
          <input
            type="text"
            placeholder="Comma-separated IDs"
            value={excludedCardIds.join(", ")}
            onChange={handleExcludedIdsChange}
          />
        </div>
        <button 
          className="close-settings" 
          onClick={toggleSettings}
          disabled={isTransitioning}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
