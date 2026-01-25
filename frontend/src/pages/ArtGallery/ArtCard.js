import React from "react";
import { useNavigate } from "react-router-dom";

function ArtCard({ item, layout, image, search }) {
  const navigate = useNavigate();

  const formatDate = () => {
    let date = item.date.split("/");

    const toBCE = (date) => {
      return date.startsWith("-") ? date.slice(1) + " BCE" : date;
    };

    if (date.length === 2) {
      date[0] = toBCE(date[0]);
      date[1] = toBCE(date[1]);
      date = date.join(" - ");
    } else {
      date[0] = toBCE(date[0]);
      date = date[0];
    }

    return date;
  };

  // So everything isn't always highlighted
  if (search === "") {
    search = null;
  }

  // Map unit numbers to content area names
  const getContentAreaName = (unitNumber) => {
    const contentAreas = {
      1: "Global Prehistory",
      2: "Ancient Mediterranean",
      3: "Early Europe and Colonial Americas",
      4: "Later Europe and Americas",
      5: "Indigenous Americas",
      6: "Africa",
      7: "West and Central Asia",
      8: "South, East, and Southeast Asia",
      9: "The Pacific",
      10: "Global Contemporary",
    };

    return contentAreas[unitNumber] || `Unit ${unitNumber}`;
  };

  // Keyboard handler for accessibility
  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/exhibit?id=${item.id}`);
    }
  };

  // Check if a specific field matches the search
  const fieldMatches = (value) => {
    if (!search) return false;
    return value?.toString().toLowerCase().includes(search);
  };

  // Highlight class for search matches - yellow bg with dark text for visibility
  const highlightClass = "bg-yellow-300 text-gray-900 rounded px-0.5";

  // Check which fields match
  const idMatches = fieldMatches(item.id.toString());
  const nameMatches = fieldMatches(item.name);
  const artistMatches = fieldMatches(item.artist_culture);
  const locationMatches = fieldMatches(item.location);
  const dateMatches = fieldMatches(item.date);
  const materialsMatches = fieldMatches(item.materials);
  const museumMatches = fieldMatches(item.museum);

  // Check if any visible field matches
  const anyVisibleFieldMatches =
    idMatches ||
    nameMatches ||
    artistMatches ||
    locationMatches ||
    dateMatches ||
    materialsMatches ||
    museumMatches;

  // Check transcript match (only if no visible fields match)
  const transcriptMatches = (() => {
    if (!search || anyVisibleFieldMatches || !item.transcript) return false;
    try {
      const transcriptText = item.transcript
        .map((t) => JSON.parse(t))
        .flat()
        .map((segment) => segment.text)
        .join(" ")
        .toLowerCase();
      return transcriptText.includes(search);
    } catch {
      return false;
    }
  })();

  return (
    <article
      className="group h-full flex flex-col bg-[var(--foreground-color)] rounded-2xl shadow-md
                 hover:shadow-xl hover:ring-2 hover:ring-[var(--button-color)]
                 transition-all duration-200 cursor-pointer overflow-hidden
                 focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:ring-offset-2"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/exhibit?id=${item.id}`)}
      onKeyDown={handleKeyPress}
      aria-label={`View ${item.name}, artwork ${item.id}`}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--accent-color)]/20">
        {item.image && image && (
          <img
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={image.src}
            alt={item.name}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
      </div>

      {/* Body Section - flex column to pin footer to bottom */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        {/* Text Block - title + metadata */}
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${
              idMatches
                ? "bg-yellow-300 text-gray-900"
                : "bg-[var(--accent-color)] text-[var(--text-color)]"
            }`}
          >
            #{item.id}
          </span>

          <h2
            className={`text-base sm:text-lg font-semibold text-[var(--background-color)] line-clamp-2 mb-2 ${
              nameMatches ? highlightClass : ""
            }`}
          >
            {item.name}
          </h2>

          <div className="space-y-1 text-sm text-[var(--accent-color)]">
            {item.artist_culture !== "None" && (
              <p className={artistMatches ? highlightClass : ""}>
                <span className="font-medium">Artist/Culture:</span>{" "}
                {item.artist_culture}
              </p>
            )}
            {item.location !== "None" && (
              <p className={locationMatches ? highlightClass : ""}>
                <span className="font-medium">Location:</span> {item.location}
              </p>
            )}
            {item.date !== "None" && (
              <p className={dateMatches ? highlightClass : ""}>
                <span className="font-medium">Date:</span> {formatDate()}
              </p>
            )}
          </div>
        </div>

        {/* Footer - pinned to bottom via mt-auto */}
        <div className="mt-auto pt-3 border-t border-[var(--accent-color)]/30 flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--background-color)]">
            {getContentAreaName(item.unit)}
          </span>
          {transcriptMatches && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-200 text-gray-700">
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              In video
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ArtCard;
