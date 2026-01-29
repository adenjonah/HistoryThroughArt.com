import React, { useState } from "react";

const ChevronIcon = ({ isOpen }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const AccordionSection = ({ title, icon, children, isOpen, onToggle }) => (
  <div className="border border-[var(--accent-color)]/30 rounded-xl overflow-hidden bg-[var(--accent-color)]/10 backdrop-blur-sm">
    <button
      onClick={onToggle}
      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[var(--accent-color)]/20 transition-colors duration-200"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-lg font-semibold text-[var(--text-color)]">{title}</span>
      </div>
      <ChevronIcon isOpen={isOpen} />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="px-5 pb-5 pt-2 text-[var(--text-color)]/90 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

const SubSection = ({ title, children }) => (
  <div className="mb-4 last:mb-0">
    <h4 className="font-medium text-[var(--foreground-color)] mb-2">{title}</h4>
    {children}
  </div>
);

const KeyboardKey = ({ children }) => (
  <kbd className="px-2 py-1 text-sm font-mono bg-[var(--background-color)] border border-[var(--accent-color)]/50 rounded-md text-[var(--text-color)]">
    {children}
  </kbd>
);

function Tutorial() {
  const [openSections, setOpenSections] = useState({});
  const [videoExpanded, setVideoExpanded] = useState(false);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const expandAll = () => {
    setOpenSections({
      intro: true,
      gallery: true,
      exhibit: true,
      flashcards: true,
      map: true,
      calendar: true,
      tips: true,
      technical: true,
    });
  };

  const collapseAll = () => {
    setOpenSections({});
    setVideoExpanded(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)] px-4 py-10 md:py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl text-[var(--text-color)] font-bold mb-3">
            How to Use This Site
          </h1>
          <p className="text-[var(--text-color)]/70 text-lg">
            Everything you need to know about History Through Art
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={expandAll}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--foreground-color)] text-[var(--background-color)] hover:opacity-90 transition-opacity"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--foreground-color)] text-[var(--foreground-color)] hover:bg-[var(--foreground-color)]/10 transition-colors"
          >
            Collapse All
          </button>
        </div>

        {/* Video Section - Special Card */}
        <div className="mb-6 border border-[var(--accent-color)]/30 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--accent-color)]/20 to-[var(--accent-color)]/5">
          <button
            onClick={() => setVideoExpanded(!videoExpanded)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[var(--accent-color)]/10 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎬</span>
              <div>
                <span className="text-lg font-semibold text-[var(--text-color)]">Video Walkthrough</span>
                <span className="ml-2 text-sm text-[var(--text-color)]/60">• Prefer watching?</span>
              </div>
            </div>
            <ChevronIcon isOpen={videoExpanded} />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              videoExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-5 pb-5">
              <div className="relative rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/pv1N-USnLhE"
                  title="Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-3">
          {/* Introduction */}
          <AccordionSection
            title="What is History Through Art?"
            icon="📚"
            isOpen={openSections.intro}
            onToggle={() => toggleSection("intro")}
          >
            <p className="mb-4">
              <strong>History Through Art</strong> is a free study platform for AP Art History students.
              It brings together all <strong>250 required artworks</strong> with educational videos,
              interactive flashcards, maps, and a study calendar.
            </p>
            <p className="mb-4">
              Created to support Mrs. Korus's AP Art History curriculum at North Central High School,
              the site provides multiple ways to learn and retain information about each artwork.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full text-sm bg-[var(--accent-color)]/30 text-[var(--text-color)]">
                250 Artworks
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-[var(--accent-color)]/30 text-[var(--text-color)]">
                Video Lessons
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-[var(--accent-color)]/30 text-[var(--text-color)]">
                Flashcards
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-[var(--accent-color)]/30 text-[var(--text-color)]">
                Interactive Map
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-[var(--accent-color)]/30 text-[var(--text-color)]">
                Study Calendar
              </span>
            </div>
          </AccordionSection>

          {/* Gallery */}
          <AccordionSection
            title="Art Gallery"
            icon="🖼️"
            isOpen={openSections.gallery}
            onToggle={() => toggleSection("gallery")}
          >
            <p className="mb-4">
              Browse all 250 AP Art History artworks in one searchable, filterable catalog.
            </p>

            <SubSection title="Search">
              <p>
                Type to find artworks by <strong>ID, name, artist, date, location, or materials</strong>.
                Search automatically sorts by relevance. Clear the search to return to ID order.
              </p>
            </SubSection>

            <SubSection title="Filter by Content Area">
              <p>
                Use the <strong>Filters</strong> dropdown to show only specific units (1-10).
                Select multiple units to combine filters. Active filters appear as removable tags.
              </p>
            </SubSection>

            <SubSection title="Sort Options">
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["ID", "Name A-Z", "Content Area", "Date", "Korus Order", "Relevance"].map((sort) => (
                  <div key={sort} className="px-3 py-2 bg-[var(--background-color)]/50 rounded-lg text-sm">
                    {sort}
                  </div>
                ))}
              </div>
            </SubSection>

            <p className="mt-4 text-sm text-[var(--text-color)]/70">
              💡 Click any artwork to open its detailed Exhibit page.
            </p>
          </AccordionSection>

          {/* Exhibit */}
          <AccordionSection
            title="Exhibit Page"
            icon="🎨"
            isOpen={openSections.exhibit}
            onToggle={() => toggleSection("exhibit")}
          >
            <p className="mb-4">
              Each artwork has a dedicated page packed with study materials.
            </p>

            <SubSection title="Video Lessons">
              <p>
                Watch Mrs. Korus explain each artwork. Videos include <strong>synchronized transcripts</strong> —
                click any line to jump to that moment, or search within the transcript.
              </p>
            </SubSection>

            <SubSection title="Pronunciation">
              <p>
                Click the <strong>speaker icon</strong> next to artwork titles to hear correct pronunciation.
              </p>
            </SubSection>

            <SubSection title="Key Identifiers">
              <p>
                Quick reference for the essential facts: Artist/Culture, Location, Date, Materials, and Content Area.
              </p>
            </SubSection>

            <SubSection title="Photo Gallery & Map">
              <p>
                Browse multiple images of each artwork. The mini map shows where it was created
                and where it's displayed today.
              </p>
            </SubSection>

            <p className="mt-4 text-sm text-[var(--text-color)]/70">
              💡 Use Previous/Next buttons to browse artworks without returning to the gallery.
            </p>
          </AccordionSection>

          {/* Flashcards */}
          <AccordionSection
            title="Flashcards"
            icon="🃏"
            isOpen={openSections.flashcards}
            onToggle={() => toggleSection("flashcards")}
          >
            <p className="mb-4">
              Study with <strong>spaced repetition</strong> — cards you struggle with appear more often.
            </p>

            <SubSection title="How It Works">
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>See an artwork image</li>
                <li>Recall the details (title, artist, date...)</li>
                <li>Flip to check your answer</li>
                <li>Rate: <strong>Bad</strong>, <strong>Good</strong>, or <strong>Great</strong></li>
              </ol>
            </SubSection>

            <SubSection title="Rating System">
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-3 p-2 bg-red-500/10 rounded-lg">
                  <span className="font-bold text-red-400">Bad</span>
                  <span className="text-sm">Card duplicated for more practice</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-yellow-500/10 rounded-lg">
                  <span className="font-bold text-yellow-400">Good</span>
                  <span className="text-sm">Card moves to next position</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-500/10 rounded-lg">
                  <span className="font-bold text-green-400">Great</span>
                  <span className="text-sm">Card removed from deck</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="Keyboard Shortcuts">
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <KeyboardKey>Space</KeyboardKey>
                  <span className="text-sm">Flip</span>
                </div>
                <div className="flex items-center gap-2">
                  <KeyboardKey>1</KeyboardKey>
                  <span className="text-sm">Bad</span>
                </div>
                <div className="flex items-center gap-2">
                  <KeyboardKey>2</KeyboardKey>
                  <span className="text-sm">Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <KeyboardKey>3</KeyboardKey>
                  <span className="text-sm">Great</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="Mobile">
              <p>
                Swipe cards: <strong>left</strong> for Bad, <strong>up</strong> for Good, <strong>right</strong> for Great.
              </p>
            </SubSection>

            <SubSection title="Settings (Gear Icon)">
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Up to Date</strong> — Study cards due by a specific date</li>
                <li><strong>All Cards</strong> — Study all 250 artworks</li>
                <li><strong>Filter by Unit</strong> — Focus on specific content areas</li>
              </ul>
            </SubSection>

            <p className="mt-4 text-sm text-[var(--text-color)]/70">
              💡 Progress saves automatically. Close and return anytime.
            </p>
          </AccordionSection>

          {/* Map */}
          <AccordionSection
            title="Art Origins Map"
            icon="🗺️"
            isOpen={openSections.map}
            onToggle={() => toggleSection("map")}
          >
            <p className="mb-4">
              Explore where each artwork originated on an interactive world map.
            </p>

            <SubSection title="Controls">
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Zoom</strong> — Scroll wheel, pinch, or +/- buttons</li>
                <li><strong>Pan</strong> — Click and drag</li>
                <li><strong>Markers</strong> — Click to see artwork details</li>
              </ul>
            </SubSection>

            <p className="mt-4 text-sm text-[var(--text-color)]/70">
              💡 Notice how artworks cluster by region — this reflects the AP curriculum's content areas.
            </p>
          </AccordionSection>

          {/* Calendar */}
          <AccordionSection
            title="Study Calendar"
            icon="📅"
            isOpen={openSections.calendar}
            onToggle={() => toggleSection("calendar")}
          >
            <p className="mb-4">
              View Mrs. Korus's assignment schedule and plan your studying.
            </p>

            <SubSection title="How to Use">
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Click any date to see assignments and quizzes</li>
                <li>Dots indicate dates with due items</li>
                <li>Click artwork names to jump to their Exhibit page</li>
                <li>Navigate months with arrow buttons</li>
              </ul>
            </SubSection>

            <p className="mt-4 text-sm text-[var(--text-color)]/70">
              💡 Follows the academic year (September–August).
            </p>
          </AccordionSection>

          {/* Tips */}
          <AccordionSection
            title="Study Tips"
            icon="💡"
            isOpen={openSections.tips}
            onToggle={() => toggleSection("tips")}
          >
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-[var(--background-color)]/50 rounded-lg">
                <span className="text-xl">⏱️</span>
                <div>
                  <strong>Daily practice</strong>
                  <p className="text-sm text-[var(--text-color)]/70">10-15 min daily beats long cramming sessions</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-[var(--background-color)]/50 rounded-lg">
                <span className="text-xl">🎯</span>
                <div>
                  <strong>Focus weak areas</strong>
                  <p className="text-sm text-[var(--text-color)]/70">Filter flashcards to challenging content areas</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-[var(--background-color)]/50 rounded-lg">
                <span className="text-xl">🎥</span>
                <div>
                  <strong>Watch the videos</strong>
                  <p className="text-sm text-[var(--text-color)]/70">Context makes artworks easier to remember</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-[var(--background-color)]/50 rounded-lg">
                <span className="text-xl">🗣️</span>
                <div>
                  <strong>Practice pronunciation</strong>
                  <p className="text-sm text-[var(--text-color)]/70">Use the speaker icon to learn correct names</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-[var(--background-color)]/50 rounded-lg">
                <span className="text-xl">📍</span>
                <div>
                  <strong>Use the map</strong>
                  <p className="text-sm text-[var(--text-color)]/70">Geographic context helps group artworks mentally</p>
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* Technical */}
          <AccordionSection
            title="Technical Notes"
            icon="⚙️"
            isOpen={openSections.technical}
            onToggle={() => toggleSection("technical")}
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg">💾</span>
                <p><strong>Auto-save</strong> — Preferences and flashcard progress save to your browser.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📱</span>
                <p><strong>Mobile ready</strong> — Fully responsive on phones and tablets.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🔓</span>
                <p><strong>Free & open source</strong> — Code available on GitHub.</p>
              </div>
            </div>
          </AccordionSection>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-[var(--text-color)]/60 mb-4">
            Questions or feedback?
          </p>
          <a
            href="/about"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--foreground-color)] text-[var(--background-color)] font-medium hover:opacity-90 transition-opacity"
          >
            Visit the About Page
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
