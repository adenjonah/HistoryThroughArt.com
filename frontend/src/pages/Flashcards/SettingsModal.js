import React from "react";
import artPiecesData from "../../data/artworks.json";

const SettingsModal = ({
  selectedUnits,
  setSelectedUnits,
  setExcludedCardIds,
  toggleSettings,
}) => {
  const handleExcludedIdsChange = (event) => {
    const ids = event.target.value.split(",").map(Number);
    setExcludedCardIds(ids);
  };

  const handleUnitSelection = (event) => {
    const unit = Number(event.target.value);
    if (event.target.checked) {
      setSelectedUnits((prev) => [...prev, unit]);
    } else {
      setSelectedUnits((prev) => prev.filter((u) => u !== unit));
    }
  };

  const uniqueUnits = artPiecesData
    ? [...new Set(artPiecesData.map((item) => item.unit))]
    : [];

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">Settings</h3>
        <div className="mb-4">
          <h4 className="text-lg font-semibold">Select Units to Include</h4>
          {uniqueUnits.map((unit) => (
            <label
              key={unit}
              className="block mt-2 cursor-pointer hover:text-blue-500 transition-colors"
            >
              <input
                type="checkbox"
                value={unit}
                onChange={handleUnitSelection}
                checked={selectedUnits.includes(unit)}
                className="mr-2"
              />
              Unit {unit}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold">Exclude Specific Card IDs</h4>
          <input
            type="text"
            placeholder="Comma-separated IDs"
            onChange={handleExcludedIdsChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={toggleSettings}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
