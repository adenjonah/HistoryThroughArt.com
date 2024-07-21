import React, {useEffect, useState} from "react";


function VideoPlayer({id}) {

    const [artVideos, setArtVideos] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5001/exhibit-videos?id=${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok - exhibit-videos');
                }

                return response.json();
            })
            .then(data => setArtVideos(data))
            .catch(error => console.error('Error:', error));
    }, [id]);


    return (
        <div className="w3-container">
            {artVideos.map((video, index) => (
                <div key={index} className="w3-container w3-center w3-margin-bottom">
                    <div className="w3-responsive w3-display-container video-player-wrapper">
                        <iframe
                            src={video.videoLink}
                            allowFullScreen
                            title={video.id}
                            className={'video-player'}
                        ></iframe>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default VideoPlayer