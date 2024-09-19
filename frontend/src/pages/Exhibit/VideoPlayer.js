import React, { useEffect, useRef, useState } from "react";
import './VideoPlayer.css'; // Make sure to create and import this CSS file
import artPiecesData from '../../Data/artworks.json'; // Import the JSON data

function VideoPlayer({ id }) {
    const [artVideos, setArtVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(0);
    const [visibleTranscript, setVisibleTranscript] = useState(false);
    const iframeRef = useRef(null);
    const transcriptRef = useRef(null);

    useEffect(() => {
        // Find the relevant art piece by ID and extract its videos and transcripts
        const foundArtPiece = artPiecesData.find(piece => piece.id.toString() === id);
        if (foundArtPiece && foundArtPiece.videoLink && foundArtPiece.transcript) {
            const combinedVideos = foundArtPiece.videoLink.map((video, index) => ({
                videoLink: video,
                transcript: JSON.parse(foundArtPiece.transcript[index])
            }));
            setArtVideos(combinedVideos);
        }
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
                    {/* Video Player Column */}
                    <div className={`w3-col s12 ${visibleTranscript ? 'm9 l9' : 'm12 l12'} w3-padding`}>
                        <div className="w3-responsive w3-display-container video-player-wrapper">
                            <iframe
                                ref={iframeRef}
                                src={`${artVideos[selectedVideo].videoLink}?enablejsapi=1`}
                                allowFullScreen
                                title={`Video ${selectedVideo + 1}`}
                                className="video-player"
                            ></iframe>
                        </div>
                    </div>

                    {/* Transcript Column */}
                    {visibleTranscript && (
                        <div className={`w3-col s12 m3 l3 w3-padding`}>
                            <div className="w3-center">
                                <button className="w3-button w3-blue" onClick={handleToggleTranscript}>
                                    {visibleTranscript ? "Hide Transcript" : "Show Transcript"}
                                </button>
                            </div>
                            <div
                                ref={transcriptRef}
                                id="transcript"
                                className={`transcript-box w3-show w3-animate-zoom`}
                            >
                                {artVideos[selectedVideo].transcript && artVideos[selectedVideo].transcript.map((entry, index) => (
                                    <div key={index}>
                                        <button className="youtube-marker" onClick={() => handleTranscriptClick(entry.start)}>
                                            {ConvertToMins(entry.start)} - {entry.text}
                                        </button>
                                        <br/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Show Transcript Button when Transcript is Hidden */}
                    {!visibleTranscript && (
                        <div className="w3-col s12 w3-center w3-padding">
                            <button className="w3-button w3-blue" onClick={handleToggleTranscript}>
                                Show Transcript
                            </button>
                        </div>
                    )}
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