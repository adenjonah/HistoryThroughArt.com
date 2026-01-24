import React, { useEffect, useState, useRef, useCallback } from "react";
import artPiecesData from "../../data/artworks.json";
import JSZip from "jszip";

const images = require.context("../../artImages", false, /\.webp$/);

const FALLBACK_IMAGE = "placeholder.webp";

function PhotoGallery({ id }) {
  const [artImages, setArtImages] = useState([]);
  const [slideIndex, setSlideIndex] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasImages, setHasImages] = useState(true);
  const slideRefs = useRef([]);

  const getImagePath = (imageName) => {
    if (!imageName) {
      return "";
    }
    try {
      return images(`./${imageName}`);
    } catch (e) {
      try {
        return images(`./${FALLBACK_IMAGE}`);
      } catch (fallbackError) {
        return "";
      }
    }
  };

  useEffect(() => {
    const foundArtPiece = artPiecesData.find(
      (piece) => piece.id.toString() === id
    );

    if (foundArtPiece && foundArtPiece.image && foundArtPiece.image.length > 0) {
      setArtImages(foundArtPiece.image);
      setHasImages(true);
    } else {
      setArtImages([]);
      setHasImages(false);
    }
  }, [id]);

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

  const pushSlides = (n) => {
    if (hasImages && artImages.length > 0) {
      showSlides(slideIndex + n);
    }
  };

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
    const foundArtPiece = artPiecesData.find(
      (piece) => piece.id.toString() === id
    );
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
        {/* Image Container */}
        <div className="relative max-w-[500px] mx-auto">
          <div className="flex justify-center items-center">
            {artImages.map((imageName, index) => (
              <div
                key={index}
                className="w-full"
                style={{ display: index === slideIndex - 1 ? "block" : "none" }}
                ref={(el) => (slideRefs.current[index] = el)}
              >
                <div className="rounded-lg overflow-hidden shadow-lg">
                  {imageName && (
                    <img
                      src={getImagePath(imageName)}
                      alt={`Art piece ${index + 1}`}
                      className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setModalOpen(true)}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {artImages.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2
                           w-10 h-10 rounded-full
                           bg-black/50 hover:bg-black/70
                           text-white flex items-center justify-center
                           transition-colors duration-200"
                onClick={() => pushSlides(-1)}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2
                           w-10 h-10 rounded-full
                           bg-black/50 hover:bg-black/70
                           text-white flex items-center justify-center
                           transition-colors duration-200"
                onClick={() => pushSlides(1)}
                aria-label="Next image"
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
                       bg-blue-600 hover:bg-blue-700
                       text-white font-medium
                       transition-colors duration-200
                       flex items-center gap-2"
            onClick={handleDownload}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
                         bg-purple-600 hover:bg-purple-700
                         text-white font-medium
                         transition-colors duration-200
                         flex items-center gap-2"
              onClick={handleDownloadZip}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            {currentImageSrc() && (
              <img
                src={currentImageSrc()}
                alt="Enlarged artwork"
                className="max-w-full max-h-[85vh] object-contain rounded-lg animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Close Button */}
            <button
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full
                         bg-white text-black flex items-center justify-center
                         hover:bg-gray-200 transition-colors duration-200
                         text-xl font-bold shadow-lg"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Modal Navigation */}
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
                >
                  ‹
                </button>
                <div className="flex items-center px-4 bg-white/90 rounded-full text-black font-medium">
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
