import React, {useEffect, useState} from "react";


function VideoPlayer({id}) {

    const [artVideos, setArtVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(0);

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




    const handleVideoSelection = (index) => {
        setSelectedVideo(index);
    }

    return (
        <div className="w3-container">
            {artVideos.length > 0 && (
                <div className="w3-container w3-center w3-margin-bottom">
                    <div className="w3-responsive w3-display-container video-player-wrapper">
                        <iframe
                            src={artVideos[selectedVideo].videoLink}
                            allowFullScreen
                            title={artVideos[selectedVideo].id}
                            className={'video-player'}
                        ></iframe>
                    </div>
                </div>
            )}
            {artVideos.length > 1 && (
                <div className="w3-container w3-center w3-margin-top">
                    {artVideos.map((video, index) => (
                        <button
                            key={index}
                            onClick={() => handleVideoSelection(index)}
                            className={`w3-button w3-ripple w3-bar-item w3-margin-right w3-margin-bottom
                             ${index === selectedVideo ? 'w3-blue' : 'w3-light-gray'} `}
                        >
                            Video {index + 1}
                        </button>

                    ))}
                </div>
            )}
        </div>
    );
}

export default VideoPlayer