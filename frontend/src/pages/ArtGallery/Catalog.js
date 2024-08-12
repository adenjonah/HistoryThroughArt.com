import React, { useEffect, useState } from 'react';
import Card from './ArtCard';
import "./Catalog.css"

function Catalog({ search, setArtPiecesArray, layout, sort, unitFilters }) {
    const [imagesArray, setImagesArray] = useState([]);
    const [currPageNumber, setCurrPageNumber] = useState(1);
    const [fullArtPiecesArray, setFullArtPiecesArray] = useState([]);
    const [artPiecesArray, setLocalArtPiecesArray] = useState([]);

    useEffect(() => {
        fetch('https://apah-server.vercel.app/museum')
            .then(response => response.json())
            .then(data => {
                setFullArtPiecesArray(data);
                setLocalArtPiecesArray(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    if(fullArtPiecesArray.length > 0) {
        console.log(fullArtPiecesArray);
    }
    // console.log(fullArtPiecesArray);

    useEffect(() => {
        fetch('http://localhost:5001/museum-images')
            .then(response => response.json())
            .then(data => setImagesArray(data))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        let filteredArtPieces = fullArtPiecesArray.filter(item => {
            const transcriptText = item.transcript ? item.transcript.map(t => t.text).join(' ').toLowerCase() : '';
            return item.name.toLowerCase().includes(search.toLowerCase())
                || item.artist_culture.toLowerCase().includes(search.toLowerCase())
                || item.location.toLowerCase().includes(search.toLowerCase())
                || item.id.toString().toLowerCase().includes(search.toLowerCase())
                || transcriptText.includes(search.toLowerCase());
        }).sort((a, b) => {
            switch (sort) {
                case 'Name Descending': return b.name.localeCompare(a.name);
                case 'Name Ascending': return a.name.localeCompare(b.name);
                case 'Unit Descending': return b.unit - a.unit;
                case 'Unit Ascending': return a.unit - b.unit;
                case 'ID Descending': return b.id - a.id;
                case 'ID Ascending': return a.id - b.id;
                default: return a.id - b.id;
            }
        });

        if (!Object.values(unitFilters).every(value => !value)) {
            filteredArtPieces = filteredArtPieces.filter(item => unitFilters[`unit${item.unit}`]);
        }

        setLocalArtPiecesArray(filteredArtPieces);
        setArtPiecesArray(filteredArtPieces);

        if (currPageNumber > Math.ceil(filteredArtPieces.length / itemsPerPage)) {
            setCurrPageNumber(1);
        }
    }, [search, sort, unitFilters, fullArtPiecesArray, currPageNumber, setArtPiecesArray]);

    const handlePageClick = pageNum => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrPageNumber(pageNum);
    };

    const itemsPerPage = 50;
    const startIndex = (currPageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentArtPieces = artPiecesArray.slice(startIndex, endIndex);

    return (
        <div>
            <div className={`catalog ${layout}`}>
                {currentArtPieces.map((item, index) => (
                    <Card key={index} item={item} imagesArray={imagesArray} layout={layout} />
                ))}
                {artPiecesArray.length === 0 && <h3>No results found</h3>}
            </div>
            <div className="w3-bar">
                {[...Array(Math.ceil(artPiecesArray.length / itemsPerPage)).keys()].map(pageNum => (
                    <a key={pageNum} href={`#${pageNum + 1}`} className={`w3-button w3-margin-left ${currPageNumber === pageNum + 1 ? "w3-blue" : "w3-light-gray"}`} onClick={() => handlePageClick(pageNum + 1)}>
                        {pageNum + 1}
                    </a>
                ))}
            </div>
            <br />
        </div>
    );
}

export default Catalog;