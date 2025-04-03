import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Flashcards.css";
import artPiecesData from "../../data/artworks.json";
import dueDatesData from "../../pages/Calendar/DueDates.json";

// Korus' order array - used to determine the correct learning sequence
const korusArray = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 19, 25, 30, 13, 15, 17, 18,
  20, 21, 22, 23, 24, 26, 27, 28, 33, 34, 35, 36, 37, 38, 41, 29, 31, 32,
  39, 40, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 58, 59,
  60, 61, 62, 64, 63, 67, 69, 70, 71, 72, 73, 76, 75, 80, 78, 66, 68, 74,
  77, 79, 83, 82, 85, 86, 87, 88, 89, 91, 92, 93, 96, 98, 153, 159, 160,
  161, 162, 155, 157, 158, 154, 156, 163, 164, 165, 166, 81, 90, 94, 95, 97,
  99, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180,
  213, 217, 221, 218, 214, 215, 216, 219, 220, 222, 223, 181, 183, 185, 186,
  187, 56, 57, 65, 188, 189, 190, 191, 208, 209, 84, 202, 200, 192, 199,
  182, 198, 184, 195, 197, 207, 193, 194, 201, 204, 206, 212, 205, 196, 203,
  210, 211, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 110,
  114, 117, 127, 113, 116, 118, 115, 119, 120, 121, 122, 123, 124, 125, 126,
  128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
  143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 224, 225, 226, 227, 228,
  229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243,
  244, 245, 246, 247, 248, 249, 250,
];

// Create a mapping of IDs to due dates from DueDates.json
const createDueDatesMap = () => {
  const dueDatesMap = new Map();
  dueDatesData.assignments.forEach(assignment => {
    const id = parseInt(assignment.id, 10);
    if (!isNaN(id)) {
      dueDatesMap.set(id, new Date(assignment.dueDate));
    }
  });
  return dueDatesMap;
};

