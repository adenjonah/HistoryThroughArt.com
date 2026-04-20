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
      show: artPiece.date !== "None",
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
      <div
        className="bg-[var(--foreground-color)] rounded-xl p-6 sm:p-8 h-full
                   border-2 border-[var(--accent-color)]/50"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--accent-color)] mb-6 text-center">
          Identifiers
        </h2>

        <div className="space-y-4">
          {identifiers
            .filter((item) => item.show)
            .map((item, index) => (
              <div
                key={index}
                className="bg-[var(--background-color)]/10 rounded-lg p-4
                           hover:bg-[var(--background-color)]/20 transition-colors duration-200"
              >
                <div className="text-sm font-semibold text-[var(--accent-color)]/80 uppercase tracking-wide mb-1">
                  {item.label}
                </div>
                <div className="text-base sm:text-lg text-[var(--accent-color)] font-medium">
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
