import React, { useEffect, useState } from "react";
import './VideoPlayer.css'; // Make sure to create and import this CSS file

function VideoPlayer({ id }) {
    const [artVideos, setArtVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(0);
    // const [transcript, setTranscript] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5001/exhibit-videos?id=${id}`)
            .then(response => response.json())
            .then(data => setArtVideos(data))
            .catch(error => console.error('Error:', error));
    }, [id]);

    // useEffect(() => {
    //     // Example transcript data, replace with actual data fetching logic
    //     const exampleTranscript = [
    //         { start: 4.94, end: 11.94, text: "okay this is piece number three in our" },
    //         { start: 9.059, end: 13.94, text: "in our pre-history set and uh we're" },
    //         { start: 11.94, end: 17.279, text: "gonna be talking about learning about" },
    //         { start: 13.94, end: 19.8, text: "the camelid sacrum in the shape of a K" },
    //         { start: 17.279, end: 23.279, text: "line canine excuse me which is" },
    //         { start: 19.8, end: 26.48, text: "discovered at uh text quick queack here" },
    //         { start: 23.279, end: 26.48, text: "in Mexico" },
    //         { start: 26.82, end: 32.54, text: "so the context of this" },
    //         { start: 29.4, end: 34.68, text: "piece is that" },
    //         { start: 32.54, end: 36.839, text: "unfortunately when this was discovered" },
    //         { start: 34.68, end: 39.96, text: "by workers who were digging" },
    //         { start: 36.84, end: 43.68, text: "the for a building they" },
    //         { start: 39.96, end: 46.68, text: "did not call in an archaeologist and so" },
    //         { start: 43.68, end: 48.36, text: "any surrounding material" },
    //         { start: 46.68, end: 52.32, text: "that could have been used to help us" },
    //         { start: 48.36, end: 55.739, text: "locate more about this item was" },
    //         { start: 52.32, end: 58.92, text: "kind of plowed through so we don't know" },
    //         { start: 55.739, end: 62.34, text: "enough about the discovery site so all" },
    //         { start: 58.92, end: 63.899, text: "we have is just the the item itself" },
    //         { start: 62.34, end: 66.18, text: "which is like" },
    //         { start: 63.899, end: 69.36, text: "you know putting a basketball out of" },
    //         { start: 66.18, end: 70.92, text: "context of the basketball court" },
    //         { start: 69.36, end: 73.82, text: "you know a lot about it but you wouldn't" },
    //         { start: 70.92, end: 73.82, text: "know everything for sure" },
    //         { start: 74.4, end: 81.32, text: "okay uh context for it that we do have" },
    //         { start: 77.28, end: 83.939, text: "though is that this is a camelid uh" },
    //         { start: 81.32, end: 87.18, text: "and a sacrum" },
    //         { start: 83.939, end: 91.14, text: "so or it's from a Camelot and camelid is" },
    //         { start: 87.18, end: 93.18, text: "an uh an animal that carries is the" },
    //         { start: 91.14, end: 95.46, text: "Beast of Burden carries loads for people" },
    //         { start: 93.18, end: 97.979, text: "in Central and South America llamas" },
    //         { start: 95.46, end: 101.04, text: "alpacas camels are all part of the" },
    //         { start: 97.979, end: 103.86, text: "camelid family and" },
    //         { start: 101.04, end: 105.659, text: "there were no beasts of Burden larger" },
    //         { start: 103.86, end: 108.96, text: "than those you know the camo wasn't" },
    //         { start: 105.659, end: 111.6, text: "there in Central and South America" },
    //         { start: 108.96, end: 114.6, text: "so the" },
    //         { start: 111.6, end: 116.64, text: "sacrum that we have is this bone right" },
    //         { start: 114.6, end: 119.939, text: "here here's the hip bone" },
    //         { start: 116.64, end: 122.64, text: "set and in between those each of our" },
    //         { start: 119.939, end: 125.34, text: "hips there is a sacrum" },
    //         { start: 122.64, end: 128.459, text: "triangular shaped bone" },
    //         { start: 125.34, end: 133.56, text: "and it is from this sacrum that this art" },
    //         { start: 128.459, end: 137.34, text: "piece has been created so camelid sacrum" },
    //         { start: 133.56, end: 140.28, text: "in the shape of a canine I would love to" },
    //         { start: 137.34, end: 142.56, text: "show you a picture of a canine that is" },
    //         { start: 140.28, end: 145.44, text: "of a living dog but I just read a" },
    //         { start: 142.56, end: 150.42, text: "scientific report about early American" },
    //         { start: 145.44, end: 154.44, text: "dogs and evidently they are obliterated" },
    //         { start: 150.42, end: 157.2, text: "they disappeared when the Europeans" },
    //         { start: 154.44, end: 159.36, text: "arrived in the Americas and you'd think" },
    //         { start: 157.2, end: 161.04, text: "well maybe they just kind of made it in" },
    //         { start: 159.36, end: 164.099, text: "with any of the dogs the Europeans" },
    //         { start: 161.04, end: 165.18, text: "brought over but that's not what" },
    //         { start: 164.099, end: 167.58, text: "happened" },
    //         { start: 165.18, end: 170.04, text: "and so it's like a chunk of History has" },
    //         { start: 167.58, end: 174.12, text: "been lost the thought though is that" },
    //         { start: 170.04, end: 177.239, text: "these dogs suffered the same Agony as" },
    //         { start: 174.12, end: 179.099, text: "the humans here in the Americas in that" },
    //         { start: 177.239, end: 181.68, text: "probably they just died from some" },
    //         { start: 179.099, end: 184.4, text: "disease that was brought by European" },
    //         { start: 181.68, end: 184.4, text: "dogs" },
    //         { start: 184.8, end: 188.54, text: "so" },
    //         { start: 186.48, end: 191.159, text: "that" },
    //         { start: 188.54, end: 193.019, text: "existence of dogs and they probably were" },
    //         { start: 191.159, end: 194.7, text: "not like the Alaskan you know like you" },
    //     ];
    //     setTranscript(exampleTranscript);
    // }, []);

    const handleVideoSelection = (index) => {
        setSelectedVideo(index);
    };

    const handleTranscriptClick = (start) => {
        const videoElement = document.querySelector('.video-player');
        if (videoElement) {
            videoElement.contentWindow.postMessage(`{"event":"command","func":"seekTo","args":[${start}, true]}`, '*');
        }
    };

    return (
        <div className="w3-container">
            {artVideos.length > 0 && (
                <div className="w3-container w3-center w3-margin-bottom">
                    <div className="w3-responsive w3-display-container video-player-wrapper">
                        <iframe
                            src={`${artVideos[selectedVideo].videoLink}?enablejsapi=1`}
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
            {artVideos.length > 0 && (
                <div className="w3-container w3-margin-top">
                    <div id="transcript" className="transcript-box">
                        {JSON.parse(artVideos[selectedVideo].transcript).map((entry, index) => (
                            <div key={index}>
                                <a href="javascript:;" className="youtube-marker"
                                   onClick={() => handleTranscriptClick(entry.start)}>
                                    {entry.text}
                                </a><br/>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideoPlayer;