import React, { useEffect, useState, useRef, useCallback } from "react";
import JSZip from "jszip";
import { useArtwork } from "../../hooks/useSanityData";

function PhotoGallery({ id }) {
  const [artImages, setArtImages] = useState([]);
  const [slideIndex, setSlideIndex] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasImages, setHasImages] = useState(true);
  const [failedImages, setFailedImages] = useState(new Set());
  const slideRefs = useRef([]);
  const carouselRef = useRef(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Fetch artwork from Sanity
  const { artwork: foundArtPiece, loading } = useArtwork(parseInt(id, 10));

  // Get image URL - images from Sanity are already URLs
  const getImagePath = (imageUrl) => {
    if (!imageUrl) return "";
    // Sanity images come as full URLs
    if (imageUrl.startsWith('http')) return imageUrl;
    return imageUrl;
  };

  useEffect(() => {
    if (loading) return;

    if (foundArtPiece && foundArtPiece.image && foundArtPiece.image.length > 0) {
      setArtImages(foundArtPiece.image);
      setHasImages(true);
    } else {
      setArtImages([]);
      setHasImages(false);
    }
  }, [foundArtPiece, loading]);

  const showSlides = useCallback(
    (n) => {
      if (slideRefs.current.length === 0 || !hasImages) return;

      let newIndex = n;
      if (n > slideRefs.current.length) {
        newIndex = 1;
      } else if (n < 1) {
        newIndex = slideRefs.current.length;
      }

      setSlideIndex(newIndex);

      for (let i = 0; i < slideRefs.current.length; i++) {
        if (slideRefs.current[i]) {
          slideRefs.current[i].style.display = "none";
        }
      }

      if (slideRefs.current[newIndex - 1]) {
        slideRefs.current[newIndex - 1].style.display = "block";
      }
    },
    [hasImages]
  );

  useEffect(() => {
    if (hasImages && artImages.length > 0) {
      showSlides(slideIndex);
    }
  }, [slideIndex, artImages, showSlides, hasImages]);

  const pushSlides = useCallback(
    (n) => {
      if (hasImages && artImages.length > 0) {
        showSlides(slideIndex + n);
      }
    },
    [hasImages, artImages.length, showSlides, slideIndex]
  );

  // Keyboard navigation for carousel
  const handleCarouselKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        pushSlides(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        pushSlides(1);
      }
    },
    [pushSlides]
  );

  // Modal keyboard handling (Escape to close) and focus trap
  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setModalOpen(false);
      }
      // Focus trap - keep focus within modal
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Focus close button when modal opens
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen]);

  // Body scroll lock when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [modalOpen]);

  const handleDownload = () => {
    if (!hasImages || artImages.length === 0 || !artImages[slideIndex - 1]) {
      return;
    }

    const currentImageName = artImages[slideIndex - 1];
    const imagePath = getImagePath(currentImageName);

    if (!imagePath) return;

    const link = document.createElement("a");
    link.href = imagePath;
    link.download = currentImageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadZip = async () => {
    if (!hasImages || artImages.length === 0) return;

    const zip = new JSZip();
    const folderName = foundArtPiece
      ? `${foundArtPiece.id}_${foundArtPiece.name.replace(/[^\w\s]/gi, "")}`
      : `artwork_${id}`;

    const imagePromises = artImages.map(async (imageName) => {
      if (!imageName) return null;

      const imagePath = getImagePath(imageName);
      if (!imagePath) return null;

      try {
        const response = await fetch(imagePath);
        const blob = await response.blob();
        return { name: imageName, blob };
      } catch (error) {
        return null;
      }
    });

    try {
      const results = await Promise.all(imagePromises);

      results.forEach((result) => {
        if (result) {
          zip.file(result.name, result.blob);
        }
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Failed to create ZIP file:", error);
    }
  };

  const currentImageSrc = useCallback(() => {
    if (
      !hasImages ||
      !artImages ||
      artImages.length === 0 ||
      !artImages[slideIndex - 1]
    ) {
      return "";
    }
    return getImagePath(artImages[slideIndex - 1]);
  }, [artImages, slideIndex, hasImages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 rounded-xl bg-[var(--accent-color)]/20">
        <p className="text-[var(--text-color)] opacity-70 animate-pulse">
          Loading images...
        </p>
      </div>
    );
  }

  if (!hasImages || artImages.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 rounded-xl bg-[var(--accent-color)]/20">
        <p className="text-[var(--text-color)] opacity-70">
          No images available for this exhibit.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="bg-[var(--accent-color)]/20 rounded-xl p-4 sm:p-6 h-full">
        {/* Image Container with ARIA attributes for accessibility */}
        <div
          ref={carouselRef}
          className="relative max-w-[500px] mx-auto"
          role="region"
          aria-roledescription="carousel"
          aria-label="Image gallery"
          tabIndex={0}
          onKeyDown={handleCarouselKeyDown}
        >
          <div className="flex justify-center items-center">
            {artImages.map((imageName, index) => (
              <div
                key={index}
                className="w-full"
                style={{ display: index === slideIndex - 1 ? "block" : "none" }}
                ref={(el) => (slideRefs.current[index] = el)}
                role="group"
                aria-roledescription="slide"
                aria-label={`Image ${index + 1} of ${artImages.length}`}
              >
                <div className="rounded-lg overflow-hidden shadow-lg">
                  {failedImages.has(index) ? (
                    <div className="aspect-square bg-[var(--accent-color)]/30 flex items-center justify-center rounded-lg">
                      <span className="text-[var(--text-color)]/50 text-center px-4">
                        Image unavailable
                      </span>
                    </div>
                  ) : (
                    imageName && (
                      <img
                        src={getImagePath(imageName)}
                        alt={`Art piece ${index + 1}`}
                        className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setModalOpen(true)}
                        onError={() => {
                          setFailedImages((prev) => new Set(prev).add(index));
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Slide counter with aria-live for screen readers */}
          <span className="sr-only" aria-live="polite">
            Showing image {slideIndex} of {artImages.length}
          </span>

          {/* Navigation Arrows - increased touch targets (min 44px) */}
          {artImages.length > 1 && (
            <>
              <button
                className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2
                           w-11 h-11 sm:w-10 sm:h-10 rounded-full
                           bg-black/50 hover:bg-black/70
                           text-white flex items-center justify-center
                           transition-colors duration-200"
                onClick={() => pushSlides(-1)}
                aria-label={`Previous image, currently on ${slideIndex} of ${artImages.length}`}
              >
                ‹
              </button>
              <button
                className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2
                           w-11 h-11 sm:w-10 sm:h-10 rounded-full
                           bg-black/50 hover:bg-black/70
                           text-white flex items-center justify-center
                           transition-colors duration-200"
                onClick={() => pushSlides(1)}
                aria-label={`Next image, currently on ${slideIndex} of ${artImages.length}`}
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Dot Indicators */}
        {artImages.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {artImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  slideIndex === index + 1
                    ? "bg-[var(--button-color)] scale-110"
                    : "bg-[var(--text-color)]/30 hover:bg-[var(--text-color)]/50"
                }`}
                onClick={() => setSlideIndex(index + 1)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Download Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-lg
                       bg-[var(--button-color)] hover:bg-[var(--accent-color)]
                       text-[var(--button-text-color)] font-medium
                       transition-colors duration-200
                       flex items-center gap-2"
            onClick={handleDownload}
            aria-label="Download current image"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Image
          </button>
          {artImages.length > 1 && (
            <button
              className="px-4 py-2 rounded-lg
                         bg-[var(--accent-color)] hover:bg-[var(--button-color)]
                         text-[var(--text-color)] font-medium
                         transition-colors duration-200
                         flex items-center gap-2"
              onClick={handleDownloadZip}
              aria-label="Download all images as ZIP file"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              Download All (ZIP)
            </button>
          )}
        </div>
      </div>

      {/* Modal with accessibility improvements */}
      {modalOpen && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged image view"
        >
          <div className="relative max-w-[90vw] max-h-[90vh] safe-area-inset">
            {currentImageSrc() && (
              <img
                src={currentImageSrc()}
                alt={`Enlarged artwork - image ${slideIndex} of ${artImages.length}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
                role="img"
              />
            )}

            {/* Close Button - increased touch target */}
            <button
              ref={closeButtonRef}
              className="absolute -top-4 -right-4 w-11 h-11 rounded-full
                         bg-white text-black flex items-center justify-center
                         hover:bg-gray-200 transition-colors duration-200
                         text-xl font-bold shadow-lg"
              onClick={() => setModalOpen(false)}
              aria-label="Close enlarged image view"
            >
              ×
            </button>

            {/* Modal Navigation - increased touch targets */}
            {artImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                <button
                  className="w-12 h-12 rounded-full bg-white/90 hover:bg-white
                             text-black flex items-center justify-center
                             transition-colors duration-200 text-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    pushSlides(-1);
                  }}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <div
                  className="flex items-center px-4 bg-white/90 rounded-full text-black font-medium"
                  aria-live="polite"
                >
                  {slideIndex} / {artImages.length}
                </div>
                <button
                  className="w-12 h-12 rounded-full bg-white/90 hover:bg-white
                             text-black flex items-center justify-center
                             transition-colors duration-200 text-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    pushSlides(1);
                  }}
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;
