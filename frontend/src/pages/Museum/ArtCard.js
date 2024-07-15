import React from 'react';
import { useNavigate } from "react-router-dom";

const images = require.context('../../artImages', false, /\.png$/);

const getImagePath = (imageName) => {
    try {
        return images(`./${imageName}`);
    } catch (e) {
        console.error(`Cannot find image: ${imageName}`);
        return '';
    }
};

function ArtCard({ item, imagesArray }) {
    const navigate = useNavigate();

    // Get the first image for the item
    const imageItem = imagesArray.find(image => image.id === item.id);

    return (
        <div className='w3-panel w3-card artCard w3-hover-shadow w3-hover-opacity' onClick={() => navigate(`/exhibit?id=${item.id}`)}>
            <div className='spotlight-container'>
                {imageItem && <img className='spotlight-image' src={getImagePath(imageItem.image)} alt="Art Piece"></img>}
            </div>
            <div className='identifier'>
                <h3>{item.name}</h3>
                <div>ID: {item.id}</div>
                {item.artist_culture !== "None" && <div>Artist/Culture: {item.artist_culture}</div>}
                {item.location !== "None" && <div>Location: {item.location}</div>}
            </div>
        </div>
    );
}

export default ArtCard;