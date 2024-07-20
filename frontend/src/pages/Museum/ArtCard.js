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

function ArtCard({ item, imagesArray, layout }) {
    const navigate = useNavigate();

    // Get the first image for the item
    const imageItem = imagesArray.find(image => image.id === item.id);

    //This formats date to BCE if necessary
    //We can also make it add CE if we wanted
    const formatDate = () => {
        let date = item.date.split('/');

        const toBCE = (date) => {
            return date.startsWith('-') ? (date.slice(1) + ' BCE') : date;
        }

        if(date.length === 2) {
            date[0] = toBCE(date[0]);
            date[1] = toBCE(date[1]);
            date = date.join(' - ');
        }
        else {
            date[0] = toBCE(date[0]);
            date = date[0];
        }

        return date;
    }


    return (
        <div className={`w3-panel w3-card artCard w3-hover-shadow w3-hover-opacity ${layout}`} onClick={() => navigate(`/exhibit?id=${item.id}`)}>
            <div className='spotlight-container'>
                {imageItem && <img className='spotlight-image' src={getImagePath(imageItem.image)} alt="Art Piece"></img>}
            </div>
            <div className='identifier'>
                <h3>{item.id}. {item.name}</h3>
                {layout !== 'table' && (
                    <>
                        {item.artist_culture !== "None" && <div>Artist/Culture: {item.artist_culture}</div>}
                        {item.location !== "None" && <div>Location Made: {item.location}</div>}
                        {item.date !== "None" && <div>Date: {formatDate()}</div>}
                        <div>Unit: {item.unit}</div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ArtCard;