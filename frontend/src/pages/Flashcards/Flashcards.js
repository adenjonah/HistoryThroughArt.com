import React, { useState, useEffect, useCallback } from "react";
import Flashcard from "./Flashcard";
import SettingsModal from "./SettingsModal";
import artPiecesData from "../../data/artworks.json";
import ActionButtons from "./ActionButtons";

const Flashcards = () => {
  const [state, setState] = useState({
    currentCard: 0,
    isFlipped: false,
    isTransitioning: false,
    showSettings: false,
  });
  const [deck, setDeck] = useState([...artPiecesData]);
  const [excludedCardIds, setExcludedCardIds] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);

  const toBCE = (date) => {
    // If the date is a range (e.g., "-520/-500"), handle both parts
    if (date.includes("/")) {
      const parts = date.split("/");
      return parts
        .map((part) => (part.startsWith("-") ? part.slice(1) + " BCE" : part))
        .join(" - ");
    }

    // Handle single dates
    return date.startsWith("-") ? date.slice(1) + " BCE" : date;
  };

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const shuffleDeck = useCallback(() => {
    const filteredDeck = artPiecesData.filter(
      (card) =>
        (selectedUnits.length === 0 || selectedUnits.includes(card.unit)) &&
        !excludedCardIds.includes(card.id)
    );
    const shuffledDeck = [...filteredDeck].sort(() => Math.random() - 0.5);
    setDeck(shuffledDeck);
    updateState({ currentCard: 0, isFlipped: false });
  }, [selectedUnits, excludedCardIds]);

  useEffect(() => {
    shuffleDeck();
  }, [shuffleDeck]);

  const handleFlip = () => {
    if (!state.isTransitioning) {
      updateState({ isFlipped: !state.isFlipped });
    }
  };

  const handleAction = (action) => {
    if (state.isTransitioning) return;

    updateState({ isTransitioning: true });

    setTimeout(() => {
      let updatedDeck = [...deck];
      if (action === "great") {
        updatedDeck = updatedDeck.filter(
          (_, index) => index !== state.currentCard
        );
      } else if (action === "bad") {
        updatedDeck.push(deck[state.currentCard]);
      }
      setDeck(updatedDeck.sort(() => Math.random() - 0.5));
      updateState({
        currentCard: (state.currentCard + 1) % updatedDeck.length,
        isFlipped: false,
        isTransitioning: false,
      });
    }, 300);
  };

  const toggleSettings = () => {
    updateState({ showSettings: !state.showSettings });
  };

  if (deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <h2 className="text-2xl font-bold mb-4">
          All cards marked as Great! Reset the deck to continue.
        </h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={shuffleDeck}
        >
          Reset Deck
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 bg-background min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-text">Flashcards</h1>
      <div className="text-lg text-gray-600 mb-4">
        {deck.length} cards remaining
      </div>

      <Flashcard
        card={{
          ...deck[state.currentCard],
          formattedDate: toBCE(deck[state.currentCard].date),
        }}
        isFlipped={state.isFlipped}
        handleFlip={handleFlip}
        width="80rem" // Example width
        height="60rem" // Example height
      />

      <ActionButtons handleAction={handleAction} />

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={shuffleDeck}
      >
        Reset Deck
      </button>

      <button
        className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        onClick={toggleSettings}
      >
        Settings
      </button>

      {state.showSettings && (
        <SettingsModal
          selectedUnits={selectedUnits}
          setSelectedUnits={setSelectedUnits}
          setExcludedCardIds={setExcludedCardIds}
          toggleSettings={toggleSettings}
        />
      )}
    </div>
  );
};

export default Flashcards;
