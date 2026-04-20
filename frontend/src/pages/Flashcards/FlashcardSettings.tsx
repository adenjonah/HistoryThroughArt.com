import React, { useMemo } from "react";
import { getContentAreaName } from "../../data/contentAreas";
import { formatDateForInput } from "./flashcardUtils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

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
  artworksData = [],
}) => {
  const availableUnits = useMemo(
    () => [...new Set(artworksData.map((item) => item.unit))].sort((a, b) => a - b),
    [artworksData]
  );

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value + "T00:00:00");
    onDateChange(selectedDate);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-[320px] sm:w-[380px] bg-[var(--background-color)] border-[var(--accent-color)] text-[var(--text-color)] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-[var(--text-color)]">Settings</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Deck Mode Toggle */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-[var(--foreground-color)]">Card Selection</h4>
            <div className="flex rounded-lg overflow-hidden border border-[var(--accent-color)]">
              <Button
                variant={deckMode === "korus" ? "default" : "ghost"}
                className="flex-1 rounded-none"
                onClick={() => onDeckModeChange("korus")}
              >
                Up to Date
              </Button>
              <Button
                variant={deckMode === "all" ? "default" : "ghost"}
                className="flex-1 rounded-none"
                onClick={() => onDeckModeChange("all")}
              >
                All Cards
              </Button>
            </div>
            <p className="text-xs text-[var(--text-color)] opacity-70 mt-1">
              {deckMode === "korus"
                ? "Shows cards due by selected date in Korus' teaching order"
                : "Shows all 250 cards regardless of due date"}
            </p>
          </div>

          {/* Due Date */}
          {deckMode === "korus" && (
            <div>
              <h4 className="text-sm font-semibold mb-2 text-[var(--foreground-color)]">Show Cards Due By</h4>
              <Input
                type="date"
                value={formatDateForInput(dueDate)}
                onChange={handleDateChange}
                className="bg-[var(--accent-color)]/20 border-[var(--accent-color)] text-[var(--text-color)]"
              />
              <p className="text-xs text-[var(--text-color)] opacity-70 mt-1">
                {cardCountInfo.hasUnitFilter
                  ? `${cardCountInfo.filteredCards} of ${cardCountInfo.totalCards} cards (filtered by unit)`
                  : `${cardCountInfo.totalCards} cards (up to #${cardCountInfo.highestCard} in Korus' order)`}
              </p>
            </div>
          )}

          {deckMode === "all" && (
            <p className="text-xs text-[var(--text-color)] opacity-70">
              {cardCountInfo.hasUnitFilter
                ? `${cardCountInfo.filteredCards} of ${cardCountInfo.totalCards} cards (filtered by unit)`
                : `${cardCountInfo.totalCards} cards total`}
            </p>
          )}

          {/* Unit Selection */}
          <div>
            <h4 className="text-sm font-semibold mb-1 text-[var(--foreground-color)]">Filter by Unit / Content Area</h4>
            <p className="text-xs text-[var(--text-color)] opacity-70 mb-3">No selection means all units</p>
            <div className="space-y-2">
              {availableUnits.map((unit) => {
                const isChecked = selectedUnits.includes(unit);
                return (
                  <label
                    key={unit}
                    className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-color)] hover:text-[var(--foreground-color)] transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={unit}
                      onChange={() => onToggleUnit(unit)}
                      checked={isChecked}
                      className="sr-only"
                    />
                    <span
                      className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-[var(--button-color)] border-[var(--button-color)]"
                          : "border-[var(--accent-color)] bg-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                    <span className="font-medium">Unit {unit}:</span> {getContentAreaName(unit)}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FlashcardSettings;
