import React, { useMemo } from "react";
import { getContentAreaName } from "../../data/contentAreas";
import { formatDateForInput } from "./flashcardUtils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
        className="w-[320px] sm:w-[380px] overflow-y-auto"
        style={{
          background: "var(--background-color)",
          borderLeft: "1px solid var(--border-gold)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
          color: "var(--text-default)",
        }}
      >
        <SheetHeader className="mb-6">
          <SheetTitle
            style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 400, color: "var(--text-strong)" }}
          >
            Settings
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Deck Mode Toggle — segmented control */}
          <div>
            <h4
              className="text-sm font-semibold mb-2"
              style={{ color: "var(--gold-soft)" }}
            >
              Card Selection
            </h4>
            <div
              className="flex rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--border-gold)" }}
            >
              <button
                className="flex-1 py-[11px] text-center text-sm font-semibold transition-colors"
                style={
                  deckMode === "korus"
                    ? { background: "var(--gold-color)", color: "var(--ink-on-gold)" }
                    : { background: "transparent", color: "var(--text-default)" }
                }
                onClick={() => onDeckModeChange("korus")}
              >
                Up to Date
              </button>
              <button
                className="flex-1 py-[11px] text-center text-sm font-semibold transition-colors"
                style={
                  deckMode === "all"
                    ? { background: "var(--gold-color)", color: "var(--ink-on-gold)" }
                    : { background: "transparent", color: "var(--text-default)" }
                }
                onClick={() => onDeckModeChange("all")}
              >
                All Cards
              </button>
            </div>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {deckMode === "korus"
                ? "Shows cards due by selected date in Korus' teaching order"
                : "Shows all 250 cards regardless of due date"}
            </p>
          </div>

          {/* Due Date */}
          {deckMode === "korus" && (
            <div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--gold-soft)" }}>
                Show Cards Due By
              </h4>
              <div
                className="flex items-center rounded-md px-3.5 py-[11px]"
                style={{
                  background: "rgba(85,40,111,0.2)",
                  border: "1px solid var(--border-gold)",
                }}
              >
                <Input
                  type="date"
                  value={formatDateForInput(dueDate)}
                  onChange={handleDateChange}
                  className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-sm w-full"
                  style={{ color: "var(--text-strong)", fontFamily: "var(--font-body)" }}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                {cardCountInfo.hasUnitFilter
                  ? `${cardCountInfo.filteredCards} of ${cardCountInfo.totalCards} cards (filtered by unit)`
                  : `${cardCountInfo.totalCards} cards (up to #${cardCountInfo.highestCard} in Korus' order)`}
              </p>
            </div>
          )}

          {deckMode === "all" && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {cardCountInfo.hasUnitFilter
                ? `${cardCountInfo.filteredCards} of ${cardCountInfo.totalCards} cards (filtered by unit)`
                : `${cardCountInfo.totalCards} cards total`}
            </p>
          )}

          {/* Unit Selection */}
          <div>
            <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--gold-soft)" }}>
              Filter by Unit / Content Area
            </h4>
            <p className="text-xs mb-3.5" style={{ color: "var(--text-muted)" }}>
              No selection means all units
            </p>
            <div className="flex flex-col gap-[11px]">
              {availableUnits.map((unit) => {
                const isChecked = selectedUnits.includes(unit);
                return (
                  <label
                    key={unit}
                    className="flex items-center gap-2.5 cursor-pointer text-sm"
                    style={{ color: "var(--text-default)" }}
                  >
                    <input
                      type="checkbox"
                      value={unit}
                      onChange={() => onToggleUnit(unit)}
                      checked={isChecked}
                      className="sr-only"
                    />
                    {/* Custom Nocturne checkbox — gold fill + ink check when checked */}
                    <span
                      className="w-[17px] h-[17px] rounded flex-shrink-0 flex items-center justify-center transition-colors"
                      style={{
                        border: isChecked
                          ? "2px solid var(--gold-color)"
                          : "2px solid var(--border-gold)",
                        background: isChecked ? "var(--gold-color)" : "transparent",
                        color: "var(--ink-on-gold)",
                      }}
                      aria-hidden="true"
                    >
                      {isChecked && <Check className="w-2.5 h-2.5" />}
                    </span>
                    <span>
                      <span className="font-semibold" style={{ color: "var(--text-strong)" }}>
                        Unit {unit}:
                      </span>{" "}
                      {getContentAreaName(unit)}
                    </span>
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
