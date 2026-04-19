import React, { useMemo } from "react";
import { getContentAreaName } from "../../data/contentAreas";
import { formatDateForInput } from "./flashcardUtils";

const FlashcardSettings = ({
  isOpen,
  onClose,
  selectedUnits,
  onToggleUnit,
  dueDate,
  onDateChange,
  deckMode,
  onDeckModeChange,
  cardCountInfo,
  isTransitioning,
  artworksData = [], // Now passed from parent hook
}) => {
  // Get unique units from artwork data (dynamically)
  const availableUnits = useMemo(
    () => [...new Set(artworksData.map((item) => item.unit))].sort((a, b) => a - b),
    [artworksData]
  );
  const handleDateChange = (e) => {
    const inputDate = e.target.value;
    const selectedDate = new Date(inputDate + "T00:00:00");
    onDateChange(selectedDate);
  };

  return (
    <div className={`settings-modal ${isOpen ? "show" : ""}`}>
      <h3>Settings</h3>

      {/* Deck Mode Toggle */}
      <div className="deck-mode-setting">
        <h4>Card Selection</h4>
        <div className="deck-mode-toggle">
          <button
            className={`mode-button ${deckMode === "korus" ? "active" : ""}`}
            onClick={() => onDeckModeChange("korus")}
          >
            Up to Date
          </button>
          <button
            className={`mode-button ${deckMode === "all" ? "active" : ""}`}
            onClick={() => onDeckModeChange("all")}
          >
            All Cards
          </button>
        </div>
        <p className="mode-hint">
          {deckMode === "korus"
            ? "Shows cards due by selected date in Korus' teaching order"
            : "Shows all 250 cards regardless of due date"}
        </p>
      </div>

      {/* Due Date Setting - only show for korus mode */}
      {deckMode === "korus" && (
        <div className="due-date-setting">
          <h4>Show Cards Due By</h4>
          <div className="date-selector">
            <input
              type="date"
              value={formatDateForInput(dueDate)}
              onChange={handleDateChange}
              className="date-input"
            />
            <p className="card-count-info">
              {cardCountInfo.hasUnitFilter ? (
                <>
                  {cardCountInfo.filteredCards} of {cardCountInfo.totalCards} cards
                  (filtered by unit)
                </>
              ) : (
                <>
                  {cardCountInfo.totalCards} cards (up to #
                  {cardCountInfo.highestCard} in Korus' order)
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Card count for all mode */}
      {deckMode === "all" && (
        <div className="due-date-setting">
          <p className="card-count-info">
            {cardCountInfo.hasUnitFilter ? (
              <>
                {cardCountInfo.filteredCards} of {cardCountInfo.totalCards} cards
                (filtered by unit)
              </>
            ) : (
              <>{cardCountInfo.totalCards} cards total</>
            )}
          </p>
        </div>
      )}

      {/* Unit Selection */}
      <div className="unit-selection">
        <h4>Filter by Unit / Content Area</h4>
        <p className="unit-hint">No selection means all units</p>
        {availableUnits.map((unit) => (
          <label key={unit}>
            <input
              type="checkbox"
              value={unit}
              onChange={() => onToggleUnit(unit)}
              checked={selectedUnits.includes(unit)}
            />
            <span className="unit-number">Unit {unit}:</span> {getContentAreaName(unit)}
          </label>
        ))}
      </div>

      <button
        className="close-settings"
        onClick={onClose}
        disabled={isTransitioning}
      >
        Close
      </button>
    </div>
  );
};

export default FlashcardSettings;
