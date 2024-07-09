import React, {useEffect, useState} from 'react'
import VideoPlayer from './VideoPlayer'
import Gallery from "./Gallery";

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



    return (
        <div className='about pagecontainer'>
            <h1 className="title">{artPiece.name}</h1>
            <p className='blurb'>ID: {artPiece.id}, Artist/Culture: {artPiece.artist_culture}</p>
            <p className='blurb'>More information on the '{artPiece.name}' here:</p>
            <VideoPlayer id={exhibitID} />
            <Gallery id={exhibitID} />

        </div>
    )
}

export default Exhibit;