import React, {useEffect, useRef, useState} from "react";
import './VideoPlayer.css'; // Make sure to create and import this CSS file

function VideoPlayer({ id }) {
    const [artVideos, setArtVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(0);
    const [visibleTranscript, setVisibleTranscript] = useState(true);
    const iframeRef = useRef(null);
    const transcriptRef = useRef(null);

    useEffect(() => {
        fetch(`http://localhost:5001/exhibit-videos?id=${id}`)
            .then(response => response.json())
            .then(data => setArtVideos(data))
            .catch(error => console.error('Error:', error));
    }, [id]);

    useEffect(() => {
        const handleResize = () => {
            if (iframeRef.current && transcriptRef.current) {
                const iframeHeight = iframeRef.current.clientHeight;
                transcriptRef.current.style.height = `${iframeHeight - 35}px`;
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [visibleTranscript, artVideos, selectedVideo]);

    const handleVideoSelection = (index) => {
        setSelectedVideo(index);
    };

    const handleTranscriptClick = (start) => {
        const videoElement = document.querySelector('.video-player');
        if (videoElement) {
            videoElement.contentWindow.postMessage(`{"event":"command","func":"seekTo","args":[${start}, true]}`, '*');
        }
    };

    const handleToggleTranscript = () => {
        setVisibleTranscript(!visibleTranscript);
    };

    const ConvertToMins = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(0)}`;
    };

    return (
        <div className="w3-container">
            {artVideos.length > 0 && (
                <div className="w3-row">
                    <div className={`w3-col s12 m9 l9 w3-padding`}>
                        <div className="w3-responsive w3-display-container video-player-wrapper">
                            <iframe
                                ref={iframeRef}
                                src={`${artVideos[selectedVideo].videoLink}?enablejsapi=1`}
                                allowFullScreen
                                title={artVideos[selectedVideo].id}
                                className="video-player"
                            ></iframe>
                        </div>
                    </div>

                    <div className={`w3-col s12 m3 l3 w3-padding`}>
                        <div className="w3-center">
                            <button className="w3-button w3-blue" onClick={handleToggleTranscript}>
                                {visibleTranscript ? "Hide Transcript" : "Show Transcript"}
                            </button>
                        </div>
                        <div ref={transcriptRef} id="transcript" className={`transcript-box ${visibleTranscript ? 'w3-show' : 'w3-hide'} w3-animate-zoom`}>
                            {JSON.parse(artVideos[selectedVideo].transcript).map((entry, index) => (
                                <div key={index}>
                                    <button className="youtube-marker" onClick={() => handleTranscriptClick(entry.start)}>
                                        {ConvertToMins(entry.start)} - {entry.text}
                                    </button><br/>
                                </div>
                            ))}
                        </div>
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

export default VideoPlayer;