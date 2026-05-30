import React from "react";
import { Settings, RotateCcw } from "lucide-react";

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
      {/* Rating Buttons — Bad / Good / Great with Nocturne semantic colors */}
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

      {/* Secondary controls — ghost style */}
      <div className="flex gap-3 justify-center flex-wrap mb-5">
        <button
          className="undo-button flex items-center gap-1"
          onClick={onUndo}
          disabled={isTransitioning || !canUndo}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Undo ({undoCount}/{maxUndo})
        </button>

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

      {/* Settings gear — fixed circular button */}
      <button
        className="settings-button"
        onClick={onToggleSettings}
        disabled={isTransitioning}
        aria-label="Open settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    </>
  );
};

export default FlashcardControls;
