import React, { useState, useEffect, useCallback } from "react";
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
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">
          All cards marked as Great! Reset the deck to continue.
        </h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={resetDeck}
        >
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
    <div className="flex flex-col items-center p-4 bg-[#210b2c] min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Flashcards</h1>
      <div className="text-lg text-gray-600 mb-4">
        {deck.length} cards remaining
      </div>

      <div
        className={`relative w-96 h-64 bg-white rounded-lg shadow-lg transition-transform duration-300 cursor-pointer ${
          isFlipped ? "transform rotate-y-180" : ""
        }`}
        onClick={!isTransitioning ? handleFlip : null}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {!isFlipped ? (
            <img
              src={require(`../../artImages/${deck[currentCard].image[0]}`)}
              alt={deck[currentCard].name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">
                {deck[currentCard].id}. {deck[currentCard].name}
              </h3>
              <p className="text-gray-600">
                Location: {deck[currentCard].location}
              </p>
              <p className="text-gray-600">
                Artist/Culture: {deck[currentCard].artist_culture || "Unknown"}
              </p>
              <p className="text-gray-600">
                Date: {toBCE(deck[currentCard].date)}
              </p>
              <p className="text-gray-600">
                Materials: {deck[currentCard].materials}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={!isTransitioning ? () => handleAction("bad") : null}
        >
          Bad
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={!isTransitioning ? () => handleAction("good") : null}
        >
          Good
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={!isTransitioning ? () => handleAction("great") : null}
        >
          Great
        </button>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={resetDeck}
      >
        Reset Deck
      </button>

      <button
        className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        onClick={toggleSettings}
      >
        Settings
      </button>

      {showSettings && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Settings</h3>
            <div className="mb-4">
              <h4 className="text-lg font-semibold">Select Units to Include</h4>
              {[...new Set(artPiecesData.map((item) => item.unit))].map(
                (unit) => (
                  <label key={unit} className="block mt-2">
                    <input
                      type="checkbox"
                      value={unit}
                      onChange={handleUnitSelection}
                      checked={selectedUnits.includes(unit)}
                      className="mr-2"
                    />
                    Unit {unit}
                  </label>
                )
              )}
            </div>
            <div className="mb-4">
              <h4 className="text-lg font-semibold">
                Exclude Specific Card IDs
              </h4>
              <input
                type="text"
                placeholder="Comma-separated IDs"
                onChange={handleExcludedIdsChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={toggleSettings}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
