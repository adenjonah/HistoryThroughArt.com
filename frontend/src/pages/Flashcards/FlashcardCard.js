import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getContentAreaName } from "../../data/contentAreas";
import { formatDateDisplay, hasSeenFlipHint, markFlipHintSeen } from "./flashcardUtils";

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
  const [showFlipHint, setShowFlipHint] = useState(!hasSeenFlipHint());

  // Dismiss flip hint on first flip
  useEffect(() => {
    if (isFlipped && showFlipHint) {
      setShowFlipHint(false);
      markFlipHintSeen();
    }
  }, [isFlipped, showFlipHint]);

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

  // Get image source - handle both Sanity URLs and legacy local paths
  const getImageSrc = () => {
    if (!card.image || !card.image[0]) return "";
    const imagePath = card.image[0];
    // If it's already a URL (from Sanity), use it directly
    if (imagePath.startsWith("http")) return imagePath;
    // Fallback for legacy local images (shouldn't happen after migration)
    return imagePath;
  };

  const imageSrc = getImageSrc();

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
          {showFlipHint && (
            <span className="flip-hint">Press SPACE to flip</span>
          )}
          <div className="flashcard-inner">
            {/* Front - Image Only */}
            <div className="flashcard-front">
              <div className="image-viewport">
                {/* Blurred background layer for letterboxing */}
                <div
                  className="image-backdrop"
                  style={{ backgroundImage: `url(${imageSrc})` }}
                />
                {/* Main image with contain */}
                <img
                  src={imageSrc}
                  alt={card.name}
                  className="flashcard-image"
                />
              </div>
            </div>

            {/* Back - Details Only */}
            <div className="flashcard-back">
              <div className="back-content">
                <h3 className="flashcard-title">
                  <span className="card-number">{card.id}.</span>
                  <span className="card-name">{card.name}</span>
                </h3>

                <div className="flashcard-metadata">
                  <div className="metadata-row">
                    <span className="metadata-label">Artist/Culture</span>
                    <span className="metadata-value">{card.artist_culture || "Unknown"}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label">Date</span>
                    <span className="metadata-value">{formatDateDisplay(card.date)}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label">Location</span>
                    <span className="metadata-value">{card.location || "—"}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label">Materials</span>
                    <span className="metadata-value">{card.materials || "—"}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label">Content Area</span>
                    <span className="metadata-value">{getContentAreaName(card.unit)}</span>
                  </div>
                </div>

                <Link
                  to={`/exhibit?id=${card.id}`}
                  className="view-details-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlashcardCard;
