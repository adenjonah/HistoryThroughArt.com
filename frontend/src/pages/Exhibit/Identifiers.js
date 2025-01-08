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
      className="flex flex-col justify-center items-center w-full h-full p-4 border rounded-lg"
      style={{
        backgroundColor: "var(--foreground-color)",
        color: "var(--accent-color)",
        borderColor: "var(--accent-color)",
        borderWidth: "1px",
      }}
    >
      <h2
        className="text-center font-bold mb-4"
        style={{
          fontSize: "2.5vw", // Dynamically sized header
          color: "var(--accent-color)",
        }}
      >
        Identifiers
      </h2>
      <div
        className="space-y-4 text-center"
        style={{
          fontSize: "1.75vw", // Responsive font size for content
          lineHeight: "1.5", // Improves readability
        }}
      >
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
