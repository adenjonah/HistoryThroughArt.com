import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Exhibit.css";
import artPiecesData from "../../Data/artworks.json";
import "./PhotoSelectorIcons";
import PhotoSelectorIcons from "./PhotoSelectorIcons";

const images = require.context("../../artImages", false, /\.webp$/);

function PhotoGallery({ id }) {
  const [artImages, setArtImages] = useState([]);
  const [slideIndex, setSlideIndex] = useState(1);
  const slideRefs = useRef([]);
  const [, setModalDimensions] = useState({
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
    <div className="w3-container w3-center ">
      <div className="w3-display-container image-container">
        <div className="image-wrapper">
          {artImages.map((imageName, index) => (
            <div
              key={index}
              className="image-slide flex justify-center items-center h-full w-full"
              style={{
                display: index === slideIndex - 1 ? "flex" : "none",
              }}
              ref={(el) => (slideRefs.current[index] = el)}
            >
              <img
                src={getImagePath(imageName)}
                alt={`Art piece ${index + 1}`}
                className="max-h-full max-w-full object-contain mx-auto"
                onClick={() => openModal(imageName)}
              />
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

      <div
        id="modal01"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
          modalStyle === "block" ? "flex" : "hidden"
        }`}
        onClick={closeModal}
      >
        <div
          className="relative max-w-full max-h-full bg-white rounded shadow-lg p-4"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <img
            id="img01"
            className="object-contain max-h-[70vh] max-w-[90vw] w-auto"
            src={currentImageSrc()}
            alt="Modal Art"
            style={{
              display: modalStyle === "block" ? "block" : "none",
              margin: modalStyle === "block" ? "auto" : "0",
              transform: modalStyle === "block" ? "translate(0, 0)" : "none",
            }}
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
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
