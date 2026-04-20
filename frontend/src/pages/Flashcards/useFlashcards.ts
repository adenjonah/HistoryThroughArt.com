import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useArtworks, useDueDates } from "../../hooks/useSanityData";
import {
  buildDeck,
  createDueDatesMap,
  saveState,
  loadState,
  clearDeckStorage,
} from "./flashcardUtils";

const MAX_UNDO_STEPS = 3;

export const useFlashcards = () => {
  // Fetch data from Sanity
  const { artworks: artworksData, loading: artworksLoading } = useArtworks();
  const { dueDates: dueDatesData, loading: dueDatesLoading } = useDueDates();

  const dataLoading = artworksLoading || dueDatesLoading;

  // Create due dates map from Sanity data
  const dueDatesMap = useMemo(() => {
    if (dataLoading || !dueDatesData.assignments) {
      return new Map();
    }
    return createDueDatesMap(dueDatesData);
  }, [dueDatesData, dataLoading]);

  // Core state
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  // Settings
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [dueDate, setDueDate] = useState(new Date());
  const [deckMode, setDeckMode] = useState("korus"); // "korus" or "all"

  // UI state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Undo history
  const [undoHistory, setUndoHistory] = useState([]);

  // Initialization flag
  const isInitialized = useRef(false);
  const dataLoadedRef = useRef(false);

  // Initialize from localStorage on mount when data is ready
  useEffect(() => {
    // Wait for data to load
    if (dataLoading || artworksData.length === 0) return;

    // Only initialize once when data becomes available
    if (dataLoadedRef.current) return;
    dataLoadedRef.current = true;

    const savedState = loadState();
    if (savedState && savedState.deck.length > 0) {
      setDeck(savedState.deck);
      setCurrentCard(savedState.currentCard);
      setSelectedUnits(savedState.selectedUnits);
      setDueDate(savedState.dueDate);
      setIsShuffled(savedState.isShuffled);
      setDeckMode(savedState.deckMode || "korus");
    } else {
      // Create fresh deck
      const newDeck = buildDeck(artworksData, {
        dueDatesMap,
        dueByDate: new Date(),
        selectedUnits: [],
        shouldShuffle: false,
        useAllCards: false,
      });
      setDeck(newDeck);
    }
    isInitialized.current = true;
  }, [dataLoading, artworksData, dueDatesMap]);

  // Save state when it changes
  useEffect(() => {
    if (isInitialized.current && deck.length > 0) {
      saveState({
        deck,
        currentCard,
        selectedUnits,
        dueDate,
        isShuffled,
        deckMode,
      });
    }
  }, [deck, currentCard, selectedUnits, dueDate, isShuffled, deckMode]);

  // Get current card data
  const currentCardData = deck[currentCard] || null;

  // Save current state to undo history
  const saveToHistory = useCallback(() => {
    setUndoHistory((prev) => {
      const snapshot = {
        deck: [...deck],
        currentCard,
        isFlipped,
      };
      return [snapshot, ...prev].slice(0, MAX_UNDO_STEPS);
    });
  }, [deck, currentCard, isFlipped]);

  // Flip card
  const flipCard = useCallback(() => {
    if (!isTransitioning) {
      setIsFlipped((prev) => !prev);
    }
  }, [isTransitioning]);

  // Process card action
  const handleAction = useCallback(
    (action) => {
      if (isTransitioning || deck.length === 0) return;

      saveToHistory();
      setIsTransitioning(true);

      // Process after brief delay for animation
      setTimeout(() => {
        let newDeck = [...deck];
        let newIndex = currentCard;

        switch (action) {
          case "great":
            // Remove card from deck
            newDeck = newDeck.filter((_, i) => i !== currentCard);
            if (newDeck.length > 0 && currentCard >= newDeck.length) {
              newIndex = 0;
            }
            break;

          case "bad":
            // Duplicate card and add to end
            const cardCopy = JSON.parse(JSON.stringify(deck[currentCard]));
            newDeck.push(cardCopy);
            newIndex = (currentCard + 1) % newDeck.length;
            break;

          case "good":
          default:
            // Move to next card
            newIndex = (currentCard + 1) % newDeck.length;
            break;
        }

        setDeck(newDeck);
        setCurrentCard(newIndex);
        setIsFlipped(false);

        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 250);

      return action;
    },
    [isTransitioning, deck, currentCard, saveToHistory]
  );

  // Undo last action
  const undo = useCallback(() => {
    if (undoHistory.length === 0 || isTransitioning) return;

    const [previous, ...rest] = undoHistory;
    setDeck(previous.deck);
    setCurrentCard(previous.currentCard);
    setIsFlipped(previous.isFlipped);
    setUndoHistory(rest);
  }, [undoHistory, isTransitioning]);

  // Reset deck
  const resetDeck = useCallback(
    (shuffle = false) => {
      if (dataLoading || artworksData.length === 0) return;

      clearDeckStorage();
      setIsShuffled(shuffle);
      setUndoHistory([]);

      const newDeck = buildDeck(artworksData, {
        dueDatesMap,
        dueByDate: dueDate,
        selectedUnits,
        shouldShuffle: shuffle,
        useAllCards: deckMode === "all",
      });

      setDeck(newDeck);
      setCurrentCard(0);
      setIsFlipped(false);
    },
    [dueDate, selectedUnits, deckMode, dataLoading, artworksData, dueDatesMap]
  );

  // Update settings - rebuild deck when settings change
  const updateSettings = useCallback(
    (newUnits, newDate, newMode) => {
      if (dataLoading || artworksData.length === 0) return;

      setSelectedUnits(newUnits);
      setDueDate(newDate);
      if (newMode !== undefined) {
        setDeckMode(newMode);
      }

      // Rebuild deck with new settings
      clearDeckStorage();
      const newDeck = buildDeck(artworksData, {
        dueDatesMap,
        dueByDate: newDate,
        selectedUnits: newUnits,
        shouldShuffle: isShuffled,
        useAllCards: (newMode !== undefined ? newMode : deckMode) === "all",
      });

      setDeck(newDeck);
      setCurrentCard(0);
      setIsFlipped(false);
      setUndoHistory([]);
    },
    [isShuffled, deckMode, dataLoading, artworksData, dueDatesMap]
  );

  // Toggle unit selection
  const toggleUnit = useCallback(
    (unit) => {
      // Ensure unit is a number for consistent comparison
      const unitNum = typeof unit === 'string' ? parseInt(unit, 10) : unit;
      const newUnits = selectedUnits.includes(unitNum)
        ? selectedUnits.filter((u) => u !== unitNum)
        : [...selectedUnits, unitNum];
      updateSettings(newUnits, dueDate, undefined);
    },
    [selectedUnits, dueDate, updateSettings]
  );

  // Update due date
  const updateDueDate = useCallback(
    (newDate) => {
      updateSettings(selectedUnits, newDate, undefined);
    },
    [selectedUnits, updateSettings]
  );

  // Toggle deck mode (korus order vs all cards)
  const toggleDeckMode = useCallback(
    (newMode) => {
      updateSettings(selectedUnits, dueDate, newMode);
    },
    [selectedUnits, dueDate, updateSettings]
  );

  // Get card count info for current filters
  const getCardCountInfo = useCallback(() => {
    if (dataLoading || artworksData.length === 0) {
      return {
        totalCards: 0,
        filteredCards: 0,
        highestCard: 0,
        hasUnitFilter: false,
      };
    }

    const useAll = deckMode === "all";

    // Get total cards available (all units, current mode)
    const allCardsDeck = buildDeck(artworksData, {
      dueDatesMap,
      dueByDate: dueDate,
      selectedUnits: [],
      shouldShuffle: false,
      useAllCards: useAll,
    });

    // Get cards with current unit filter
    const filteredDeck = buildDeck(artworksData, {
      dueDatesMap,
      dueByDate: dueDate,
      selectedUnits,
      shouldShuffle: false,
      useAllCards: useAll,
    });

    return {
      totalCards: allCardsDeck.length,
      filteredCards: filteredDeck.length,
      highestCard: allCardsDeck.length > 0 ? allCardsDeck[allCardsDeck.length - 1]?.id : 0,
      hasUnitFilter: selectedUnits.length > 0,
    };
  }, [dueDate, selectedUnits, deckMode, dataLoading, artworksData, dueDatesMap]);

  return {
    // State
    deck,
    currentCard,
    currentCardData,
    isFlipped,
    isShuffled,
    isTransitioning,
    showSettings,
    selectedUnits,
    dueDate,
    deckMode,
    undoHistory,
    canUndo: undoHistory.length > 0,
    maxUndoSteps: MAX_UNDO_STEPS,
    dataLoading,
    artworksData,

    // Actions
    flipCard,
    handleAction,
    undo,
    resetDeck,
    toggleUnit,
    updateDueDate,
    toggleDeckMode,
    setShowSettings,
    getCardCountInfo,
  };
};
