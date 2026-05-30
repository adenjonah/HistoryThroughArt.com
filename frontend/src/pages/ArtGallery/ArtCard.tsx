import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageHotspot } from "../../lib/sanity";
import { getContentAreaName } from "../../data/contentAreas";

function ArtCard({ item, layout, image, search }) {
  const navigate = useNavigate();

  const formatDate = () => {
    let parts = item.date.split("/");
    const toBCE = (d) => (d.startsWith("-") ? d.slice(1) + " BCE" : d);
    if (parts.length === 2) return `${toBCE(parts[0])} - ${toBCE(parts[1])}`;
    return toBCE(parts[0]);
  };

  const searchTerm = search || null;

  const fieldMatches = (value) =>
    searchTerm ? value?.toString().toLowerCase().includes(searchTerm) : false;

  // Highlight class for search match emphasis — gold tint on Nocturne palette
  const highlightClass = "bg-[var(--gold-color)]/20 text-[var(--gold-soft)] rounded px-0.5";

  const idMatches = fieldMatches(item.id.toString());
  const nameMatches = fieldMatches(item.name);
  const artistMatches = fieldMatches(item.artist_culture);
  const locationMatches = fieldMatches(item.location);
  const dateMatches = fieldMatches(item.date);
  const materialsMatches = fieldMatches(item.materials);
  const museumMatches = fieldMatches(item.museum);

  const anyVisibleFieldMatches =
    idMatches || nameMatches || artistMatches || locationMatches ||
    dateMatches || materialsMatches || museumMatches;

  const transcriptMatches = (() => {
    if (!searchTerm || anyVisibleFieldMatches || !item.transcript) return false;
    try {
      const text = item.transcript
        .map((t) => JSON.parse(t))
        .flat()
        .map((s) => s.text)
        .join(" ")
        .toLowerCase();
      return text.includes(searchTerm);
    } catch {
      return false;
    }
  })();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/exhibit?id=${item.id}`);
    }
  };

  return (
    <article
      className="group h-full flex flex-col
                 bg-[var(--surface-1)] border border-[var(--border-soft)]
                 rounded-lg overflow-hidden cursor-pointer
                 hover:border-[var(--border-gold)] hover:shadow-lg hover:shadow-black/40
                 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-[var(--gold-color)] focus:ring-offset-2 focus:ring-offset-[var(--background-color)]"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/exhibit?id=${item.id}`)}
      onKeyDown={handleKeyDown}
      aria-label={`View ${item.name}, artwork ${item.id}`}
    >
      {/* Image — fixed-height box preserving real Sanity artwork */}
      <div className="relative h-[150px] overflow-hidden bg-[var(--surface-2)] flex-shrink-0">
        {item.image && image ? (
          <img
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ objectPosition: getImageHotspot(item.imageData?.[0]) }}
            src={image.src}
            alt={item.name}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-[var(--surface-3)]" aria-hidden="true" />
        )}
        {/* Vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(0,0,0,0.32))" }}
          aria-hidden="true"
        />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-3.5">
        {/* ID pill — gold border, rounded */}
        <span
          className={`inline-flex items-center self-start px-2.5 py-[2px] mb-2
                     rounded-full text-[11px] font-semibold
                     border border-[var(--border-gold)]
                     ${idMatches ? "bg-[var(--gold-color)]/20 text-[var(--gold-soft)]" : "text-[var(--gold-color)]"}`}
        >
          #{item.id}
        </span>

        {/* Title — display serif, cream */}
        <h2
          className={`font-display text-[17px] leading-[1.18] text-[var(--text-strong)] line-clamp-2 mb-2 ${
            nameMatches ? highlightClass : ""
          }`}
        >
          {item.name}
        </h2>

        {/* Identifier rows: muted label + default value */}
        <div className="space-y-[3px] text-[12.5px]">
          {item.artist_culture !== "None" && (
            <p className={`text-[var(--text-default)] ${artistMatches ? highlightClass : ""}`}>
              <span className="text-[var(--text-muted)]">Artist/Culture:</span>{" "}
              {item.artist_culture}
            </p>
          )}
          {item.location !== "None" && (
            <p className={`text-[var(--text-default)] ${locationMatches ? highlightClass : ""}`}>
              <span className="text-[var(--text-muted)]">Location:</span>{" "}
              {item.location}
            </p>
          )}
          {Boolean(item.date) && item.date !== "None" && (
            <p className={`text-[var(--text-default)] ${dateMatches ? highlightClass : ""}`}>
              <span className="text-[var(--text-muted)]">Date:</span>{" "}
              {formatDate()}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-[11px] border-t border-[var(--border-soft)] flex items-center justify-between">
          <span className="text-[10.5px] tracking-[0.03em] text-[var(--text-muted)]">
            {getContentAreaName(item.unit)}
          </span>
          {transcriptMatches && (
            <span
              className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full
                         text-[10px] font-semibold
                         bg-[var(--gold-soft)] text-[var(--ink-on-gold)]"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
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
