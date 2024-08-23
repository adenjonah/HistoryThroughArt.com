import React, { useEffect, useState } from 'react';
import Card from './ArtCard';
import "./Catalog.css";
import artPiecesData from '../../Data/artworks.json';
const images = require.context('../../artImages', false, /\.webp$/);

function Catalog({ search, setArtPiecesArray, layout, sort, unitFilters, searchBy }) {
    const [currPageNumber, setCurrPageNumber] = useState(1);
    const [fullArtPiecesArray, setFullArtPiecesArray] = useState([]);
    const [artPiecesArray, setLocalArtPiecesArray] = useState([]);
    const [preloadedImages, setPreloadedImages] = useState([]);

    const getImagePath = (imageName) => {
        try {
            return images(`./${imageName}`);
        } catch (e) {
            console.error(`Cannot find image: ${imageName}`);
            return '';
        }
    };
    // Load the artworks data from the JSON file
    useEffect(() => {

        //Loads all images and puts them into an array
        const preloadImages = () => {
            const image = artPiecesData.map(item => {
                const img = new Image();
                img.src = getImagePath(item.image[0]);
                return img;
            });
            setPreloadedImages(image);
        };

        preloadImages();
        setFullArtPiecesArray(artPiecesData);
        setLocalArtPiecesArray(artPiecesData);
    }, []);



    const parseYear = (date) => {
        return date.replace(/[bce]/gi, '').trim();
    }


    useEffect(() => {
        let filteredArtPieces = fullArtPiecesArray.filter(item => {
            const transcriptText = item.transcript ? item.transcript.map(t => t.text).join(' ').toLowerCase() : '';

            switch(searchBy) {
                case 'name': return item.name.toLowerCase().includes(search.toLowerCase());
                case 'id': return item.id.toString().toLowerCase().includes(search.toLowerCase());
                case 'artist/culture': return item.artist_culture.toLowerCase().includes(search.toLowerCase());
                case 'medium': return item.materials.toLowerCase().includes(search.toLowerCase());
                case 'year': return item.date.toLowerCase().includes(parseYear(search.toLowerCase()));
                case 'location': return item.location.toLowerCase().includes(search.toLowerCase());
                default:
                    return item.name.toLowerCase().includes(search.toLowerCase())
                        || item.artist_culture.toLowerCase().includes(search.toLowerCase())
                        || item.location.toLowerCase().includes(search.toLowerCase())
                        || item.id.toString().toLowerCase().includes(search.toLowerCase())
                        || item.date.toLowerCase().includes(parseYear(search.toLowerCase()))
                        || item.materials.toLowerCase().includes(search.toLowerCase())
                        || transcriptText.includes(search.toLowerCase());

            }

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
    }, [search, sort, unitFilters, fullArtPiecesArray, currPageNumber, setArtPiecesArray, searchBy]);

    //Changes the page number
    const handlePageClick = pageNum => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrPageNumber(pageNum);
    };

    const itemsPerPage = 50;
    const startIndex = (currPageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentArtPieces = artPiecesArray.slice(startIndex, endIndex);

    //Passes the image index to the Card component
    return (
        <div>
            <div className="w3-row-padding">
                {currentArtPieces.map((item, index) => (
                    <div key={index} className="w3-col s12 m6 l4">
                        <Card
                            item={item}
                            layout={layout}
                            image={preloadedImages[item.id - 1]}
                            search={search.toLowerCase()}
                        />
                    </div>
                ))}
                {artPiecesArray.length === 0 && <p className={`blurb`}>No results found</p>}
            </div>
            <div className="w3-bar">
                {[...Array(Math.ceil(artPiecesArray.length / itemsPerPage)).keys()].map(pageNum => (
                    <a
                        key={pageNum}
                        href={`#${pageNum + 1}`}
                        className={`w3-button w3-margin-left ${currPageNumber === pageNum + 1 ? "w3-blue" : "w3-light-gray"}`}
                        onClick={() => handlePageClick(pageNum + 1)}
                    >
                        {pageNum + 1}
                    </a>
                ))}
            </div>
            <br />
        </div>
    );

}

export default Catalog;