import React, { useEffect, useState } from 'react';
import Card from './ArtCard';

function Catalog({ artPiecesArray, search, setArtPiecesArray, layout }) {
    const [imagesArray, setImagesArray] = useState([]);
    const [currPageNumber, setCurrPageNumber] = useState(1);
    const [prevPageNumber, setPrevPageNumber] = useState(1);
    const [isSearchEmpty, setIsSearchEmpty] = useState(true);

    //Call to get art piece information
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

    //Call to get image names
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

    //Filter out the search from search bar
    const filteredArtPieces = artPiecesArray.filter((item) => {
        return item.name.toLowerCase().includes(search.toLowerCase())
            || item.artist_culture.toLowerCase().includes(search.toLowerCase())
            || item.location.toLowerCase().includes(search.toLowerCase())
            || item.id.toString().toLowerCase().includes(search.toLowerCase());
    });

    const itemsPerPage = 50;
    const startIndex = (currPageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentArtPieces = filteredArtPieces.slice(startIndex, endIndex);

    useEffect(() => {
        if (search.trim() === '') { //If search is empty

            setCurrPageNumber(prevPageNumber);
            setIsSearchEmpty(true); //The search is empty

        } else {

            if(isSearchEmpty){ //If search is empty set the previous page number to the current
                setPrevPageNumber(currPageNumber);
            }
            setIsSearchEmpty(false); //Change that the search is full.
            //We never want to change the prev page number when the search is full.

            setCurrPageNumber(1); //Go to the first page of the searched elements
        }
        //This disables a stupid warning:
        // eslint-disable-next-line
    }, [search]);

    
    const handlePageClick = (pageNum) => {

        if(isSearchEmpty) { //If search is empty set previous page number to current page number
            setPrevPageNumber(currPageNumber);
        }
        setCurrPageNumber(pageNum); //Change current page to selected page


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
                {[...Array(Math.ceil(filteredArtPieces.length / itemsPerPage)).keys()].map(pageNum => ( //This is confusing :|
                    <a key={pageNum} href={`#${pageNum + 1}`}
                       className={`w3-button ${currPageNumber === pageNum + 1 ? "w3-grey" : ""}`} //Change color of selected page number here
                       onClick={() => handlePageClick(pageNum + 1)}>
                        {pageNum + 1}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default Catalog;
