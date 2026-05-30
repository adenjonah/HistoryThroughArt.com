import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import PageHeading from "../../components/PageHeading";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-300 text-[var(--text-muted)] ${isOpen ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

interface MonoChipProps {
  children: React.ReactNode;
}

const MonoChip = ({ children }: MonoChipProps) => (
  <span
    className="shrink-0 text-[var(--gold-color)] border border-[var(--border-gold)] rounded text-xs px-[7px] py-[3px]"
    style={{ fontFamily: "var(--font-mono)" }}
  >
    {children}
  </span>
);

// ─── AccordionSection ─────────────────────────────────────────────────────────

interface AccordionSectionProps {
  title: string;
  number: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionSection = ({ title, number, children, isOpen, onToggle }: AccordionSectionProps) => (
  <div
    className="border border-[var(--border-gold)] rounded-xl overflow-hidden transition-colors duration-200"
    style={{ background: isOpen ? "var(--background-color)" : "var(--surface-1)" }}
  >
    <button
      onClick={onToggle}
      className="w-full px-5 py-4 flex items-center justify-between text-left"
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-[14px]">
        <MonoChip>{number}</MonoChip>
        <span className="font-display text-[19px] text-[var(--text-strong)]">{title}</span>
      </div>
      <ChevronIcon isOpen={isOpen} />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div
        className="px-5 pb-[22px] leading-relaxed"
        style={{ borderTop: "1px solid var(--border-soft)" }}
      >
        {children}
      </div>
    </div>
  </div>
);

// ─── SubSection ───────────────────────────────────────────────────────────────

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-4 last:mb-0">
    <h4
      className="font-semibold text-[var(--gold-soft)] mb-2"
      style={{ fontSize: "13.5px" }}
    >
      {title}
    </h4>
    {children}
  </div>
);

// ─── KeyboardKey ──────────────────────────────────────────────────────────────

const KeyboardKey = ({ children }: { children: React.ReactNode }) => (
  <kbd
    className="text-[var(--text-strong)] bg-[var(--surface-2)] border border-[var(--gold-color)] rounded text-xs px-2 py-[3px]"
    style={{ fontFamily: "var(--font-mono)" }}
  >
    {children}
  </kbd>
);

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_SECTIONS = ["intro", "gallery", "exhibit", "flashcards", "map", "calendar", "tips", "technical"] as const;

// ─── Tutorial ────────────────────────────────────────────────────────────────

function Tutorial() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [videoExpanded, setVideoExpanded] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const expandAll = () => {
    setOpenSections(Object.fromEntries(ALL_SECTIONS.map((s) => [s, true])));
    setVideoExpanded(true);
  };

  const collapseAll = () => {
    setOpenSections({});
    setVideoExpanded(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)] px-4 py-10 md:py-16">
      <div className="mx-auto" style={{ maxWidth: 720 }}>

        {/* Header — centered */}
        <div className="text-center mb-7">
          <PageHeading
            title="How to Use This Site"
            subtitle="Everything you need to know about History Through Art"
          />
        </div>

        {/* Expand / Collapse buttons */}
        <div className="flex justify-center gap-3 mb-[22px]">
          <button
            onClick={expandAll}
            className="text-[var(--ink-on-gold)] bg-[var(--gold-color)] rounded font-medium text-[13px] px-5 py-[9px] hover:bg-[var(--gold-soft)] transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-[var(--text-strong)] bg-transparent border border-[var(--border-gold)] rounded font-medium text-[13px] px-5 py-[9px] hover:bg-[var(--surface-1)] transition-colors"
          >
            Collapse All
          </button>
        </div>

        {/* Video Walkthrough banner */}
        <div
          className="border border-[var(--border-gold)] rounded-xl overflow-hidden mb-[14px]"
          style={{ background: "rgba(85,40,111,0.25)" }}
        >
          <button
            onClick={() => setVideoExpanded(!videoExpanded)}
            className="w-full px-5 py-4 flex items-center justify-between text-left"
            aria-expanded={videoExpanded}
          >
            <div className="flex items-center gap-[14px]">
              <MonoChip>▶</MonoChip>
              <div className="font-display text-[19px] text-[var(--text-strong)]">
                Video Walkthrough{" "}
                <span className="text-[13px] text-[var(--text-muted)]" style={{ fontFamily: "var(--font-body)" }}>
                  • Prefer watching?
                </span>
              </div>
            </div>
            <ChevronIcon isOpen={videoExpanded} />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              videoExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-5 pb-5 bg-[var(--background-color)]">
              <div className="relative rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/pv1N-USnLhE"
                  title="Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="flex flex-col gap-3">

          {/* 01 — What is History Through Art? */}
          <AccordionSection
            number="01"
            title="What is History Through Art?"
            isOpen={!!openSections.intro}
            onToggle={() => toggleSection("intro")}
          >
            <p className="text-[var(--text-default)] leading-relaxed mt-4 mb-4">
              <strong className="text-[var(--text-strong)]">History Through Art</strong> is a free study platform for AP Art History students.
              It brings together all <strong className="text-[var(--text-strong)]">250 required artworks</strong> with educational videos,
              interactive flashcards, maps, and a study calendar.
            </p>
            <p className="text-[var(--text-default)] leading-relaxed mb-4">
              Created to support Mrs. Korus's AP Art History curriculum at North Central High School,
              the site provides multiple ways to learn and retain information about each artwork.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["250 Artworks", "Video Lessons", "Flashcards", "Interactive Map", "Study Calendar"].map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-[var(--border-gold)] text-[var(--text-muted)]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </AccordionSection>

          {/* 02 — Art Gallery */}
          <AccordionSection
            number="02"
            title="Art Gallery"
            isOpen={!!openSections.gallery}
            onToggle={() => toggleSection("gallery")}
          >
            <p className="text-[var(--text-default)] leading-relaxed mt-4 mb-4">
              Browse all 250 AP Art History artworks in one searchable, filterable catalog.
            </p>
            <SubSection title="Search">
              <p className="text-[var(--text-default)] text-sm leading-relaxed">
                Type to find artworks by <strong className="text-[var(--text-strong)]">ID, name, artist, date, location, or materials</strong>.
                Search automatically sorts by relevance. Clear the search to return to ID order.
              </p>
            </SubSection>
            <SubSection title="Filter by Content Area">
              <p className="text-[var(--text-default)] text-sm leading-relaxed">
                Use the <strong className="text-[var(--text-strong)]">Filters</strong> dropdown to show only specific units (1–10).
                Select multiple units to combine filters.
              </p>
            </SubSection>
            <SubSection title="Sort Options">
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["ID", "Name A-Z", "Content Area", "Date", "Korus Order", "Relevance"].map((sort) => (
                  <div key={sort} className="px-3 py-2 bg-[var(--surface-2)] rounded-lg text-sm text-[var(--text-default)]">
                    {sort}
                  </div>
                ))}
              </div>
            </SubSection>
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              💡 Click any artwork to open its detailed Exhibit page.
            </p>
          </AccordionSection>

          {/* 03 — Exhibit Page */}
          <AccordionSection
            number="03"
            title="Exhibit Page"
            isOpen={!!openSections.exhibit}
            onToggle={() => toggleSection("exhibit")}
          >
            <p className="text-[var(--text-default)] leading-relaxed mt-4 mb-4">
              Each artwork has a dedicated page packed with study materials.
            </p>
            <SubSection title="Video Lessons">
              <p className="text-[var(--text-default)] text-sm leading-relaxed">
                Watch Mrs. Korus explain each artwork. Videos include <strong className="text-[var(--text-strong)]">synchronized transcripts</strong> —
                click any line to jump to that moment, or search within the transcript.
              </p>
            </SubSection>
            <SubSection title="Pronunciation">
              <p className="text-[var(--text-default)] text-sm leading-relaxed">
                Click the <strong className="text-[var(--text-strong)]">speaker icon</strong> next to artwork titles to hear correct pronunciation.
              </p>
            </SubSection>
            <SubSection title="Key Identifiers">
              <p className="text-[var(--text-default)] text-sm leading-relaxed">
                Quick reference for the essential facts: Artist/Culture, Location, Date, Materials, and Content Area.
              </p>
            </SubSection>
            <SubSection title="Photo Gallery & Map">
              <p className="text-[var(--text-default)] text-sm leading-relaxed">
                Browse multiple images of each artwork. The mini map shows where it was created and where it's displayed today.
              </p>
            </SubSection>
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              💡 Use Previous/Next buttons to browse artworks without returning to the gallery.
            </p>
          </AccordionSection>

          {/* 04 — Flashcards */}
          <AccordionSection
            number="04"
            title="Flashcards"
            isOpen={!!openSections.flashcards}
            onToggle={() => toggleSection("flashcards")}
          >
            <p className="text-[var(--text-default)] leading-relaxed mt-4 mb-4">
              Study with <strong className="text-[var(--gold-soft)]">spaced repetition</strong> — cards you struggle with appear more often.
            </p>

            <SubSection title="How It Works">
              <ol className="list-decimal list-inside space-y-1 ml-2 text-sm text-[var(--text-default)]">
                <li>See an artwork image</li>
                <li>Recall the details (title, artist, date...)</li>
                <li>Flip to check your answer</li>
                <li>Rate: <strong className="text-[var(--text-strong)]">Bad</strong>, <strong className="text-[var(--text-strong)]">Good</strong>, or <strong className="text-[var(--text-strong)]">Great</strong></li>
              </ol>
            </SubSection>

            <SubSection title="Rating System">
              <div className="flex flex-col gap-2 mt-2">
                {([
                  ["Bad",   "Card duplicated for more practice", "var(--fc-bad-text)"],
                  ["Good",  "Card moves to next position",       "var(--fc-good-text)"],
                  ["Great", "Card removed from deck",            "var(--fc-great-text)"],
                ] as const).map(([label, desc, fg]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 px-[14px] py-[11px] rounded-lg"
                    style={{ background: "rgba(33,11,44,0.55)", border: `1px solid color-mix(in srgb, ${fg} 33%, transparent)` }}
                  >
                    <span className="font-bold min-w-[44px] text-sm" style={{ color: fg }}>
                      {label}
                    </span>
                    <span className="text-[var(--text-default)] text-[13.5px]">{desc}</span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Keyboard Shortcuts">
              <div className="flex flex-wrap gap-[18px] mt-2">
                {[["Space", "Flip"], ["1", "Bad"], ["2", "Good"], ["3", "Great"]].map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <KeyboardKey>{key}</KeyboardKey>
                    <span className="text-sm text-[var(--text-muted)]">{label}</span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Mobile">
              <p className="text-[var(--text-default)] text-sm leading-relaxed">
                Swipe cards: <strong className="text-[var(--text-strong)]">left</strong> for Bad,{" "}
                <strong className="text-[var(--text-strong)]">up</strong> for Good,{" "}
                <strong className="text-[var(--text-strong)]">right</strong> for Great.
              </p>
            </SubSection>

            <SubSection title="Settings (Gear Icon)">
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-[var(--text-default)]">
                <li><strong className="text-[var(--text-strong)]">Up to Date</strong> — Study cards due by a specific date</li>
                <li><strong className="text-[var(--text-strong)]">All Cards</strong> — Study all 250 artworks</li>
                <li><strong className="text-[var(--text-strong)]">Filter by Unit</strong> — Focus on specific content areas</li>
              </ul>
            </SubSection>

            <p className="mt-4 text-sm text-[var(--text-muted)]">
              💡 Progress saves automatically. Close and return anytime.
            </p>
          </AccordionSection>

          {/* 05 — Art Origins Map */}
          <AccordionSection
            number="05"
            title="Art Origins Map"
            isOpen={!!openSections.map}
            onToggle={() => toggleSection("map")}
          >
            <p className="text-[var(--text-default)] leading-relaxed mt-4 mb-4">
              Explore where each artwork originated on an interactive world map.
            </p>
            <SubSection title="Controls">
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-[var(--text-default)]">
                <li><strong className="text-[var(--text-strong)]">Zoom</strong> — Scroll wheel, pinch, or +/- buttons</li>
                <li><strong className="text-[var(--text-strong)]">Pan</strong> — Click and drag</li>
                <li><strong className="text-[var(--text-strong)]">Markers</strong> — Click to see artwork details</li>
              </ul>
            </SubSection>
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              💡 Notice how artworks cluster by region — this reflects the AP curriculum's content areas.
            </p>
          </AccordionSection>

          {/* 06 — Study Calendar */}
          <AccordionSection
            number="06"
            title="Study Calendar"
            isOpen={!!openSections.calendar}
            onToggle={() => toggleSection("calendar")}
          >
            <p className="text-[var(--text-default)] leading-relaxed mt-4 mb-4">
              View Mrs. Korus's assignment schedule and plan your studying.
            </p>
            <SubSection title="How to Use">
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-[var(--text-default)]">
                <li>Click any date to see assignments and quizzes</li>
                <li>Dots indicate dates with due items</li>
                <li>Click artwork names to jump to their Exhibit page</li>
                <li>Navigate months with arrow buttons</li>
              </ul>
            </SubSection>
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              💡 Follows the academic year (September–August).
            </p>
          </AccordionSection>

          {/* 07 — Study Tips */}
          <AccordionSection
            number="07"
            title="Study Tips"
            isOpen={!!openSections.tips}
            onToggle={() => toggleSection("tips")}
          >
            <div className="flex flex-col gap-3 mt-4">
              {[
                { icon: "⏱️", title: "Daily practice", tip: "10-15 min daily beats long cramming sessions" },
                { icon: "🎯", title: "Focus weak areas", tip: "Filter flashcards to challenging content areas" },
                { icon: "🎥", title: "Watch the videos", tip: "Context makes artworks easier to remember" },
                { icon: "🗣️", title: "Practice pronunciation", tip: "Use the speaker icon to learn correct names" },
                { icon: "📍", title: "Use the map", tip: "Geographic context helps group artworks mentally" },
              ].map(({ icon, title, tip }) => (
                <div key={title} className="flex gap-3 p-3 bg-[var(--surface-2)] rounded-lg">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <strong className="text-[var(--text-strong)]">{title}</strong>
                    <p className="text-sm text-[var(--text-default)]">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* 08 — Technical Notes */}
          <AccordionSection
            number="08"
            title="Technical Notes"
            isOpen={!!openSections.technical}
            onToggle={() => toggleSection("technical")}
          >
            <div className="flex flex-col gap-3 mt-4">
              {[
                { icon: "💾", title: "Auto-save", note: "Preferences and flashcard progress save to your browser." },
                { icon: "📱", title: "Mobile ready", note: "Fully responsive on phones and tablets." },
                { icon: "🔓", title: "Free & open source", note: "Code available on GitHub." },
              ].map(({ icon, title, note }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-lg">{icon}</span>
                  <p className="text-[var(--text-default)] text-sm leading-relaxed">
                    <strong className="text-[var(--text-strong)]">{title}</strong> — {note}
                  </p>
                </div>
              ))}
            </div>
          </AccordionSection>
        </div>

        {/* Footer */}
        <div className="mt-[30px] text-center">
          <p className="text-[var(--text-default)] text-[14.5px] mb-[14px]">Questions or feedback?</p>
          <Link
            to="/about"
            className="inline-flex items-center justify-center text-[var(--ink-on-gold)] bg-[var(--gold-color)] rounded font-medium text-sm px-[26px] py-[13px] hover:bg-[var(--gold-soft)] transition-colors"
          >
            Visit the About Page ›
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
