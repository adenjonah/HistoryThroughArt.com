import React from "react";
import { getContentAreaName } from "../../data/contentAreas";

function Identifiers({ artPiece }) {
  const formatDate = (date) => {
    let dateParts = date.split("/");

    const toBCE = (datePart) => {
      return datePart.startsWith("-") ? datePart.slice(1) + " BCE" : datePart;
    };

    if (dateParts.length === 2) {
      dateParts[0] = toBCE(dateParts[0]);
      dateParts[1] = toBCE(dateParts[1]);
      return dateParts.join(" - ");
    } else {
      return toBCE(dateParts[0]);
    }
  };

  const identifiers = [
    {
      label: "Artist/Culture",
      value: artPiece.artist_culture,
      show: artPiece.artist_culture !== "None",
    },
    {
      label: "Location Made",
      value: artPiece.location,
      show: artPiece.location !== "None",
    },
    {
      label: "Date Created",
      value: formatDate(artPiece.date),
      show: Boolean(artPiece.date) && artPiece.date !== "None",
    },
    {
      label: "Materials",
      value: artPiece.materials,
      show: artPiece.materials !== "None",
    },
    {
      label: "Content Area",
      value: `Unit ${artPiece.unit}: ${getContentAreaName(artPiece.unit)}`,
      show: true,
    },
  ];

  return (
    <div className="h-full">
      {/* Nocturne Identifiers card: surface-1 bg, 2px gold/0.3 border, rounded */}
      <div
        className="bg-[var(--surface-1)] rounded-xl p-6 sm:p-8 h-full"
        style={{ border: "2px solid rgba(205,161,78,0.3)" }}
      >
        {/* serif "Identifiers" heading gold-soft centered */}
        <h2 className="font-display text-xl sm:text-2xl text-[var(--gold-soft)] mb-6 text-center">
          Identifiers
        </h2>

        <div className="space-y-3">
          {identifiers
            .filter((item) => item.show)
            .map((item, index) => (
              /* sub-surface rounded chip */
              <div
                key={index}
                className="rounded-lg p-3 sm:p-4 hover:bg-[var(--surface-2)] transition-colors duration-200"
                style={{ background: "rgba(33,11,44,0.5)" }}
              >
                {/* uppercase small label, muted */}
                <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">
                  {item.label}
                </div>
                {/* value, strong */}
                <div className="text-sm sm:text-base text-[var(--text-strong)] font-medium">
                  {item.value}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Identifiers;
