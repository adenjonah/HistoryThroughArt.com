import React from "react";

const FONT_SIZES = [
  { key: "small", label: "S" },
  { key: "medium", label: "M" },
  { key: "large", label: "L" },
];

function TranscriptControls({ prefs, updatePref, searchQuery, setSearchQuery }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-[var(--accent-color)]/20">
      {/* Font Size Buttons */}
      <div className="flex items-center gap-1" role="group" aria-label="Font size">
        {FONT_SIZES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => updatePref("fontSize", key)}
            aria-pressed={prefs.fontSize === key}
            className={`w-7 h-7 rounded text-sm font-medium transition-colors ${
              prefs.fontSize === key
                ? "bg-[var(--button-color)] text-[var(--button-text-color)]"
                : "bg-[var(--accent-color)]/30 text-[var(--text-color)] hover:bg-[var(--accent-color)]/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-[var(--text-color)]/30" aria-hidden="true" />

      {/* Auto-scroll Toggle */}
      <button
        onClick={() => updatePref("autoScroll", !prefs.autoScroll)}
        aria-pressed={prefs.autoScroll}
        aria-label="Auto-scroll transcript"
        title="Auto-scroll"
        className={`p-1.5 rounded transition-colors ${
          prefs.autoScroll
            ? "bg-[var(--button-color)] text-[var(--button-text-color)]"
            : "bg-[var(--accent-color)]/30 text-[var(--text-color)] hover:bg-[var(--accent-color)]/50"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* High Contrast Toggle */}
      <button
        onClick={() => updatePref("highContrast", !prefs.highContrast)}
        aria-pressed={prefs.highContrast}
        aria-label="High contrast mode"
        title="High contrast"
        className={`p-1.5 rounded transition-colors ${
          prefs.highContrast
            ? "bg-[var(--button-color)] text-[var(--button-text-color)]"
            : "bg-[var(--accent-color)]/30 text-[var(--text-color)] hover:bg-[var(--accent-color)]/50"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>

      <div className="w-px h-5 bg-[var(--text-color)]/30" aria-hidden="true" />

      {/* Search Input */}
      <div className="relative flex-1 min-w-[120px] max-w-[200px]">
        <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-color)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          aria-label="Search transcript"
          className="w-full pl-7 pr-2 py-1 text-sm rounded bg-[var(--accent-color)]/30 text-[var(--text-color)] placeholder-[var(--text-color)]/50 border-none outline-none focus:ring-1 focus:ring-[var(--foreground-color)]"
        />
      </div>
    </div>
  );
}

export default TranscriptControls;
