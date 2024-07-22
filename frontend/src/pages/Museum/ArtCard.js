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
        <div
            className={`w3-card ArtCard w3-hover-shadow w3-hover-purple w3-margin w3-round-xlarge w3-padding-32 ${layout}`}
            onClick={() => navigate(`/exhibit?id=${item.id}`)}>
            <div className="w3-row">
                <div className="w3-col s12 m5 l4 w3-display-container w3-padding-small">
                    {imageItem &&
                        <img className='w3-image w3-round-xlarge' src={getImagePath(imageItem.image)} alt="Art Piece"/>}
                </div>
                <div className="w3-col s12 m6 l8 w3-container">
                    <h3 className="w3-text-theme">{item.id}. {item.name}</h3>
                    <>
                        {item.artist_culture !== "None" &&
                            <div className="w3-medium">Artist/Culture: {item.artist_culture}</div>}
                        {item.location !== "None" && <div className="w3-medium">Location Made: {item.location}</div>}
                        {item.date !== "None" && <div className="w3-medium">Date: {formatDate()}</div>}
                        <div className="w3-medium">Unit: {item.unit}</div>
                    </>
                </div>
            </div>
        </div>
    );
}

export default ArtCard;