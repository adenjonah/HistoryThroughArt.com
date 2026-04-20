import React from "react";
import { Button } from "@/components/ui/button";
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
      {/* Action Buttons */}
      <div className="action-buttons">
        <Button
          variant="destructive"
          className="bad-button"
          onClick={() => onAction("bad")}
          disabled={isTransitioning}
        >
          Bad
          <span className="key-hint">1</span>
        </Button>
        <Button
          variant="secondary"
          className="good-button"
          onClick={() => onAction("good")}
          disabled={isTransitioning}
        >
          Good
          <span className="key-hint">2</span>
        </Button>
        <Button
          className="great-button"
          onClick={() => onAction("great")}
          disabled={isTransitioning}
        >
          Great
          <span className="key-hint">3</span>
        </Button>
      </div>

      {/* Undo Button */}
      <div className="undo-container">
        <Button
          variant="outline"
          className="undo-button"
          onClick={onUndo}
          disabled={isTransitioning || !canUndo}
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Undo ({undoCount}/{maxUndo})
        </Button>
      </div>

      {/* Reset Buttons */}
      <div className="reset-button-container">
        <Button
          variant="outline"
          className="reset-button"
          onClick={() => onReset(false)}
          disabled={isTransitioning}
        >
          Reset (Ordered)
        </Button>
        <Button
          variant="outline"
          className="reset-button shuffle-button"
          onClick={() => onReset(true)}
          disabled={isTransitioning}
        >
          Reset (Shuffled)
        </Button>
      </div>

      {/* Settings Button */}
      <Button
        variant="ghost"
        size="icon"
        className="settings-button"
        onClick={onToggleSettings}
        disabled={isTransitioning}
        aria-label="Open settings"
      >
        <Settings className="w-5 h-5" />
      </Button>
    </>
  );
};

export default FlashcardControls;
