import React, { useState, useEffect, useCallback } from "react";
import "./Flashcards.css";
import { useFlashcards } from "./useFlashcards";
import FlashcardCard from "./FlashcardCard";
import FlashcardControls from "./FlashcardControls";
import FlashcardSettings from "./FlashcardSettings";
import { hasSeenSwipeInstructions, markSwipeInstructionsSeen } from "./flashcardUtils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    deckMode,
    undoHistory,
    canUndo,
    maxUndoSteps,
    dataLoading,
    artworksData,
    flipCard,
    handleAction,
    undo,
    resetDeck,
    toggleUnit,
    updateDueDate,
    toggleDeckMode,
    setShowSettings,
    getCardCountInfo,
  } = useFlashcards();

  const [cardAnimation, setCardAnimation] = useState("");
  const [cardReady, setCardReady] = useState(true);
  const [showDuplicateMessage, setShowDuplicateMessage] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [showSwipeInstructions, setShowSwipeInstructions] = useState(
    !hasSeenSwipeInstructions()
  );
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [pendingResetShuffle, setPendingResetShuffle] = useState(false);

  useEffect(() => {
    if (showSwipeInstructions) {
      const timer = setTimeout(() => {
        setShowSwipeInstructions(false);
        markSwipeInstructionsSeen();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeInstructions]);

  useEffect(() => {
    if (deck.length > 0) {
      setShowSaveIndicator(true);
      const timer = setTimeout(() => setShowSaveIndicator(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [deck.length]);

  const onAction = useCallback(
    (action) => {
      if (isTransitioning) return;

      const animationMap = { bad: "swipe-left", good: "swipe-up", great: "swipe-right" };
      setCardAnimation(animationMap[action]);
      setCardReady(false);

      if (action === "bad") {
        setShowDuplicateMessage(true);
        setTimeout(() => setShowDuplicateMessage(false), 2000);
      }

      if (showSwipeInstructions) {
        setShowSwipeInstructions(false);
        markSwipeInstructionsSeen();
      }

      handleAction(action);

      setTimeout(() => {
        setCardAnimation("");
        setCardReady(true);
      }, 300);
    },
    [isTransitioning, handleAction, showSwipeInstructions]
  );

  const onReset = useCallback((shuffle) => {
    setPendingResetShuffle(shuffle);
    setResetDialogOpen(true);
  }, []);

  const confirmReset = useCallback(() => {
    resetDeck(pendingResetShuffle);
    setResetDialogOpen(false);
  }, [resetDeck, pendingResetShuffle]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTransitioning || e.target.tagName === "INPUT") return;
      switch (e.key) {
        case "1": onAction("bad"); break;
        case "2": onAction("good"); break;
        case "3": onAction("great"); break;
        case " ": e.preventDefault(); flipCard(); break;
        default: break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTransitioning, onAction, flipCard]);

  const cardInfo = getCardCountInfo();

  if (dataLoading) {
    return (
      <div className="flashcards-container">
        <h1 className="title">Flashcards</h1>
        <div className="end-of-deck-message">
          <h2 className="animate-pulse">Loading flashcards...</h2>
        </div>
      </div>
    );
  }

  if (deck.length === 0) {
    const isFilteredEmpty = cardInfo.hasUnitFilter && cardInfo.filteredCards === 0 && cardInfo.totalCards > 0;

    return (
      <div className="flashcards-container">
        <h1 className="title">Flashcards</h1>
        <div className="end-of-deck-message">
          {isFilteredEmpty ? (
            <>
              <h2>No cards match your filters</h2>
              <p>Try selecting different content areas or adjusting the due date in settings.</p>
            </>
          ) : (
            <>
              <h2>All cards completed!</h2>
              <p>Reset the deck to continue studying.</p>
            </>
          )}
        </div>
        <div className="reset-button-container">
          <Button variant="outline" className="reset-button" onClick={() => setShowSettings(true)}>
            Open Settings
          </Button>
          <Button variant="outline" className="reset-button" onClick={() => resetDeck(false)}>
            Reset Deck (Ordered)
          </Button>
          <Button variant="outline" className="reset-button shuffle-button" onClick={() => resetDeck(true)}>
            Reset Deck (Shuffled)
          </Button>
        </div>

        <FlashcardSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          selectedUnits={selectedUnits}
          onToggleUnit={toggleUnit}
          dueDate={dueDate}
          onDateChange={updateDueDate}
          deckMode={deckMode}
          onDeckModeChange={toggleDeckMode}
          cardCountInfo={cardInfo}
          isTransitioning={false}
          artworksData={artworksData}
        />
      </div>
    );
  }

  if (!currentCardData) {
    return (
      <div className="flashcards-container">
        <h1 className="title">Flashcards</h1>
        <div className="end-of-deck-message">
          <h2>Error loading cards</h2>
          <p>Please reset the deck.</p>
        </div>
        <Button variant="outline" className="reset-button" onClick={() => resetDeck(false)}>
          Reset Deck
        </Button>
      </div>
    );
  }

  return (
    <div className="flashcards-container">
      <h1 className="title">Flashcards</h1>

      <div className="status-line">
        <span>{deck.length} remaining</span>
        <span className="separator">•</span>
        <span>{isShuffled ? "shuffled" : "ordered"}</span>
      </div>

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

      <FlashcardCard
        card={currentCardData}
        isFlipped={isFlipped}
        isTransitioning={isTransitioning}
        onFlip={flipCard}
        onAction={onAction}
        animation={cardAnimation}
        isReady={cardReady}
      />

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

      <FlashcardSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        selectedUnits={selectedUnits}
        onToggleUnit={toggleUnit}
        dueDate={dueDate}
        onDateChange={updateDueDate}
        deckMode={deckMode}
        onDeckModeChange={toggleDeckMode}
        cardCountInfo={getCardCountInfo()}
        isTransitioning={isTransitioning}
        artworksData={artworksData}
      />

      {/* Reset confirmation dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent className="bg-[var(--background-color)] border-[var(--accent-color)] text-[var(--text-color)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--text-color)]">Reset the deck?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--text-color)] opacity-70">
              Your progress will be cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[var(--accent-color)] text-[var(--text-color)] hover:bg-[var(--accent-color)]/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset}>
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Flashcards;
