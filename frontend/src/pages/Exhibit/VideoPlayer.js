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
    <div>
        {artVideos.map((video, index) => {
            return (
                <iframe src={video.videoLink} allowFullScreen="allowfullscreen" title={video.id} key={index}></iframe>
            )
        })}
    </div>
  );
}

export default VideoPlayer