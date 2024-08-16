import React, { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import PhotoGallery from "./PhotoGallery";
import MapBox from "../Map/MapBox";
import artPiecesData from '../../Data/artworks.json'; // Import the JSON data

function Exhibit() {

    const [artPiece, setArtPiece] = useState(null); // Initialize as null to handle loading state


    // Gets the parameter in the search query
    const urlParam = new URLSearchParams(window.location.search);
    const exhibitID = urlParam.get('id');

    const [mapType, setMapType] = useState(urlParam.get('mapType') || 'currentlyDisplayed');

    useEffect(() => {
        // Find the art piece by ID within the JSON data
        const foundArtPiece = artPiecesData.find(piece => piece.id.toString() === exhibitID);
        setArtPiece(foundArtPiece);
    }, [exhibitID]);

    //Formats the date to either BCE or CE
    const formatDate = (date) => {
        let dateParts = date.split('/');

        const toBCE = (datePart) => {
            return datePart.startsWith('-') ? (datePart.slice(1) + ' BCE') : datePart;
        };

        if (dateParts.length === 2) {
            dateParts[0] = toBCE(dateParts[0]);
            dateParts[1] = toBCE(dateParts[1]);
            dateParts = dateParts.join(' - ');
        } else {
            dateParts[0] = toBCE(dateParts[0]);
            dateParts = dateParts[0];
        }

        return dateParts;
    };

    // Displays loading if not loaded yet
    if (!artPiece) {
        return <div className="w3-container w3-center"><p>Loading...</p></div>;
    }

    //Toggles the map between the currently displayed location and the originated location
    const handleMapToggle = () => {
        if (mapType === 'currentlyDisplayed') {
            setMapType('originated');
        } else {
            setMapType('currentlyDisplayed');
        }
    };
    //Sets the location of the art piece on the map
    const artPieceMapLocation = mapType === 'originated' ? [artPiece.originatedLongitude, artPiece.originatedLatitude] : [artPiece.displayedLongitude, artPiece.displayedLatitude];

    return (
        <div className="w3-container">
            <h1 className="w3-center title">{artPiece.name}</h1>
            <div className="w3-row-padding w3-margin-top">
                <div className="w3-col s12">
                    <VideoPlayer id={exhibitID} />
                </div>
            </div>
            <div className="w3-row-padding w3-margin-top">
                <div className="w3-col s12 m6 l6 grid-item">
                    <button className={`w3-center`} onClick={handleMapToggle}>Toggle Currently Displayed/Originated</button>
                    <div className='minimap'>
                        <MapBox
                            center={artPieceMapLocation}
                            zoom={artPieceMapLocation[0] === null ? 0 : 5}
                            size={{width: '100%', height: '500px'}}
                            mapType={mapType}
                        />
                    </div>
                </div>
                <div className="w3-col s12 m6 l6 grid-item">
                    <PhotoGallery id={exhibitID} />
                </div>
            </div>
            <div className="w3-row-padding w3-margin-top">
                <div className="w3-col s12">
                    <div className={'w3-container w3-center'}>
                        <p className={'blurb'}>Here's some more information on {artPiece.name}:</p>
                        {artPiece.artist_culture !== "None" &&
                            <p className={'blurb'}>Artist/Culture: {artPiece.artist_culture}</p>}
                        {artPiece.location !== "None" && <p className={'blurb'}>Location Made: {artPiece.location}</p>}
                        {artPiece.date !== "None" &&
                            <p className={'blurb'}>Year Created: {formatDate(artPiece.date)}</p>}
                        {artPiece.materials !== "None" && <p className={'blurb'}>Materials: {artPiece.materials}</p>}
                        <p className={'blurb'}>Unit: {artPiece.unit}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Exhibit;