import React, { useState, useEffect, useCallback } from "react";
import "./Flashcards.css";
import { useFlashcards } from "./useFlashcards";
import FlashcardCard from "./FlashcardCard";
import FlashcardControls from "./FlashcardControls";
import FlashcardSettings from "./FlashcardSettings";
import { hasSeenSwipeInstructions, markSwipeInstructionsSeen } from "./flashcardUtils";

const Flashcards = () => {
  const {
    deck,
    currentCardData,
    isFlipped,
    isShuffled,
    isTransitioning,
    showSettings,
    selectedUnits,
    dueDate,
    undoHistory,
    canUndo,
    maxUndoSteps,
    flipCard,
    handleAction,
    undo,
    resetDeck,
    toggleUnit,
    updateDueDate,
    setShowSettings,
    getCardCountInfo,
  } = useFlashcards();

  // UI state
  const [cardAnimation, setCardAnimation] = useState("");
  const [cardReady, setCardReady] = useState(true);
  const [showDuplicateMessage, setShowDuplicateMessage] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [showSwipeInstructions, setShowSwipeInstructions] = useState(
    !hasSeenSwipeInstructions()
  );

  // Auto-hide swipe instructions
  useEffect(() => {
    if (showSwipeInstructions) {
      const timer = setTimeout(() => {
        setShowSwipeInstructions(false);
        markSwipeInstructionsSeen();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeInstructions]);

  // Show save indicator when deck changes
  useEffect(() => {
    if (deck.length > 0) {
      setShowSaveIndicator(true);
      const timer = setTimeout(() => setShowSaveIndicator(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [deck.length]);

  // Handle action with animations
  const onAction = useCallback(
    (action) => {
      if (isTransitioning) return;

      // Set animation
      const animationMap = {
        bad: "swipe-left",
        good: "swipe-up",
        great: "swipe-right",
      };
      setCardAnimation(animationMap[action]);
      setCardReady(false);

      // Show duplicate message for "bad"
      if (action === "bad") {
        setShowDuplicateMessage(true);
        setTimeout(() => setShowDuplicateMessage(false), 2000);
      }

      // Hide swipe instructions on first action
      if (showSwipeInstructions) {
        setShowSwipeInstructions(false);
        markSwipeInstructionsSeen();
      }

      // Process the action
      handleAction(action);

      // Reset animation state
      setTimeout(() => {
        setCardAnimation("");
        setCardReady(true);
      }, 300);
    },
    [isTransitioning, handleAction, showSwipeInstructions]
  );

  // Handle reset with confirmation
  const onReset = useCallback(
    (shuffle) => {
      if (window.confirm("Reset the deck? Your progress will be cleared.")) {
        resetDeck(shuffle);
      }
    },
    [resetDeck]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTransitioning || e.target.tagName === "INPUT") return;

      switch (e.key) {
        case "1":
          onAction("bad");
          break;
        case "2":
          onAction("good");
          break;
        case "3":
          onAction("great");
          break;
        case " ":
          e.preventDefault();
          flipCard();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTransitioning, onAction, flipCard]);

  // Empty deck state
  if (deck.length === 0) {
    return (
      <div className="flashcards-container">
        <h1 className="title">Flashcards</h1>
        <div className="end-of-deck-message">
          <h2>All cards completed!</h2>
          <p>Reset the deck to continue studying.</p>
        </div>
        <div className="reset-button-container">
          <button className="reset-button" onClick={() => resetDeck(false)}>
            Reset Deck (Ordered)
          </button>
          <button
            className="reset-button shuffle-button"
            onClick={() => resetDeck(true)}
          >
            Reset Deck (Shuffled)
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (!currentCardData) {
    return (
      <div className="flashcards-container">
        <h1 className="title">Flashcards</h1>
        <div className="end-of-deck-message">
          <h2>Error loading cards</h2>
          <p>Please reset the deck.</p>
        </div>
        <button className="reset-button" onClick={() => resetDeck(false)}>
          Reset Deck
        </button>
      </div>
    );
  }

  return (
    <div className="flashcards-container">
      <h1 className="title">Flashcards</h1>

      {/* Progress */}
      <div className="progress">{deck.length} cards remaining</div>
      <div className="order-info">
        Cards are {isShuffled ? "randomly shuffled" : "in learning sequence"}
      </div>

      {/* Notifications */}
      <div className={`saving-indicator ${showSaveIndicator ? "show" : ""}`}>
        Progress saved
      </div>
      {showDuplicateMessage && (
        <div className="duplicate-message">Card added to review again</div>
      )}
      {showSwipeInstructions && (
        <div className="swipe-instructions">
          <p>Swipe left for Bad, up for Good, right for Great</p>
        </div>
      )}

      {/* Card */}
      <FlashcardCard
        card={currentCardData}
        isFlipped={isFlipped}
        isTransitioning={isTransitioning}
        onFlip={flipCard}
        onAction={onAction}
        animation={cardAnimation}
        isReady={cardReady}
      />

      {/* Controls */}
      <FlashcardControls
        onAction={onAction}
        onUndo={undo}
        onReset={onReset}
        onToggleSettings={() => setShowSettings(!showSettings)}
        isTransitioning={isTransitioning}
        canUndo={canUndo}
        undoCount={undoHistory.length}
        maxUndo={maxUndoSteps}
        isShuffled={isShuffled}
      />

      {/* Settings Panel */}
      <FlashcardSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        selectedUnits={selectedUnits}
        onToggleUnit={toggleUnit}
        dueDate={dueDate}
        onDateChange={updateDueDate}
        cardCountInfo={getCardCountInfo()}
        isTransitioning={isTransitioning}
      />
    </div>
  );
};

export default Flashcards;
