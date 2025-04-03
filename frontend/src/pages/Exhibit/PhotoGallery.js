import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Exhibit.css";
import artPiecesData from "../../data/artworks.json";
import "./PhotoSelectorIcons";
import PhotoSelectorIcons from "./PhotoSelectorIcons";

const images = require.context("../../artImages", false, /\.webp$/);

function PhotoGallery({ id }) {
  const [artImages, setArtImages] = useState([]);
  const [slideIndex, setSlideIndex] = useState(1);
  const slideRefs = useRef([]);
  const [modalDimensions, setModalDimensions] = useState({
    width: "90%",
    height: "auto",
  });

  const [modalStyle, setModalStyle] = useState("none");

  const vhPercentModalImage = 70;

  // Opens the modal (makes the image larger)
  const openModal = (imageName) => {
    if (!imageName) {
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
    try {
      return images(`./${imageName}`);
    } catch (e) {
      console.error(`Cannot find image: ${imageName}`);
      return "";
    }
  };

  useEffect(() => {
    const foundArtPiece = artPiecesData.find(
      (piece) => piece.id.toString() === id
    );
    if (foundArtPiece && foundArtPiece.image) {
      setArtImages(foundArtPiece.image);
    }
  }, [id]);

  const showSlides = useCallback(
    (n) => {
      if (slideRefs.current.length === 0) return;

      let i;
      if (n > slideRefs.current.length) {
        setSlideIndex(1);
      } else if (n < 1) {
        setSlideIndex(slideRefs.current.length);
      } else {
        setSlideIndex(n);
      }

      for (i = 0; i < slideRefs.current.length; i++) {
        slideRefs.current[i].style.display = "none";
      }

      if (slideRefs.current[slideIndex - 1]) {
        slideRefs.current[slideIndex - 1].style.display = "block";
      }
    },
    [slideIndex]
  );

  useEffect(() => {
    showSlides(slideIndex);
  }, [slideIndex, artImages, showSlides]);

  const pushSlides = (n) => {
    return () => {
      showSlides(slideIndex + n);
    };
  };

  const handleDownload = () => {
    const currentImageName = artImages[slideIndex - 1];
    const imagePath = getImagePath(currentImageName);

    const link = document.createElement("a");
    link.href = imagePath;
    link.download = currentImageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleModalClick = (event) => {
    //openModal(artImages[slideIndex]);
    event.stopPropagation();
  };

  const currentImageSrc = useCallback(() => {
    return getImagePath(artImages[slideIndex - 1]);
  }, [artImages, slideIndex]); // Add the necessary dependencies here

  useEffect(() => {
    const img = new Image();
    img.src = currentImageSrc();
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
  }, [slideIndex, currentImageSrc]);

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
                <img
                  src={getImagePath(imageName)}
                  alt={`Art piece ${index + 1}`}
                  className="w3-image image"
                  onClick={() => openModal(imageName)}
                />
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
          />
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
