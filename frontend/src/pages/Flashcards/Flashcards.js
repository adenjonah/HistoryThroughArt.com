import React, { useState, useEffect, useCallback } from "react";
import "./Flashcards.css";
import artPiecesData from "../../data/artworks.json";

const Flashcards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState([...artPiecesData]);
  const [excludedCardIds, setExcludedCardIds] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const shuffleDeck = useCallback(() => {
    const filteredDeck = artPiecesData.filter(
      (card) =>
        (selectedUnits.length === 0 || selectedUnits.includes(card.unit)) &&
        !excludedCardIds.includes(card.id)
    );
    const shuffledDeck = [...filteredDeck].sort(() => Math.random() - 0.5);
    setDeck(shuffledDeck);
    setCurrentCard(0);
    setIsFlipped(false);
  }, [selectedUnits, excludedCardIds]);

  useEffect(() => {
    shuffleDeck();
  }, [shuffleDeck]);

  const handleFlip = () => {
    if (!isTransitioning) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAction = (action) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      let updatedDeck = [...deck];

      if (action === "great") {
        updatedDeck = updatedDeck.filter((_, index) => index !== currentCard);
      } else if (action === "bad") {
        updatedDeck.push(deck[currentCard]);
        shuffleDeck();
      }
      setCurrentCard((prev) => (prev + 1) % updatedDeck.length);

      setDeck(updatedDeck.sort(() => Math.random() - 0.5));

      setIsFlipped(false);
      setIsTransitioning(false);
    }, 300);
  };

  const resetDeck = () => {
    shuffleDeck();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleExcludedIdsChange = (event) => {
    const ids = event.target.value.split(",").map(Number);
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
        <h2>All cards marked as Great! Reset the deck to continue.</h2>
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

    return date[0].startsWith("-") ? date.slice(1) + " BCE" : date;
  };

  return (
    <div className="flashcards-container">
      <h1 className="title">Flashcards</h1>
      <div className="progress">{deck.length} cards remaining</div>
      <div
        className={`flashcard ${isFlipped ? "flipped" : ""}`}
        onClick={!isTransitioning ? handleFlip : null}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <img
              src={require(`../../artImages/${deck[currentCard].image[0]}`)}
              alt={deck[currentCard].name}
              className="flashcard-image"
            />
          </div>

          <div className="flashcard-back">
            {isFlipped && (
              <>
                <h3 className="flashcard-title">
                  {deck[currentCard].id}.{" "}
                  <strong>{deck[currentCard].name}</strong>
                </h3>
                <p>Location: {deck[currentCard].location}</p>
                <p>
                  Artist/Culture:{" "}
                  {deck[currentCard].artist_culture || "Unknown"}
                </p>
                <p>Date: {toBCE(deck[currentCard].date)}</p>
                <p>Materials: {deck[currentCard].materials}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <button
          className="bad-button"
          onClick={!isTransitioning ? () => handleAction("bad") : null}
        >
          Bad
        </button>
        <button
          className="good-button"
          onClick={!isTransitioning ? () => handleAction("good") : null}
        >
          Good
        </button>
        <button
          className="great-button"
          onClick={!isTransitioning ? () => handleAction("great") : null}
        >
          Great
        </button>
      </div>
      <button className="reset-button" onClick={resetDeck}>
        Reset Deck
      </button>

      <button className="settings-button" onClick={toggleSettings}>
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
            onChange={handleExcludedIdsChange}
          />
        </div>
        <button className="close-settings" onClick={toggleSettings}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
