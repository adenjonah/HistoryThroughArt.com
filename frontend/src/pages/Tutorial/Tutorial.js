import React from "react";

function Tutorial() {
  return (
    <div className="min-h-screen bg-[var(--background-color)] px-4 py-10 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl text-[var(--text-color)] font-bold mb-6 text-center">
          How to Use This Site
        </h1>
        <p className="text-lg text-[var(--text-color)] mb-8 text-center max-w-2xl mx-auto">
          Welcome to History Through Art! This guide will help you get the most
          out of your AP Art History study experience.
        </p>

        {/* Video Section */}
        <section className="mb-12">
          <h2 className="text-2xl text-[var(--text-color)] font-semibold mb-4">
            Video Walkthrough
          </h2>
          <p className="text-[var(--text-color)] opacity-80 mb-4">
            Prefer watching? This video provides a comprehensive tour of all features:
          </p>
          <div className="w-full">
            <div className="relative" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/pv1N-USnLhE"
                title="Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-[var(--accent-color)] opacity-30 mb-12" />

        {/* Written Guide */}
        <div className="space-y-10 text-[var(--text-color)]">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground-color)]">
              What is History Through Art?
            </h2>
            <p className="mb-4 opacity-90 leading-relaxed">
              History Through Art is a free study tool designed for AP Art History students.
              It brings together all 250 required artworks from the AP curriculum with
              educational videos, interactive flashcards, maps, and a study calendar.
            </p>
            <p className="opacity-90 leading-relaxed">
              Whether you're preparing for a quiz, reviewing for the AP exam, or just
              exploring art history, this site provides multiple ways to learn and retain
              information about each artwork.
            </p>
          </section>

          {/* Quick Start */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground-color)]">
              Quick Start
            </h2>
            <p className="mb-4 opacity-90">
              From the home page, you can jump directly to the three main study tools:
            </p>
            <ul className="list-disc list-inside space-y-2 opacity-90 ml-4">
              <li><strong>Flashcards</strong> — Test your knowledge with interactive study cards</li>
              <li><strong>Gallery</strong> — Browse and search all 250 artworks</li>
              <li><strong>Map</strong> — See where artworks originated around the world</li>
            </ul>
          </section>

          {/* Art Gallery */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground-color)]">
              Art Gallery
            </h2>
            <p className="mb-4 opacity-90 leading-relaxed">
              The Gallery is your browsable catalog of all 250 AP Art History artworks.
              Use it to find specific pieces, explore by content area, or discover new artworks.
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Searching
            </h3>
            <p className="mb-4 opacity-90 leading-relaxed">
              Type in the search bar to find artworks by ID number, name, artist, date,
              location, or materials. The search is smart — ID matches appear first,
              followed by other relevant results. When you start typing, the sort
              automatically switches to "Relevance" to show the best matches first.
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Filtering by Content Area
            </h3>
            <p className="mb-4 opacity-90 leading-relaxed">
              Click the "Filters" dropdown to narrow results to specific units (content areas).
              You can select multiple units at once. Active filters appear as tags below
              the search bar — click the X on any tag to remove that filter.
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Sorting Options
            </h3>
            <p className="mb-4 opacity-90 leading-relaxed">
              Use the sort dropdown to organize artworks by:
            </p>
            <ul className="list-disc list-inside space-y-1 opacity-90 ml-4 mb-4">
              <li><strong>ID</strong> — The official AP Art History numbering (1-250)</li>
              <li><strong>Name</strong> — Alphabetically by artwork title</li>
              <li><strong>Content Area</strong> — Grouped by unit number</li>
              <li><strong>Date</strong> — Chronologically by creation date</li>
              <li><strong>Korus Sort</strong> — Mrs. Korus's recommended teaching order</li>
              <li><strong>Relevance</strong> — Best matches when searching</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Viewing Artworks
            </h3>
            <p className="opacity-90 leading-relaxed">
              Click any artwork in the gallery to open its full Exhibit page with
              videos, details, and more.
            </p>
          </section>

          {/* Exhibit Page */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground-color)]">
              Exhibit Page
            </h2>
            <p className="mb-4 opacity-90 leading-relaxed">
              Each artwork has a dedicated Exhibit page packed with information to help
              you study. Here's what you'll find:
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Video Lessons
            </h3>
            <p className="mb-4 opacity-90 leading-relaxed">
              Watch Mrs. Korus's educational videos explaining each artwork's history,
              significance, and key details. Videos include synchronized transcripts —
              click any line in the transcript to jump to that moment in the video.
              You can also search within the transcript to find specific topics.
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Pronunciation
            </h3>
            <p className="mb-4 opacity-90 leading-relaxed">
              Click the speaker icon next to the artwork title to hear the correct
              pronunciation. This is especially helpful for artworks with names in
              other languages.
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Key Identifiers
            </h3>
            <p className="mb-4 opacity-90 leading-relaxed">
              The identifiers panel shows the essential facts you need to memorize:
              Artist/Culture, Location, Date, Materials, and Content Area. These are
              the details that appear on AP exam questions.
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Photo Gallery
            </h3>
            <p className="mb-4 opacity-90 leading-relaxed">
              Browse multiple images of each artwork to see different angles, details,
              and context views.
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Origin Map
            </h3>
            <p className="mb-4 opacity-90 leading-relaxed">
              A mini map shows where the artwork was created and where it's currently
              located (if different). This helps you understand the geographic and
              cultural context.
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Navigation
            </h3>
            <p className="opacity-90 leading-relaxed">
              Use the Previous/Next buttons to move through artworks sequentially
              without returning to the gallery.
            </p>
          </section>

          {/* Flashcards */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground-color)]">
              Flashcards
            </h2>
            <p className="mb-4 opacity-90 leading-relaxed">
              The Flashcards tool uses spaced repetition to help you memorize artworks
              efficiently. Cards you struggle with appear more often, while cards you
              know well are removed from the deck.
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 opacity-90 ml-4 mb-4">
              <li>A card shows an artwork image</li>
              <li>Try to recall the title, artist, date, and other details</li>
              <li>Click or tap the card to flip it and see the answer</li>
              <li>Rate your recall: <strong>Bad</strong>, <strong>Good</strong>, or <strong>Great</strong></li>
            </ol>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Rating Cards
            </h3>
            <ul className="list-disc list-inside space-y-2 opacity-90 ml-4 mb-4">
              <li><strong>Bad (1)</strong> — Didn't know it. Card is duplicated and added to the end for more practice.</li>
              <li><strong>Good (2)</strong> — Knew most of it. Card moves to the next position.</li>
              <li><strong>Great (3)</strong> — Knew it perfectly. Card is removed from the deck.</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Keyboard Shortcuts
            </h3>
            <ul className="list-disc list-inside space-y-1 opacity-90 ml-4 mb-4">
              <li><strong>Spacebar</strong> — Flip the card</li>
              <li><strong>1</strong> — Rate as Bad</li>
              <li><strong>2</strong> — Rate as Good</li>
              <li><strong>3</strong> — Rate as Great</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Mobile Gestures
            </h3>
            <p className="mb-4 opacity-90 leading-relaxed">
              On mobile devices, you can swipe cards: left for Bad, up for Good,
              right for Great.
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Settings
            </h3>
            <p className="mb-4 opacity-90 leading-relaxed">
              Click the gear icon to open settings where you can:
            </p>
            <ul className="list-disc list-inside space-y-2 opacity-90 ml-4 mb-4">
              <li><strong>Card Selection</strong> — Choose "Up to Date" to study only cards due by a certain date (follows Mrs. Korus's teaching order), or "All Cards" to study all 250 artworks.</li>
              <li><strong>Due Date</strong> — Set a date to see only artworks assigned before that date.</li>
              <li><strong>Filter by Unit</strong> — Select specific content areas to focus your study session.</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Progress Saving
            </h3>
            <p className="opacity-90 leading-relaxed">
              Your progress is automatically saved to your browser. You can close
              the tab and return later to continue where you left off. Use the
              Reset buttons to start fresh (ordered or shuffled).
            </p>
          </section>

          {/* Map */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground-color)]">
              Art Origins Map
            </h2>
            <p className="mb-4 opacity-90 leading-relaxed">
              The interactive map shows where each of the 250 artworks originated.
              This helps you understand the geographic distribution of art history
              and connect artworks to their cultural contexts.
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              Using the Map
            </h3>
            <ul className="list-disc list-inside space-y-2 opacity-90 ml-4 mb-4">
              <li><strong>Zoom</strong> — Use the scroll wheel, pinch gesture, or +/- buttons</li>
              <li><strong>Pan</strong> — Click and drag to move around the map</li>
              <li><strong>Markers</strong> — Click any marker to see the artwork at that location</li>
            </ul>
            <p className="opacity-90 leading-relaxed">
              Notice how artworks cluster in certain regions — this reflects the
              content areas of the AP curriculum (Mediterranean, Europe, Asia, etc.).
            </p>
          </section>

          {/* Calendar */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground-color)]">
              Study Calendar
            </h2>
            <p className="mb-4 opacity-90 leading-relaxed">
              The Calendar shows Mrs. Korus's assignment schedule for the academic year.
              Use it to see what artworks are due on any given day and plan your study sessions.
            </p>

            <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">
              How to Use It
            </h3>
            <ul className="list-disc list-inside space-y-2 opacity-90 ml-4 mb-4">
              <li>Click any date to see assignments and quizzes due that day</li>
              <li>Dates with assignments show a dot indicator</li>
              <li>Click an artwork in the details panel to go directly to its Exhibit page</li>
              <li>Navigate between months using the arrow buttons</li>
            </ul>
            <p className="opacity-90 leading-relaxed">
              The calendar follows the academic year (September through August) and
              automatically highlights today's date.
            </p>
          </section>

          {/* Tips */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground-color)]">
              Study Tips
            </h2>
            <ul className="list-disc list-inside space-y-3 opacity-90 ml-4">
              <li>
                <strong>Daily practice</strong> — Use flashcards for 10-15 minutes
                daily rather than long cramming sessions.
              </li>
              <li>
                <strong>Focus on weak areas</strong> — Filter flashcards by content
                areas you find challenging.
              </li>
              <li>
                <strong>Watch the videos</strong> — Mrs. Korus's explanations provide
                context that makes artworks easier to remember.
              </li>
              <li>
                <strong>Use the map</strong> — Geographic context helps you group
                and remember artworks by region.
              </li>
              <li>
                <strong>Check the calendar</strong> — Stay ahead of assignments by
                reviewing artworks before they're due.
              </li>
              <li>
                <strong>Say names aloud</strong> — Use the pronunciation feature to
                practice saying artwork names correctly.
              </li>
            </ul>
          </section>

          {/* Technical Notes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground-color)]">
              Technical Notes
            </h2>
            <ul className="list-disc list-inside space-y-2 opacity-90 ml-4">
              <li>
                <strong>Browser storage</strong> — Your preferences and flashcard
                progress are saved locally in your browser. Clearing browser data
                will reset your progress.
              </li>
              <li>
                <strong>Works offline</strong> — Once loaded, many features work
                without an internet connection.
              </li>
              <li>
                <strong>Mobile friendly</strong> — The site is fully responsive
                and works on phones and tablets.
              </li>
              <li>
                <strong>Free and open source</strong> — This site is free to use
                and the code is available on GitHub.
              </li>
            </ul>
          </section>

          {/* Questions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground-color)]">
              Questions or Feedback?
            </h2>
            <p className="opacity-90 leading-relaxed">
              Visit the{" "}
              <a
                href="/about"
                className="text-[var(--foreground-color)] underline hover:opacity-80"
              >
                About page
              </a>{" "}
              to learn more about the team behind this site and find contact
              information for questions, suggestions, or bug reports.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
