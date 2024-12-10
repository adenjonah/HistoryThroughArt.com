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

  const openModal = (imageName) => {
    if (!imageName) return;
    const img = new Image();
    img.src = getImagePath(imageName);
    const desiredHeight = window.innerHeight * (vhPercentModalImage / 100);
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const calculatedWidth = desiredHeight * aspectRatio;
    setModalDimensions({
      width: `${Math.min(calculatedWidth, window.innerWidth)}px`,
      height: `${desiredHeight}px`,
    });
    setModalStyle("block");
  };

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
      if (n > slideRefs.current.length) setSlideIndex(1);
      else if (n < 1) setSlideIndex(slideRefs.current.length);
      else setSlideIndex(n);

      for (i = 0; i < slideRefs.current.length; i++) {
        slideRefs.current[i].style.display = "none";
      }

      if (slideRefs.current[slideIndex - 1]) {
        slideRefs.current[slideIndex - 1].style.display = "flex";
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
  }, [artImages, slideIndex]);

  useEffect(() => {
    const img = new Image();
    img.src = currentImageSrc();
    img.onload = () => {
      const desiredHeight = window.innerHeight * 0.7;
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const calculatedWidth = desiredHeight * aspectRatio;
      setModalDimensions({
        width: `${Math.min(calculatedWidth, window.innerWidth)}px`,
        height: `${desiredHeight}px`,
      });
    };
  }, [slideIndex, currentImageSrc]);

  return (
    <div className="w3-container w3-center border border-white">
      <div className="w3-display-container image-container">
        {/* Adjusted the wrapper and slide to use Tailwind for responsive design */}
        <div className="image-wrapper relative w-full h-[50vh] overflow-hidden">
          {artImages.map((imageName, index) => (
            <div
              key={index}
              className={`image-slide flex justify-center items-center w-full h-full ${
                index === slideIndex - 1 ? "" : "hidden"
              }`}
              ref={(el) => (slideRefs.current[index] = el)}
              style={{ display: index === slideIndex - 1 ? "flex" : "none" }}
            >
              <img
                src={getImagePath(imageName)}
                alt={`Art piece ${index + 1}`}
                className="max-h-full max-w-full object-contain m-auto"
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
          onClick={(e) => e.stopPropagation()}
        >
          <img
            id="img01"
            className="object-contain max-h-[70vh] max-w-[90vw] w-auto mx-auto"
            src={currentImageSrc()}
            alt="Modal Art"
            style={{
              display: modalStyle === "block" ? "block" : "none",
              margin: modalStyle === "block" ? "auto" : "0",
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
