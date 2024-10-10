import React, { useState, useEffect } from "react";
import "./Flashcards.css";
import artPiecesData from "../../Data/artworks.json"; // Import the JSON data

const Flashcards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState([...artPiecesData]); // Use JSON data as the deck
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Shuffle flashcards on reset
  const shuffleDeck = () => {
    const shuffledDeck = [...artPiecesData].sort(() => Math.random() - 0.5);
    setDeck(shuffledDeck);
    setCurrentCard(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    shuffleDeck(); // Shuffle deck on component mount
  }, []);

  const handleFlip = () => {
    if (!isTransitioning) {
      setIsFlipped(!isFlipped); // Flip the card to show the back
    }
  };

  const handleAction = (action) => {
    if (isTransitioning) return;

    setIsTransitioning(true); // Block interaction during transition

    // After the card flips, replace it with a new instance
    setTimeout(() => {
      let updatedDeck = [...deck];

      if (action === "great") {
        // Remove the card if marked as "Great"
        updatedDeck = deck.filter((_, index) => index !== currentCard);
      }

      // Move to the next card or reset to 0 if necessary
      setCurrentCard((prev) => (prev + 1) % updatedDeck.length);

      // Ensure the new card starts with the front side facing up
      setIsFlipped(false);
      setDeck(updatedDeck);
      setIsTransitioning(false);
    }, 300); // Adjust delay as needed for smooth transitions
  };

  const resetDeck = () => {
    setDeck([...artPiecesData]);
    shuffleDeck();
  };

  if (deck.length === 0) {
    return (
      <div className="flashcards-container">
        <h2>All cards marked as Great! Reset the deck to continue.</h2>
        <button className="reset-button" onClick={resetDeck}>
          Reset Deck
        </button>
      </div>
    );
  }

  return (
    <div className="flashcards-container">
      <div className="progress">{deck.length} cards remaining</div>
      <div
        className={`flashcard ${isFlipped ? "flipped" : ""}`}
        onClick={!isTransitioning ? handleFlip : null} // Allow flip on click
      >
        <div className="flashcard-inner">
          {/* Front: Show the spotlight image */}
          <div className="flashcard-front">
            <img
              src={require(`../../artImages/${deck[currentCard].image[0]}`)} // Use image path from JSON
              alt={deck[currentCard].name}
              className="flashcard-image"
            />
          </div>

          {/* Back: Show name and identifiers only when flipped */}
          <div className="flashcard-back">
            {isFlipped && (
              <>
                <h3 className="flashcard-title">
                  {deck[currentCard].id}. <strong>{deck[currentCard].name}</strong>
                </h3>
                <p>Location: {deck[currentCard].location}</p>
                <p>Artist/Culture: {deck[currentCard].artist_culture || "Unknown"}</p>
                <p>Date: {deck[currentCard].date}</p>
                <p>Materials: {deck[currentCard].materials}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <button
          className="bad-button"
          onClick={!isTransitioning ? () => handleAction("bad") : null}
        >
          Bad
        </button>
        <button
          className="good-button"
          onClick={!isTransitioning ? () => handleAction("good") : null}
        >
          Good
        </button>
        <button
          className="great-button"
          onClick={!isTransitioning ? () => handleAction("great") : null}
        >
          Great
        </button>
      </div>
      <button className="reset-button" onClick={resetDeck}>
        Reset Deck
      </button>
    </div>
  );
};

export default Flashcards;
