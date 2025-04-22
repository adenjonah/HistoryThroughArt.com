import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [displayCardsDueBy, setDisplayCardsDueBy] = useState(new Date());
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [showSwipeInstructions, setShowSwipeInstructions] = useState(true);
  const [cardAnimation, setCardAnimation] = useState('');
  const [nextCardReady, setNextCardReady] = useState(true);
  const [showDuplicateMessage, setShowDuplicateMessage] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [preloadedImages, setPreloadedImages] = useState([]);
  
  // Refs for touch handling
  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchEndRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Add state for undo history
  const [undoHistory, setUndoHistory] = useState([]);
  const MAX_UNDO_STEPS = 3;

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
  const shuffleDeck = useCallback((forceNewDeck = false) => {
    // If we're not forcing a new deck (like during a reset), don't overwrite the deck
    if (!forceNewDeck && deck.length > 0) {
      return; // Keep the existing deck
    }
    
    console.log("Creating new deck with due date:", displayCardsDueBy);
    
    // First, get all cards that are due by the selected date
    const cardsDueByDate = getCardsDueByDate(displayCardsDueBy);
    console.log("Cards due by date:", cardsDueByDate.length, "cards");
    
    // Filter to get only the cards that follow Korus' teaching order
    const cardsInKorusOrder = getCardsInKorusOrder(cardsDueByDate);
    console.log("Cards in Korus order:", cardsInKorusOrder.length, "cards");
    
    // Create a mapping of ID to position in Korus array for sorting
    const korusOrderMap = new Map();
    korusArray.forEach((id, index) => {
      korusOrderMap.set(id, index);
    });
    
    // Create a lookup map for artwork data by ID
    const artworksById = new Map();
    artPiecesData.forEach(artwork => {
      artworksById.set(artwork.id, artwork);
    });
    
    // Build the deck following Korus' exact order
    let filteredDeck = [];
    for (const id of cardsInKorusOrder) {
      const artwork = artworksById.get(id);
      if (artwork && (selectedUnits.length === 0 || selectedUnits.includes(artwork.unit))) {
        filteredDeck.push(artwork);
      }
    }
    
    console.log("Final filtered deck:", filteredDeck.length, "cards");
    
    // No need to shuffle - we want to maintain Korus' order
    setDeck(filteredDeck);
    setCurrentCard(0);
    setIsFlipped(false);

    // We no longer clear localStorage here to ensure progress is saved
  }, [selectedUnits, displayCardsDueBy, getCardsDueByDate, getCardsInKorusOrder, deck]);

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

  // Save progress immediately when it changes
  useEffect(() => {
    // Only save after initial loading is complete and when we have valid data
    if (isInitialized && deck.length > 0) {
      // Save all state to localStorage for complete persistence
      localStorage.setItem("flashcards_deck", JSON.stringify(deck));
      localStorage.setItem("flashcards_currentCard", currentCard.toString());
      localStorage.setItem("flashcards_isFlipped", JSON.stringify(isFlipped));
      localStorage.setItem("flashcards_selectedUnits", JSON.stringify(selectedUnits));
      localStorage.setItem("flashcards_displayCardsDueBy", displayCardsDueBy.toISOString());
      localStorage.setItem("flashcards_showSettings", JSON.stringify(showSettings));
      localStorage.setItem("flashcards_isShuffled", JSON.stringify(isShuffled));
      
      // Show saving indicator
      setIsSaving(true);
      
      // Hide the saving indicator after a delay
      const timer = setTimeout(() => {
        setIsSaving(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [
    deck, 
    currentCard,
    isFlipped,
    selectedUnits, 
    displayCardsDueBy,
    showSettings,
    isInitialized,
    isShuffled
  ]);

  // Load saved progress from localStorage - update to load shuffle state
  useEffect(() => {
    // Load all saved settings
    const savedDeck = localStorage.getItem("flashcards_deck");
    const savedCurrentCard = localStorage.getItem("flashcards_currentCard");
    const savedIsFlipped = localStorage.getItem("flashcards_isFlipped");
    const savedSelectedUnits = localStorage.getItem("flashcards_selectedUnits");
    const savedDisplayCardsDueBy = localStorage.getItem("flashcards_displayCardsDueBy");
    const savedShowSettings = localStorage.getItem("flashcards_showSettings");
    const savedIsShuffled = localStorage.getItem("flashcards_isShuffled");

    let needsNewDeck = false;

    // Load saved deck and current card
    if (savedDeck && savedCurrentCard) {
      try {
        const parsedDeck = JSON.parse(savedDeck);
        if (Array.isArray(parsedDeck) && parsedDeck.length > 0) {
          setDeck(parsedDeck);
          setCurrentCard(parseInt(savedCurrentCard, 10) || 0);
          
          // Restore flipped state
          if (savedIsFlipped) {
            setIsFlipped(JSON.parse(savedIsFlipped));
          }
          
          // Restore shuffled state
          if (savedIsShuffled) {
            setIsShuffled(JSON.parse(savedIsShuffled));
          }
        } else {
          needsNewDeck = true;
        }
      } catch (error) {
        console.error("Error loading saved flashcards:", error);
        needsNewDeck = true;
      }
    } else {
      needsNewDeck = true;
    }
    
    // Load selected units
    if (savedSelectedUnits) {
      try {
        setSelectedUnits(JSON.parse(savedSelectedUnits));
      } catch (error) {
        console.error("Error loading saved units:", error);
      }
    }
    
    // Load due date
    if (savedDisplayCardsDueBy) {
      try {
        setDisplayCardsDueBy(new Date(savedDisplayCardsDueBy));
      } catch (error) {
        console.error("Error loading saved date:", error);
      }
    }

    // Load settings panel state
    if (savedShowSettings) {
      try {
        setShowSettings(JSON.parse(savedShowSettings));
      } catch (error) {
        console.error("Error loading settings panel state:", error);
      }
    }
    
    setIsInitialized(true);

    // Only generate a new deck if we couldn't load one
    if (needsNewDeck) {
      // We use setTimeout to ensure all state is set before shuffleDeck runs
      setTimeout(() => shuffleDeck(true), 0);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally leaving shuffleDeck out of deps to avoid re-running on mount

  // Function to hide swipe instructions after a few uses
  useEffect(() => {
    // Check if user has acknowledged instructions before
    const hasSeenInstructions = localStorage.getItem("flashcards_hasSeenSwipeInstructions");
    
    if (hasSeenInstructions) {
      setShowSwipeInstructions(false);
    } else {
      // Auto-hide instructions after 10 seconds
      const timer = setTimeout(() => {
        setShowSwipeInstructions(false);
        localStorage.setItem("flashcards_hasSeenSwipeInstructions", "true");
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Hide instructions after first successful swipe
  useEffect(() => {
    if (swipeDirection && showSwipeInstructions) {
      setShowSwipeInstructions(false);
      localStorage.setItem("flashcards_hasSeenSwipeInstructions", "true");
    }
  }, [swipeDirection, showSwipeInstructions]);

  const handleFlip = useCallback(() => {
    if (!isTransitioning) {
      setIsFlipped(!isFlipped);
    }
  }, [isTransitioning, isFlipped]);

  // Add function to preload images
  const preloadImages = useCallback((cardIndexes) => {
    const imagePromises = cardIndexes.map((index) => {
      if (index >= 0 && index < deck.length) {
        const card = deck[index];
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(card.id);
          img.onerror = () => reject(card.id);
          img.src = require(`../../artImages/${card.image[0]}`);
        });
      }
      return Promise.resolve(null);
    });
    
    Promise.all(imagePromises)
      .then(results => {
        setPreloadedImages(prev => [...prev, ...results.filter(id => id !== null)]);
      })
      .catch(err => console.error("Error preloading images:", err));
  }, [deck]);

  // Preload next few images when deck or current card changes
  useEffect(() => {
    if (deck.length > 0) {
      // Preload the next 3 images (or fewer if near the end of the deck)
      const nextIndexes = [];
      for (let i = 1; i <= 3; i++) {
        const nextIndex = (currentCard + i) % deck.length;
        if (nextIndex !== currentCard) {
          nextIndexes.push(nextIndex);
        }
      }
      preloadImages(nextIndexes);
    }
  }, [deck, currentCard, preloadImages]);

  // Function to save current state to history before making changes
  const saveStateToHistory = useCallback(() => {
    // Create a snapshot of the current state
    const currentState = {
      deck: [...deck],
      currentCard: currentCard,
      isFlipped: isFlipped
    };
    
    // Add to history, keeping only the most recent MAX_UNDO_STEPS
    setUndoHistory(prev => {
      const newHistory = [currentState, ...prev];
      return newHistory.slice(0, MAX_UNDO_STEPS);
    });
  }, [deck, currentCard, isFlipped]);

  // Function to perform undo
  const handleUndo = () => {
    if (undoHistory.length === 0 || isTransitioning) return;
    
    // Get the most recent state from history
    const [previousState, ...remainingHistory] = undoHistory;
    
    // Set all states back to their previous values
    setDeck(previousState.deck);
    setCurrentCard(previousState.currentCard);
    setIsFlipped(previousState.isFlipped);
    
    // Remove the used state from history
    setUndoHistory(remainingHistory);
    
    // Show a notification that we've undone an action
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  // Update handleAction to save state before making changes
  const handleAction = useCallback((action) => {
    if (isTransitioning) return;

    // Save current state to history before making changes
    saveStateToHistory();

    // Start transition
    setIsTransitioning(true);
    
    // Set animation based on action
    if (action === 'bad') {
      setCardAnimation('swipe-left');
      // Show duplicate message when marking as bad
      setShowDuplicateMessage(true);
      // Hide the message after 2 seconds
      setTimeout(() => setShowDuplicateMessage(false), 2000);
    } else if (action === 'good') {
      setCardAnimation('swipe-up');
    } else if (action === 'great') {
      setCardAnimation('swipe-right');
    }

    // If it's flipped, we'll still process immediately
    // We don't need to wait for the flip animation
    processCard();

    function processCard() {
      // Hide the current card first (with animation)
      setNextCardReady(false);
      
      // Delay before processing the deck update - make this faster
      setTimeout(() => {
        let updatedDeck = [...deck];
        let nextCardIndex = currentCard;

        if (action === "great") {
          // Remove current card from deck
          updatedDeck = updatedDeck.filter((_, index) => index !== currentCard);
          
          // If we removed the last card in the deck or the current card was the last one
          if (updatedDeck.length === 0) {
            // No cards left, just end the transition
            setIsTransitioning(false);
            return; // Exit early - the empty deck view will be shown
          } else if (currentCard >= updatedDeck.length) {
            nextCardIndex = 0;
          }
        } else if (action === "bad") {
          // CHANGED: Instead of just moving to the end, create a duplicate of the current card
          const currentCardData = deck[currentCard];
          
          // Create a deep copy to avoid reference issues
          const duplicateCard = JSON.parse(JSON.stringify(currentCardData));
          
          // Add the duplicate to the end of the deck
          updatedDeck.push(duplicateCard);
          
          // Move to the next card
          nextCardIndex = (currentCard + 1) % updatedDeck.length;
        } else {
          // For "good", just move to the next card
          nextCardIndex = (currentCard + 1) % updatedDeck.length;
        }
        
        // Update the deck
        setDeck(updatedDeck);
        
        // Reset flipped state for the new card
        setIsFlipped(false);
        
        // Move to next card
        setCurrentCard(nextCardIndex);
        
        // Reset animation and prepare for next card to enter
        setCardAnimation('');
        
        // Short delay before showing next card with entrance animation
        // Make this much faster
        setTimeout(() => {
          // Ensure the card is fully reset before making it visible
          if (cardRef.current) {
            cardRef.current.style.transform = 'translateX(0) translateY(0) rotate(0)';
          }
          
          setNextCardReady(true);
          setIsTransitioning(false);
        }, 10);
      }, 250); // Make the exit animation time shorter
    }
  }, [isTransitioning, deck, currentCard, saveStateToHistory]);

  const resetDeck = (shouldShuffle = false) => {
    console.log("Resetting deck, shuffle:", shouldShuffle);
    setIsShuffled(shouldShuffle);
    
    // Clear localStorage items related to flashcards
    localStorage.removeItem("flashcards_deck");
    localStorage.removeItem("flashcards_currentCard");
    localStorage.removeItem("flashcards_isFlipped");
    // Don't remove selected units or display date settings
    // as these are user preferences that should persist
    
    // Create a new deck with forceNewDeck=true to force regeneration
    if (shouldShuffle) {
      // If shuffling is requested, we'll create the ordered deck first
      shuffleDeck(true);
      
      // Then shuffle it
      setDeck(prevDeck => {
        const shuffledDeck = [...prevDeck].sort(() => Math.random() - 0.5);
        return shuffledDeck;
      });
    } else {
      // Just regenerate the deck in Korus' order
      shuffleDeck(true);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const getContentAreaName = (unitNumber) => {
    const contentAreas = {
      1: "Global Prehistory",
      2: "Ancient Mediterranean",
      3: "Early Europe and Colonial Americas",
      4: "Later Europe and Americas",
      5: "Indigenous Americas",
      6: "Africa",
      7: "West and Central Asia",
      8: "South, East, and Southeast Asia",
      9: "The Pacific",
      10: "Global Contemporary"
    };
    
    return contentAreas[unitNumber] || `Unit ${unitNumber}`;
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
      highestCard: highestCardNum,
      // Add more detailed information
      numDueByDate: cardsDueByDate.length
    };
  }, [displayCardsDueBy, getCardsDueByDate, getCardsInKorusOrder]);

  // Touch event handlers for swipe detection
  const handleTouchStart = (e) => {
    if (isTransitioning) return;
    
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    setSwipeDirection(null);
  };

  const handleTouchMove = (e) => {
    if (isTransitioning || !cardRef.current) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartRef.current.x;
    const deltaY = touchStartRef.current.y - currentY; // Inverted for upward swipe
    
    // Determine primary direction
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
    
    // Apply transform based on swipe direction
    if (isHorizontal) {
      // Left or right swipe
      cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
      if (deltaX > 50) {
        setSwipeDirection('right'); // Great
      } else if (deltaX < -50) {
        setSwipeDirection('left'); // Bad
      } else {
        setSwipeDirection(null);
      }
    } else {
      // Up swipe
      if (deltaY > 30) {
        cardRef.current.style.transform = `translateY(${-deltaY}px)`;
        setSwipeDirection('up'); // Good
      } else {
        cardRef.current.style.transform = 'translateY(0)';
        setSwipeDirection(null);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (isTransitioning || !cardRef.current) return;
    
    // Reset card position with transition
    cardRef.current.style.transition = 'transform 0.3s ease';
    
    // Calculate distance swiped
    touchEndRef.current = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
    
    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchStartRef.current.y - touchEndRef.current.y; // Inverted for upward swipe
    
    // Define minimum swipe distance threshold
    const minSwipeDistance = 100;
    
    // Check for horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Right swipe - Great
        setCardAnimation('swipe-right');
        setTimeout(() => handleAction('great'), 50);
      } else {
        // Left swipe - Bad
        setCardAnimation('swipe-left');
        setTimeout(() => handleAction('bad'), 50);
      }
    } 
    // Check for vertical swipe
    else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > minSwipeDistance) {
      // Up swipe - Good
      setCardAnimation('swipe-up');
      setTimeout(() => handleAction('good'), 50);
    } 
    // No significant swipe, reset card position
    else {
      cardRef.current.style.transform = 'translateX(0) translateY(0) rotate(0)';
      setSwipeDirection(null);
    }
    
    // Clear transition after animation completes
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = '';
      }
    }, 300);
  };

  // Memoize the keyboard handler function
  const handleKeyDown = useCallback((event) => {
    // Only process if not in transition and not typing in an input field
    if (isTransitioning || event.target.tagName === 'INPUT') return;
    
    // Handle number keys 1, 2, 3
    switch (event.key) {
      case '1':
        handleAction('bad');
        break;
      case '2':
        handleAction('good');
        break;
      case '3':
        handleAction('great');
        break;
      // Spacebar to flip card
      case ' ':
        handleFlip();
        break;
      default:
        break;
    }
  }, [isTransitioning, handleFlip, handleAction]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Update the reset button handlers to include confirmation
  const handleResetDeck = (shouldShuffle) => {
    if (window.confirm("Are you sure you want to reset the deck? Your progress will be cleared.")) {
      resetDeck(shouldShuffle);
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
        <div className="reset-button-container">
          <button className="reset-button" onClick={() => handleResetDeck(false)}>
            Reset Deck (Ordered)
          </button>
          <button className="reset-button shuffle-button" onClick={() => handleResetDeck(true)}>
            Reset Deck (Shuffled)
          </button>
        </div>
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
      <div className="progress">{deck.length > 0 ? deck.length : 0} cards remaining</div>
      <div className="order-info">
        Cards are {isShuffled ? 'randomly shuffled' : 'in learning sequence'}
      </div>
      <div className={`saving-indicator ${isSaving ? "show" : ""}`}>
        Progress saved
      </div>
      {showDuplicateMessage && (
        <div className="duplicate-message">
          Card added to review again
        </div>
      )}
      {swipeDirection && (
        <div className={`swipe-indicator ${swipeDirection}`}>
          {swipeDirection === 'left' ? 'Bad' : swipeDirection === 'up' ? 'Good' : 'Great'}
        </div>
      )}
      {showSwipeInstructions && (
        <div className="swipe-instructions">
          <p>Swipe left for Bad, up for Good, right for Great</p>
        </div>
      )}
      
      <div className="cards-container">
        {deck.length > 1 && <div className="card-deck-shadow"></div>}
        <div
          ref={cardRef}
          className={`flashcard ${isFlipped ? "flipped" : ""} ${cardAnimation} ${nextCardReady ? 'card-ready' : 'card-exit'}`}
          onClick={!isTransitioning ? handleFlip : null}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <span className="flip-hint">Press SPACE to flip</span>
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
                  <div className="flashcard-content">
                    <p>Location: {cardToShow.location}</p>
                    <p>
                      Artist/Culture:{" "}
                      {cardToShow.artist_culture || "Unknown"}
                    </p>
                    <p>Date: {toBCE(cardToShow.date)}</p>
                    <p>Materials: {cardToShow.materials}</p>
                    <p>Content Area: {getContentAreaName(cardToShow.unit)}</p>
                  </div>
                  <div className="details-link-container">
                    <Link
                      to={`/exhibit?id=${cardToShow.id}`}
                      className="full-page-button back-side"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details
                    </Link>
                  </div>
                </>
              )}
            </div>
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
          <span className="key-hint">1</span>
        </button>
        <button
          className="good-button"
          onClick={!isTransitioning ? () => handleAction("good") : null}
          disabled={isTransitioning}
        >
          Good
          <span className="key-hint">2</span>
        </button>
        <button
          className="great-button"
          onClick={!isTransitioning ? () => handleAction("great") : null}
          disabled={isTransitioning}
        >
          Great
          <span className="key-hint">3</span>
        </button>
      </div>
      
      {/* Add undo button */}
      <div className="undo-container">
        <button 
          className="undo-button" 
          onClick={handleUndo}
          disabled={isTransitioning || undoHistory.length === 0}
        >
          Undo ({undoHistory.length}/{MAX_UNDO_STEPS})
        </button>
      </div>
      
      <div className="reset-button-container">
        <button 
          className="reset-button" 
          onClick={!isTransitioning ? () => handleResetDeck(false) : null}
          disabled={isTransitioning}
        >
          Reset (Ordered)
        </button>
        <button 
          className="reset-button shuffle-button" 
          onClick={!isTransitioning ? () => handleResetDeck(true) : null}
          disabled={isTransitioning}
        >
          Reset (Shuffled)
        </button>
      </div>

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
          <h4>Content Areas to Include</h4>
          <p className="unit-hint">No selection means all content areas</p>
          {[...new Set(artPiecesData.map((item) => item.unit))].map((unit) => (
            <label key={unit}>
              <input
                type="checkbox"
                value={unit}
                onChange={handleUnitSelection}
                checked={selectedUnits.includes(unit)}
              />
              {getContentAreaName(unit)}
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
