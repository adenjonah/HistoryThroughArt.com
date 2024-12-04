import React from "react";

function Identifiers({ artPiece }) {
  const formatDate = (date) => {
    let dateParts = date.split("/");

    const toBCE = (datePart) => {
      return datePart.startsWith("-") ? datePart.slice(1) + " BCE" : datePart;
    };

    if (dateParts.length === 2) {
      dateParts[0] = toBCE(dateParts[0]);
      dateParts[1] = toBCE(dateParts[1]);
      dateParts = dateParts.join(" - ");
    } else {
      dateParts[0] = toBCE(dateParts[0]);
      dateParts = dateParts[0];
    }

    return dateParts;
  };

  return (
    <div
      className="max-w-xl mx-auto p-6 rounded-lg shadow-md"
      style={{
        backgroundColor: "var(--foreground-color)",
        color: "var(--accent-color)",
        borderColor: "var(--accent-color)",
        borderWidth: "1px",
      }}
    >
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--accent-color)", textAlign: "center" }}
      >
        Identifiers
      </h2>
      <div className="space-y-2">
        {artPiece.artist_culture !== "None" && (
          <p>
            <strong>Artist/Culture:</strong> {artPiece.artist_culture}
          </p>
        )}
        {artPiece.location !== "None" && (
          <p>
            <strong>Location Made:</strong> {artPiece.location}
          </p>
        )}
        {artPiece.date !== "None" && (
          <p>
            <strong>Year Created:</strong> {formatDate(artPiece.date)}
          </p>
        )}
        {artPiece.materials !== "None" && (
          <p>
            <strong>Materials:</strong> {artPiece.materials}
          </p>
        )}
        <p>
          <strong>Unit:</strong> {artPiece.unit}
        </p>
      </div>
    </div>
  );
}

export default Identifiers;
