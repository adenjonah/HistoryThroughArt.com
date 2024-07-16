import React, { useEffect, useState } from 'react';
import Card from './ArtCard';

function Catalog({ artPiecesArray, search, setArtPiecesArray, layout }) {
    const [imagesArray, setImagesArray] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [prevPageNumber, setPrevPageNumber] = useState(1);

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

    const itemsPerPage = 50; // Set your items per page here
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentArtPieces = filteredArtPieces.slice(startIndex, endIndex);

    useEffect(() => {
        if (search.trim() === '') {
            setPageNumber(prevPageNumber);
        } else {
            setPrevPageNumber(pageNumber);
            setPageNumber(1);
        }
    }, [search]);




    console.log(currentArtPieces.length);
    const handlePageClick = (pageNum) => {
        setPageNumber(pageNum);
        setPrevPageNumber(pageNumber);
    };

    return (
        <div>
            <div className={`catalog ${layout}`}>
                {currentArtPieces.map((item, index) => (
                    <Card key={index} className={`artCard ${layout}`} item={item} imagesArray={imagesArray} layout={layout} />
                ))}

                {filteredArtPieces.length === 0 && <h3>No results found</h3>}
            </div>
            <div className="w3-bar">
                {[...Array(Math.ceil(filteredArtPieces.length / itemsPerPage)).keys()].map(pageNum => (
                    <a key={pageNum} href={`#${pageNum + 1}`} className="w3-button" onClick={() => handlePageClick(pageNum + 1)}>
                        {pageNum + 1}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default Catalog;
