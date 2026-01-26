import React from "react";
import artworksData from "../../data/artworks.json";
import { getContentAreaName } from "../../data/contentAreas";
import { formatDateForInput } from "./flashcardUtils";

// Get unique units from artwork data
const availableUnits = [...new Set(artworksData.map((item) => item.unit))].sort(
  (a, b) => a - b
);

const FlashcardSettings = ({
  isOpen,
  onClose,
  selectedUnits,
  onToggleUnit,
  dueDate,
  onDateChange,
  cardCountInfo,
  isTransitioning,
}) => {
  const handleDateChange = (e) => {
    const inputDate = e.target.value;
    const selectedDate = new Date(inputDate + "T00:00:00");
    onDateChange(selectedDate);
  };

  return (
    <div className={`settings-modal ${isOpen ? "show" : ""}`}>
      <h3>Settings</h3>

      {/* Due Date Setting */}
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
