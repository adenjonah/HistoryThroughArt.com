import React from "react";

const FlashcardControls = ({
  onAction,
  onUndo,
  onReset,
  onToggleSettings,
  isTransitioning,
  canUndo,
  undoCount,
  maxUndo,
  isShuffled,
}) => {
  return (
    <>
      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="bad-button"
          onClick={() => onAction("bad")}
          disabled={isTransitioning}
        >
          Bad
          <span className="key-hint">1</span>
        </button>
        <button
          className="good-button"
          onClick={() => onAction("good")}
          disabled={isTransitioning}
        >
          Good
          <span className="key-hint">2</span>
        </button>
        <button
          className="great-button"
          onClick={() => onAction("great")}
          disabled={isTransitioning}
        >
          Great
          <span className="key-hint">3</span>
        </button>
      </div>

      {/* Undo Button */}
      <div className="undo-container">
        <button
          className="undo-button"
          onClick={onUndo}
          disabled={isTransitioning || !canUndo}
        >
          Undo ({undoCount}/{maxUndo})
        </button>
      </div>

      {/* Reset Buttons */}
      <div className="reset-button-container">
        <button
          className="reset-button"
          onClick={() => onReset(false)}
          disabled={isTransitioning}
        >
          Reset (Ordered)
        </button>
        <button
          className="reset-button shuffle-button"
          onClick={() => onReset(true)}
          disabled={isTransitioning}
        >
          Reset (Shuffled)
        </button>
      </div>

      {/* Settings Button */}
      <button
        className="settings-button"
        onClick={onToggleSettings}
        disabled={isTransitioning}
      >
        <i className="fas fa-cog"></i>
      </button>
    </>
  );
};

export default FlashcardControls;
