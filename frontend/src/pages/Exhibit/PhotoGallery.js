import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Exhibit.css';
import artPiecesData from '../../Data/artworks.json'; // Import the JSON data

const images = require.context('../../artImages', false, /\.webp$/);

function PhotoGallery({ id }) {
    const [artImages, setArtImages] = useState([]);
    const [slideIndex, setSlideIndex] = useState(1);
    const slideRefs = useRef([]);

    const getImagePath = (imageName) => {
        try {
            return images(`./${imageName}`);
        } catch (e) {
            console.error(`Cannot find image: ${imageName}`);
            return '';
        }
    };

    useEffect(() => {
        // Find the relevant art piece by ID and extract its images
        const foundArtPiece = artPiecesData.find(piece => piece.id.toString() === id);
        if (foundArtPiece && foundArtPiece.image) {
            setArtImages(foundArtPiece.image);
        }
    }, [id]);

    const showSlides = useCallback((n) => {
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
            slideRefs.current[i].style.display = 'none';
        }

        if (slideRefs.current[slideIndex - 1]) {
            slideRefs.current[slideIndex - 1].style.display = 'block';
        }
    }, [slideIndex]);

    useEffect(() => {
        showSlides(slideIndex);
    }, [slideIndex, artImages, showSlides]);

    const pushSlides = (n) => {
        return () => {
            showSlides(slideIndex + n);
        };
    };

    return (
        <div className="w3-container w3-center">
            <div className="w3-display-container image-container">
                <div className={'image-wrapper'}>
                    {artImages.map((imageName, index) => (
                        <div key={index} className={'image-slide'} style={{
                            display: index === slideIndex - 1 ? 'block' : 'none'}}
                             ref={(el) => (slideRefs.current[index] = el)}>
                            <img
                                src={getImagePath(imageName)}
                                alt={`Art piece ${index + 1}`}
                                className="w3-image image"
                            />
                        </div>
                    ))}
                </div>
                {artImages.length > 1 && (
                    <div className={'selection-buttons-wrapper'}>
                        <div className={'selection-buttons'}>
                            <button className="w3-button w3-light-grey w3-ripple" onClick={pushSlides(-1)}>&#10094;</button>
                            <button className="w3-button w3-light-grey w3-ripple" onClick={pushSlides(1)}>&#10095;</button>
                        </div>
                    </div>
                )}
            </div>
            {artImages.length > 1 && (
                <div className="w3-center w3-padding-top">
                    {artImages.map((imageName, index) => (
                        <span
                            key={index}
                            className={`w3-badge ${slideIndex === index + 1 ? 'w3-blue' : 'w3-light-gray'}`}
                            style={{
                                cursor: 'pointer',
                                margin: '10px 5px',
                                width: '15px',
                                height: '15px',
                                lineHeight: '15px'
                            }}
                            onClick={() => setSlideIndex(index + 1)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default PhotoGallery;