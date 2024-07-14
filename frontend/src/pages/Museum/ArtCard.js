import React, {useEffect, useState} from 'react';
import Card from './Card';

function ArtCard({artPiecesArray, search, setArtPiecesArray}) {

    const [imagesArray, setImagesArray] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/museum')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setArtPiecesArray(data))
            .catch(error => console.error('Error:', error));
    }, [setArtPiecesArray]);

    useEffect(() => {
        fetch('http://localhost:5001/museum-images')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setImagesArray(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const filteredArtPieces = artPiecesArray.filter((item) => {
        return item.name.toLowerCase().includes(search.toLowerCase())
            || item.artist_culture.toLowerCase().includes(search.toLowerCase())
            || item.location.toLowerCase().includes(search.toLowerCase())
            || item.id.toString().toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div>
            {filteredArtPieces.map((item, index) => (
                <Card key={index} item={item} imagesArray={imagesArray} />
            ))}
        </div>
    );
}

export default ArtCard;