const dueDatesMap = createDueDatesMap();

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
  const [displayCardsDueBy, setDisplayCardsDueBy] = useState(new Date());

  // Get cards that are due by today's date or the selected date
  const getCardsDueByDate = useCallback((date) => {
    const cardIds = [];
    dueDatesMap.forEach((dueDate, id) => {
      if (dueDate <= date) {
        cardIds.push(id);
      }
    });
    return cardIds;
  }, []);

  // Create a proper filter that follows Korus' teaching order
  const getCardsInKorusOrder = useCallback((dueIds) => {
    // Create a set for O(1) lookup
    const dueIdsSet = new Set(dueIds);
    
    // Find all cards in korusArray that are also in the due cards set
    return korusArray.filter(id => dueIdsSet.has(id));
  }, []);

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

  // Format date to YYYY-MM-DD for the date input
  const formatDateForInput = (date) => {
    const d = new Date(date);
    // Adjust for timezone to prevent date shift
    const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return localDate.toISOString().split('T')[0];
  };

  // Reset deck when settings change
  useEffect(() => {
    if (isInitialized) {
      // Only regenerate the deck when units or dates change, but only if we don't have a saved deck
      if (deck.length === 0) {
        shuffleDeck();
      }
    }
  }, [selectedUnits, displayCardsDueBy, isInitialized, shuffleDeck, deck]);

  // Load saved progress from localStorage - runs only once
  useEffect(() => {
    try {
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
        const parsedDeck = JSON.parse(savedDeck);
        if (Array.isArray(parsedDeck) && parsedDeck.length > 0) {
          setDeck(parsedDeck);
          const cardIndex = parseInt(savedCurrentCard, 10);
          setCurrentCard(isNaN(cardIndex) ? 0 : cardIndex);
        } else {
          shuffleDeck(true);
        }
      } else {
        shuffleDeck(true);
      }
    } catch (error) {
      console.error("Error loading saved progress:", error);
      shuffleDeck(true);
    } finally {
      setIsInitialized(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Create a memoized function to handle the saving logic
  const saveProgress = useCallback(() => {
    if (!isInitialized || !deck || deck.length === 0) return;

    try {
      setIsSaving(true);
      localStorage.setItem("flashcards_deck", JSON.stringify(deck));
      localStorage.setItem("flashcards_currentCard", currentCard.toString());
      localStorage.setItem("flashcards_excludedIds", JSON.stringify(excludedCardIds));
      localStorage.setItem("flashcards_selectedUnits", JSON.stringify(selectedUnits));
      
      const timer = setTimeout(() => {
        setIsSaving(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error saving progress:", error);
      setIsSaving(false);
    }
  }, [deck, currentCard, excludedCardIds, selectedUnits, isInitialized]);

  // Save progress whenever relevant state changes
  useEffect(() => {
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

    setIsTransitioning(true);

    const processCard = () => {
      let updatedDeck = [...deck];
      let nextCardIndex = currentCard;

      switch (action) {
        case "great":
          // Remove current card from deck
          updatedDeck = updatedDeck.filter((_, index) => index !== currentCard);
          nextCardIndex = updatedDeck.length === 0 ? 0 : currentCard % updatedDeck.length;
          break;

        case "bad":
          // Move current card to the end
          if (currentCard < updatedDeck.length) {
            const currentCardData = updatedDeck[currentCard];
            updatedDeck = updatedDeck.filter((_, index) => index !== currentCard);
            updatedDeck.push(currentCardData);
            nextCardIndex = currentCard >= updatedDeck.length - 1 ? 0 : currentCard;
          }
          break;

        case "good":
          // Just move to next card
          nextCardIndex = (currentCard + 1) % updatedDeck.length;
          break;

        default:
          break;
      }

      setDeck(updatedDeck);
      setCurrentCard(nextCardIndex);
      setIsTransitioning(false);
    };

    // Handle card flip animation before processing
    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(processCard, 300);
    } else {
      processCard();
    }
  };

  const resetDeck = () => {
    if (isTransitioning) return;
    shuffleDeck();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleUnitSelection = (event) => {
    const unit = Number(event.target.value);
    if (event.target.checked) {
      setSelectedUnits([...selectedUnits, unit]);
    } else {
      setSelectedUnits(selectedUnits.filter((u) => u !== unit));
    }
  };

  // Handle date change with timezone adjustment
  const handleDisplayCardsDueByChange = (event) => {
    const inputDate = event.target.value; // YYYY-MM-DD format
    // Create date at midnight in local timezone
    const selectedDate = new Date(inputDate + 'T00:00:00');
    setDisplayCardsDueBy(selectedDate);
  };

  // Helper to get a count of cards based on the current date and units
  const getCardCountInfo = useCallback(() => {
    const cardsDueByDate = getCardsDueByDate(displayCardsDueBy);
    const cardsInKorusOrder = getCardsInKorusOrder(cardsDueByDate);
    
    // Get the highest card number in Korus order
    const highestCardNum = cardsInKorusOrder.length > 0 ? 
      cardsInKorusOrder[cardsInKorusOrder.length - 1] : 0;
    
    return {
      totalCards: cardsInKorusOrder.length,
      highestCard: highestCardNum
    };
  }, [displayCardsDueBy, getCardsDueByDate, getCardsInKorusOrder]);

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

  const cardInfo = getCardCountInfo();

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
        
        <div className="due-date-setting">
          <h4>Show Cards Due By</h4>
          <div className="date-selector">
            <input
              type="date"
              value={formatDateForInput(displayCardsDueBy)}
              onChange={handleDisplayCardsDueByChange}
              className="date-input"
            />
            <p className="card-count-info">
              This includes {cardInfo.totalCards} cards (up to #{cardInfo.highestCard} in Korus' order)
            </p>
          </div>
        </div>
        
        <div className="unit-selection">
          <h4>Units to Include</h4>
          <p className="unit-hint">No selection means all units</p>
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
