import React, {useEffect, useState} from 'react'
import VideoPlayer from './VideoPlayer'
import PhotoGallery from "./PhotoGallery";

function Exhibit() {

    const [artPiece, setArtPiece] = useState('');



    //Gets the parameter in the search query
    const urlParam = new URLSearchParams(window.location.search);
    const exhibitID = urlParam.get('id');

    useEffect(() => {
        fetch(`http://localhost:5001/exhibit?id=${exhibitID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok - exhibit');
                }
                return response.json();
            })
            .then(data => setArtPiece(data[0]))
            .catch(error => console.error('Error:', error));
    }, [exhibitID]);


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

    //Displays loading if not loaded yet
    if (!artPiece) {
        return <div className="w3-container w3-center"><p>Loading...</p></div>;
    }


    return (
        <div className="w3-container">
            <h1 className="w3-center title">{artPiece.name}</h1>
            <div className="w3-row-padding w3-margin-top">
                <div className="w3-col s12 m7 l7 grid-item">
                    <VideoPlayer id={exhibitID}/>
                </div>
                <div className="w3-col s12 m5 l5 grid-item">
                    <PhotoGallery id={exhibitID}/>
                </div>
            </div>
                <div className={'w3-container w3-center'}>
                    <p className={'blurb'}>Here's some more information on {artPiece.name}:</p>
                    {artPiece.artist_culture !== "None" && <p className={'blurb'}>Artist/Culture: {artPiece.artist_culture}</p>}
                    {artPiece.location !== "None" &&  <p className={'blurb'}>Location Made: {artPiece.location}</p>}
                    {artPiece.date !== "None" && <p className={'blurb'}>Year Created: {formatDate(artPiece.date)}</p>}
                    {artPiece.materials !== "None" && <p className={'blurb'}>Materials: {artPiece.materials}</p>}
                    <p className={'blurb'}>Unit: {artPiece.unit}</p>
                </div>


        </div>
    )

}

export default Exhibit;