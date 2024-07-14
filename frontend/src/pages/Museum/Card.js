import React from 'react';
import {useNavigate} from "react-router-dom";

const images = require.context('../../artImages', false, /\.png$/);

const getImagePath = (imageName) => {
    try {
        return images(`./${imageName}`);
    } catch (e) {
        console.error(`Cannot find image: ${imageName}`);
        return '';
    }
};

function Card({item, imagesArray}) {
    const navigate = useNavigate();

    return (
        <div className='w3-panel w3-card artCard w3-hover-shadow w3-hover-opacity' onClick={() => navigate(`/exhibit?id=${item.id}`)}>
            <div className='column'>
                {imagesArray.map((imageItem, index) => {
                    if (imageItem.id === item.id)
                        return <img className='images' src={getImagePath(imageItem.image)} key={index} alt="nope"></img>
                    return null;
                })}
            </div>
            <div className='column'>
                <h3>{item.name}</h3>
                <div>ID: {item.id}</div>
                {item.artist_culture !== "None" && <div>Artist/Culture: {item.artist_culture}</div>}
                {item.location !== "None" && <div>Location: {item.location}</div>}
                <p></p>
            </div>
        </div>
    );
}

export default Card;