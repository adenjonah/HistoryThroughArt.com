import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Exhibit.css";
import artPiecesData from "../../data/artworks.json";
import "./PhotoSelectorIcons";
import PhotoSelectorIcons from "./PhotoSelectorIcons";

const images = require.context("../../artImages", false, /\.webp$/);

// Default fallback image
const FALLBACK_IMAGE = "placeholder.webp"; // Create this placeholder image if it doesn't exist

function PhotoGallery({ id }) {
  const [artImages, setArtImages] = useState([]);
  const [slideIndex, setSlideIndex] = useState(1);
  const slideRefs = useRef([]);
  const [modalDimensions, setModalDimensions] = useState({
    width: "90%",
    height: "auto",
  });

  const [modalStyle, setModalStyle] = useState("none");
  const [hasImages, setHasImages] = useState(true);

  const vhPercentModalImage = 70;

  // Opens the modal (makes the image larger)
  const openModal = (imageName) => {
    if (!imageName) {
      console.warn("Attempted to open modal with undefined image");
      return; // Exit early if the image is undefined
    }
    
    const img = new Image();
    img.src = getImagePath(imageName);
    
    // Calculate the desired height (70% of viewport height)
    const desiredHeight = window.innerHeight * (vhPercentModalImage / 100);

    // Calculate the width based on the aspect ratio
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const calculatedWidth = desiredHeight * aspectRatio;

    // Now update the modal dimensions with the calculated width
    setModalDimensions({
      width: `${Math.min(calculatedWidth, window.innerWidth)}px`, // Ensure the image doesn't exceed the viewport width
      height: `${desiredHeight}px`,
    });
    setModalStyle("block");
  };

  // Close modal
  const closeModal = () => {
    setModalStyle("none");
  };

  const getImagePath = (imageName) => {
    if (!imageName) {
      console.error("Cannot find image: undefined");
      return ""; // Return empty string for undefined images
    }
    
    try {
      return images(`./${imageName}`);
    } catch (e) {
      console.error(`Cannot find image: ${imageName}`);
      
      // Try to return a fallback image if available
      try {
        return images(`./${FALLBACK_IMAGE}`);
      } catch (fallbackError) {
        return ""; // If even fallback fails, return empty string
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
      console.warn(`No images found for art piece with ID: ${id}`);
      setArtImages([]);
      setHasImages(false);
    }
  }, [id]);

  const showSlides = useCallback(
    (n) => {
      if (slideRefs.current.length === 0 || !hasImages) return;

      let i;
      let newIndex = n;
      
      if (n > slideRefs.current.length) {
        newIndex = 1;
      } else if (n < 1) {
        newIndex = slideRefs.current.length;
      }
      
      setSlideIndex(newIndex);

      for (i = 0; i < slideRefs.current.length; i++) {
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
    return () => {
      if (hasImages && artImages.length > 0) {
        showSlides(slideIndex + n);
      }
    };
  };

  const handleDownload = () => {
    if (!hasImages || artImages.length === 0 || !artImages[slideIndex - 1]) {
      console.warn("Cannot download: no valid image");
      return;
    }
    
    const currentImageName = artImages[slideIndex - 1];
    const imagePath = getImagePath(currentImageName);
    
    if (!imagePath) {
      console.warn("Cannot download: image path is empty");
      return;
    }

    const link = document.createElement("a");
    link.href = imagePath;
    link.download = currentImageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const currentImageSrc = useCallback(() => {
    if (!hasImages || !artImages || artImages.length === 0 || !artImages[slideIndex - 1]) {
      return ""; // Return empty string if no valid image
    }
    return getImagePath(artImages[slideIndex - 1]);
  }, [artImages, slideIndex, hasImages]);

  useEffect(() => {
    if (!hasImages || !artImages || artImages.length === 0) {
      return; // Skip if no images available
    }
    
    const currentImage = artImages[slideIndex - 1];
    if (!currentImage) {
      return; // Skip if current image is undefined
    }
    
    const imgSrc = getImagePath(currentImage);
    if (!imgSrc) {
      return; // Skip if image path is empty
    }
    
    const img = new Image();
    img.src = imgSrc;
    
    img.onload = () => {
      // Calculate the desired height (70% of viewport height)
      const desiredHeight = window.innerHeight * 0.7;

      // Calculate the width based on the aspect ratio
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const calculatedWidth = desiredHeight * aspectRatio;

      // Now update the modal dimensions with the calculated width
      setModalDimensions({
        width: `${Math.min(calculatedWidth, window.innerWidth)}px`, // Ensure the image doesn't exceed the viewport width
        height: `${desiredHeight}px`,
      });
    };
  }, [slideIndex, artImages, hasImages]);

  // If there are no images, show a message
  if (!hasImages || artImages.length === 0) {
    return (
      <div className="w3-container w3-center p-4">
        <p className="w3-text-grey">No images available for this exhibit.</p>
      </div>
    );
  }

  return (
    <div className="w3-container w3-center">
      <div className="w3-display-container image-container">
        <div className="image-wrapper">
          {artImages.map((imageName, index) => (
            <div
              key={index}
              className="image-slide"
              style={{
                display: index === slideIndex - 1 ? "block" : "none",
              }}
              ref={(el) => (slideRefs.current[index] = el)}
            >
              {/* Wrapper with rounded border */}
              <div className="rounded-lg border border-transparent overflow-hidden inline-block">
                {imageName && (
                  <img
                    src={getImagePath(imageName)}
                    alt={`Art piece ${index + 1}`}
                    className="w3-image image"
                    onClick={() => openModal(imageName)}
                    onError={(e) => {
                      console.warn(`Error loading image: ${imageName}`);
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <PhotoSelectorIcons
        artImages={artImages}
        slideIndex={slideIndex}
        setSlideIndex={setSlideIndex}
        pushSlides={pushSlides}
      />
      <div className="w3-padding-top">
        <button
          className="w3-button w3-blue w3-ripple"
          onClick={handleDownload}
        >
          Download Image
        </button>
      </div>

      {/* Modal */}
      <div
        id="modal01"
        className={`w3-modal`}
        onClick={closeModal}
        style={{ display: modalStyle }}
      >
        <div className="w3-modal-content-custom modal-content">
          {currentImageSrc() && (
            <img
              id="img01"
              className="w3-animate-zoom modal-image"
              src={currentImageSrc()}
              alt="Modal Art"
              style={{
                maxHeight: `${vhPercentModalImage}vh`, // 70% of the viewport height
                minWidth: modalDimensions.width,
              }}
              onClick={handleModalClick}
              onError={(e) => {
                console.warn(`Error loading modal image`);
                closeModal();
              }}
            />
          )}
        </div>
        <div className="w3-container w3-bottom">
          <div
            className="w3-bar"
            onClick={handleModalClick}
            style={{ minWidth: "100px" }}
          >
            <PhotoSelectorIcons
              artImages={artImages}
              slideIndex={slideIndex}
              setSlideIndex={setSlideIndex}
              pushSlides={pushSlides}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoGallery;
