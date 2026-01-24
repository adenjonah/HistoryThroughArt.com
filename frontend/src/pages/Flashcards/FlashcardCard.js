import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getContentAreaName } from "../../data/contentAreas";
import { formatDateDisplay } from "./flashcardUtils";

const FlashcardCard = ({
  card,
  isFlipped,
  isTransitioning,
  onFlip,
  onAction,
  animation,
  isReady,
}) => {
  const cardRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Reset card transform when animation completes
  useEffect(() => {
    if (isReady && cardRef.current) {
      cardRef.current.style.transform = "translateX(0) translateY(0) rotate(0)";
    }
  }, [isReady]);

  const handleTouchStart = (e) => {
    if (isTransitioning) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setSwipeDirection(null);
  };

  const handleTouchMove = (e) => {
    if (isTransitioning || !cardRef.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartRef.current.x;
    const deltaY = touchStartRef.current.y - currentY;

    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontal) {
      cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
      if (deltaX > 50) {
        setSwipeDirection("right");
      } else if (deltaX < -50) {
        setSwipeDirection("left");
      } else {
        setSwipeDirection(null);
      }
    } else if (deltaY > 30) {
      cardRef.current.style.transform = `translateY(${-deltaY}px)`;
      setSwipeDirection("up");
    } else {
      cardRef.current.style.transform = "translateY(0)";
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = (e) => {
    if (isTransitioning || !cardRef.current) return;

    cardRef.current.style.transition = "transform 0.3s ease";

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - touchStartRef.current.x;
    const deltaY = touchStartRef.current.y - endY;

    const minSwipeDistance = 100;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        onAction("great");
      } else {
        onAction("bad");
      }
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > minSwipeDistance) {
      onAction("good");
    } else {
      cardRef.current.style.transform = "translateX(0) translateY(0) rotate(0)";
      setSwipeDirection(null);
    }

    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = "";
      }
    }, 300);
  };

  if (!card) return null;

  const cardClasses = [
    "flashcard",
    isFlipped && "flipped",
    animation,
    isReady ? "card-ready" : "card-exit",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {swipeDirection && (
        <div className={`swipe-indicator ${swipeDirection}`}>
          {swipeDirection === "left" ? "Bad" : swipeDirection === "up" ? "Good" : "Great"}
        </div>
      )}

      <div className="cards-container">
        <div className="card-deck-shadow"></div>
        <div
          ref={cardRef}
          className={cardClasses}
          onClick={!isTransitioning ? onFlip : undefined}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <span className="flip-hint">Press SPACE to flip</span>
          <div className="flashcard-inner">
            {/* Front - Image */}
            <div className="flashcard-front">
              <img
                src={require(`../../artImages/${card.image[0]}`)}
                alt={card.name}
                className="flashcard-image"
              />
              <Link
                to={`/exhibit?id=${card.id}`}
                className="full-page-button"
                onClick={(e) => e.stopPropagation()}
              >
                View Details
              </Link>
            </div>

            {/* Back - Details */}
            <div className="flashcard-back">
              {isFlipped && (
                <>
                  <h3 className="flashcard-title">
                    {card.id}. <strong>{card.name}</strong>
                  </h3>
                  <div className="flashcard-content">
                    <p>Location: {card.location}</p>
                    <p>Artist/Culture: {card.artist_culture || "Unknown"}</p>
                    <p>Date: {formatDateDisplay(card.date)}</p>
                    <p>Materials: {card.materials}</p>
                    <p>Content Area: {getContentAreaName(card.unit)}</p>
                  </div>
                  <div className="details-link-container">
                    <Link
                      to={`/exhibit?id=${card.id}`}
                      className="full-page-button back-side"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlashcardCard;
