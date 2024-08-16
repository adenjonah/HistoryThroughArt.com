import React from 'react';
import { useNavigate } from "react-router-dom";

function ArtCard({ item, layout, image }) {
    const navigate = useNavigate();


    const formatDate = () => {
        let date = item.date.split('/');

        const toBCE = (date) => {
            return date.startsWith('-') ? (date.slice(1) + ' BCE') : date;
        }

        if (date.length === 2) {
            date[0] = toBCE(date[0]);
            date[1] = toBCE(date[1]);
            date = date.join(' - ');
        } else {
            date[0] = toBCE(date[0]);
            date = date[0];
        }

        return date;
    };

    //Uses the image property passed from Catalog to display the image
    return (
        <div
            className={`w3-card ArtCard w3-hover-shadow w3-hover-purple w3-margin w3-round-xlarge ${layout}`}
            onClick={() => navigate(`/exhibit?id=${item.id}`)}
        >
            <div className="spotlight-container">
                {item.image && (
                    <img
                        className='spotlight-image'
                        src={image.src}
                        alt={item.name}
                        loading={'lazy'}
                    />
                )}
            </div>
            <div className="identifier">
                <h3 className="w3-text-theme">{item.id}. {item.name}</h3>
                {item.artist_culture !== "None" && <div className="w3-medium">Artist/Culture: {item.artist_culture}</div>}
                {item.location !== "None" && <div className="w3-medium">Location Made: {item.location}</div>}
                {item.date !== "None" && <div className="w3-medium">Date: {formatDate()}</div>}
                <div className="w3-medium">Unit: {item.unit}</div>
            </div>
        </div>
    );
}

export default ArtCard;