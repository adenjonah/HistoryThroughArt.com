import React, { useEffect, useState, useRef } from 'react';
import './Exhibit.css';

const images = require.context('../../artImages', false, /\.png$/);

function Gallery({ id }) {
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
        fetch(`http://localhost:5001/exhibit-images?id=${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok - exhibit-images');
                }
                return response.json();
            })
            .then(data => setArtImages(data))
            .catch(error => console.error('Error:', error));
    }, [id]);

    useEffect(() => {
        showSlides(slideIndex);
    }, [slideIndex, artImages]);

    const showSlides = (n) => {
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
    };

    const pushSlides = (n) => {
        return () => {
            showSlides(slideIndex + n);
        };
    };

    return (
        <div className="gallery-container">
            {artImages.map((imageItem, index) => (
                <div className="image-container" key={index}>
                    <img
                        src={getImagePath(imageItem.image)}
                        alt="Art Image"
                        ref={(el) => (slideRefs.current[index] = el)}
                        style={{ display: index === 0 ? 'block' : 'none' }}
                    />
                </div>
            ))}
            {artImages.length > 1 && <a className="prev" onClick={pushSlides(-1)}>&#10094;</a>}
            {artImages.length > 1 && <a className="next" onClick={pushSlides(1)}>&#10095;</a>}
        </div>
    );
}

export default Gallery;
