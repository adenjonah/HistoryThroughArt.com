import React, { useState, useEffect, useCallback } from "react";
import "./Flashcards.css";
import artPiecesData from "../../data/artworks.json";
import dueDates from "./DueDates.json";

const korusArray = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 19, 25, 30, 13, 15, 17, 18, 20,
  21, 22, 23, 24, 26, 27, 28, 33, 34, 35, 36, 37, 38, 41, 29, 31, 32, 39, 40,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 58, 59, 60, 61, 62,
  64, 63, 67, 69, 70, 71, 72, 73, 76, 75, 80, 78, 66, 68, 74, 77, 79, 83, 82,
  85, 86, 87, 88, 89, 91, 92, 93, 96, 98, 153, 159, 160, 161, 162, 155, 157,
  158, 154, 156, 163, 164, 165, 166, 81, 90, 94, 95, 97, 99, 167, 168, 169, 170,
  171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 213, 217, 221, 218, 214,
  215, 216, 219, 220, 222, 223, 181, 183, 185, 186, 187, 56, 57, 65, 188, 189,
  190, 191, 208, 209, 84, 202, 200, 192, 199, 182, 198, 184, 195, 197, 207, 193,
  194, 201, 204, 206, 212, 205, 196, 203, 210, 211, 100, 101, 102, 103, 104,
  105, 106, 107, 108, 109, 111, 112, 110, 114, 117, 127, 113, 116, 118, 115,
  119, 120, 121, 122, 123, 124, 125, 126, 128, 129, 130, 131, 132, 133, 134,
  135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149,
  150, 151, 152, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235,
  236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250,
];

const Flashcards = () => {
  const [currentCard, setCurrentCard] = useState(
    () => JSON.parse(localStorage.getItem("currentCard")) || 0
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState(
    () => JSON.parse(localStorage.getItem("deck")) || [...artPiecesData]
  );
  const [excludedCardIds, setExcludedCardIds] = useState(
    () => JSON.parse(localStorage.getItem("excludedCardIds")) || []
  );
  const [selectedUnits, setSelectedUnits] = useState(
    () => JSON.parse(localStorage.getItem("selectedUnits")) || []
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState(
    () => JSON.parse(localStorage.getItem("mode")) || "Learned"
  );

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentCard", JSON.stringify(currentCard));
    localStorage.setItem("deck", JSON.stringify(deck));
    localStorage.setItem("excludedCardIds", JSON.stringify(excludedCardIds));
    localStorage.setItem("selectedUnits", JSON.stringify(selectedUnits));
    localStorage.setItem("mode", JSON.stringify(mode));
  }, [currentCard, deck, excludedCardIds, selectedUnits, mode]);

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

  const resetDeckToOriginal = () => {
    // Clear localStorage and reset all state
    localStorage.clear();
    setDeck([...artPiecesData]);
    setCurrentCard(0);
    setExcludedCardIds([]);
    setSelectedUnits([]);
    setMode("Learned");
    setIsFlipped(false);
  };

  const getMostRecentId = () => {
    const today = new Date();
    let mostRecentDate = new Date("1970-01-01");
    let mostRecentId = null;

    console.log("Today:", today);

    dueDates.assignments.forEach((assignment) => {
      const assignmentDate = new Date(assignment.dueDate);
      console.log(
        "Checking assignment:",
        assignment.id,
        "with date:",
        assignmentDate
      );

      if (assignmentDate <= today && assignmentDate > mostRecentDate) {
        mostRecentDate = assignmentDate;
        mostRecentId = parseInt(assignment.id, 10);
        console.log(
          "Updated most recent ID:",
          mostRecentId,
          "Date:",
          mostRecentDate
        );
      }
    });

    return mostRecentId;
  };

  const filterLearnedDeck = useCallback(() => {
    if (mode === "Learned") {
      const mostRecentId = getMostRecentId();
      console.log("Most Recent ID:", mostRecentId);

      if (mostRecentId !== null) {
        const mostRecentIndex = korusArray.indexOf(mostRecentId);

        if (mostRecentIndex !== -1) {
          const filteredIds = korusArray.slice(0, mostRecentIndex + 1);
          console.log("Filtered IDs going into the deck:", filteredIds);

          const filteredDeck = artPiecesData.filter((card) =>
            filteredIds.includes(card.id)
          );

          setDeck(filteredDeck);
          setCurrentCard(0);
        } else {
          console.warn("Most recent ID not found in korusArray.");
          setDeck([]);
        }
      } else {
        console.warn("Most recent ID is null.");
        setDeck([]);
      }
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "Learned") {
      filterLearnedDeck();
    } else {
      shuffleDeck();
    }
  }, [mode, shuffleDeck, filterLearnedDeck]);

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

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  if (deck.length === 0) {
    return (
      <div className="flashcards-container">
        <h2>All cards marked as Great! Reset the deck to continue.</h2>
        <button className="reset-button" onClick={resetDeckToOriginal}>
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
      <button className="reset-button" onClick={resetDeckToOriginal}>
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
        <div className="mode-toggle">
          <h4 className="text-lg font-semibold mb-2">Mode</h4>
          <div className="flex items-center">
            <span className="mr-3 text-sm">
              {mode === "All" ? "All" : "Learned"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={mode === "Learned"} // Default checked if mode is "Learned"
                onChange={() =>
                  handleModeChange(mode === "All" ? "Learned" : "All")
                }
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-400 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500"></div>
              <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-md transform peer-checked:translate-x-6 transition-transform"></div>
            </label>
          </div>
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
