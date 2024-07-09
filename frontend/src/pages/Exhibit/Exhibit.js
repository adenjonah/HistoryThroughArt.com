import React, {useEffect, useState} from 'react'

function Exhibit() {

    const [artPiece, setArtPiece] = useState('');
    const [artImages, setArtImages] = useState([]);
    const [artVideos, setArtVideos] = useState([]);

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

    useEffect(() => {
        fetch(`http://localhost:5001/exhibit-images?id=${exhibitID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok - exhibit-images');
                }
                return response.json();
            })
            .then(data => setArtImages(data[0]))
            .catch(error => console.error('Error:', error));
    }, [exhibitID]);

    useEffect(() => {
        fetch(`http://localhost:5001/exhibit-videos?id=${exhibitID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok - exhibit-videos');
                }

                return response.json();
            })
            .then(data => setArtVideos(data))
            .catch(error => console.error('Error:', error));
    }, [exhibitID]);


    console.log(artPiece);
    console.log("----");
    console.log(artImages);
    console.log("----");
    console.log("Videos");
    console.log(artVideos);
    console.log("")

    artVideos.map((video) => {
        console.log(video.videoLink);
    }
    );

    return (
        <div className='about pagecontainer'>
            <h1 className="title">{artPiece.name}</h1>
            <p className='blurb'>ID: {artPiece.id}, Artist/Culture: {artPiece.artist_culture}</p>
            <p className='blurb'>More information on the '{artPiece.name}' here:</p>

            <div>
                {artVideos.map((video) => {
                    return (
                        <iframe src={video.videoLink}  allowFullScreen="allowfullscreen"></iframe>
                    )
                })}
            </div>

        </div>
    )
}

export default Exhibit;