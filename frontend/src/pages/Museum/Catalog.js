import React, { useEffect, useState } from 'react';
import Card from './ArtCard';

function Catalog({ search, setArtPiecesArray, layout, sort, unitFilters }) {
    const [imagesArray, setImagesArray] = useState([]);
    const [currPageNumber, setCurrPageNumber] = useState(1);
    const [prevPageNumber, setPrevPageNumber] = useState(1);
    const [isSearchEmpty, setIsSearchEmpty] = useState(true);
    const [fullArtPiecesArray, setFullArtPiecesArray] = useState([]);
    const [artPiecesArray, setLocalArtPiecesArray] = useState([]);

    //Call to get art piece information
    useEffect(() => {
        fetch('http://localhost:5001/museum')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setFullArtPiecesArray(data)
                setLocalArtPiecesArray(data);
            })
            .catch(error => console.error('Error:', error));


    }, []);

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
    setArtPiecesArray(fullArtPiecesArray);


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

        const scrollTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        scrollTop();
        if(isSearchEmpty) { //If search is empty set previous page number to current page number
            setPrevPageNumber(currPageNumber);
        }
        setCurrPageNumber(pageNum); //Change current page to selected page


    };

    // Filter art pieces based on search and filters
    useEffect(() => {

        // Filter based on search bar input
        let filteredArtPieces = fullArtPiecesArray.filter((item) => {
            return item.name.toLowerCase().includes(search.toLowerCase())
                || item.artist_culture.toLowerCase().includes(search.toLowerCase())
                || item.location.toLowerCase().includes(search.toLowerCase())
                || item.id.toString().toLowerCase().includes(search.toLowerCase());
        });

        switch (sort) {
            case 'Name Descending':
                filteredArtPieces.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1);
                break;
            case 'Name Ascending':
                filteredArtPieces.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
                break;
            case 'Unit Descending':
                filteredArtPieces.sort((a, b) => a.unit < b.unit ? 1 : -1);
                break;
            case 'Unit Ascending':
                filteredArtPieces.sort((a, b) => a.unit > b.unit ? 1 : -1);
                break;
            case 'ID Descending':
                filteredArtPieces.sort((a, b) => a.id < b.id ? 1 : -1);
                break;
            case 'ID Ascending':
                filteredArtPieces.sort((a, b) => a.id > b.id ? 1 : -1);
                break;
            default:
                filteredArtPieces.sort((a, b) => a.id > b.id ? 1 : -1);
        }

        // Filter based on unit filters
        if (!Object.values(unitFilters).every(value => value === false)) {
            filteredArtPieces = filteredArtPieces.filter((item) => unitFilters[`unit${item.unit}`]);
        }

        setLocalArtPiecesArray(filteredArtPieces);
        setArtPiecesArray(filteredArtPieces);

        if(currPageNumber > Math.ceil(filteredArtPieces.length / itemsPerPage)){
            setCurrPageNumber(1);
        }

        // eslint-disable-next-line
    }, [search, sort, unitFilters, fullArtPiecesArray]);


    return (
        <div>
            <div className={`catalog ${layout}`}>
                {currentArtPieces.map((item, index) => (
                    <Card key={index} className={`artCard ${layout}`} item={item} imagesArray={imagesArray}
                          layout={layout}/>
                ))}

                {filteredArtPieces.length === 0 &&
                    <h3>No results found</h3>} {/*If no results are found display this message*/}
            </div>
            <div className="w3-bar">
                {[...Array(Math.ceil(filteredArtPieces.length / itemsPerPage)).keys()].map(pageNum => ( //This is confusing :|
                    <a key={pageNum} href={`#${pageNum + 1}`}
                       className={`w3-button w3-margin-left ${currPageNumber === pageNum + 1 ? "w3-blue" : "w3-light-gray"}`} //Change color of selected page number here
                       onClick={() => handlePageClick(pageNum + 1)}>
                        {pageNum + 1}
                    </a>
                ))}
            </div>
            <br/>
        </div>
    );
}

export default Catalog;
