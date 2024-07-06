import React, {useEffect} from 'react'
import {useNavigate} from "react-router-dom";

function ArtCard( {artPiecesArray, search, setArtPiecesArray}) {

    const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5001/museum')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setArtPiecesArray(data))
        .catch(error => console.error('Error:', error));
  }, [setArtPiecesArray]);

  artPiecesArray = artPiecesArray.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase())
          || item.museum.toLowerCase().includes(search.toLowerCase())
          || item.artist_culture.toLowerCase().includes(search.toLowerCase())
          || item.location.toLowerCase().includes(search.toLowerCase())
          || item.id.toString().toLowerCase().includes(search.toLowerCase());
  });

  return (
      <div>
          {artPiecesArray.map((item, index) => (
              <div className='w3-panel w3-card artCard w3-hover-shadow w3-hover-opacity' key={index} onClick={() =>  navigate(`/exhibit?id=${item.id}`)}>
                  <h3>{item.name}</h3>
                  <div>ID: {item.id}</div>
                  {item.museum !== "None" && <div>Museum: {item.museum}</div>}
                  {item.artist_culture !== "None" && <div>Artist/Culture: {item.artist_culture}</div>}
                  {item.location !== "None" && <div>Location: {item.location}</div>}
                  <p></p>
              </div>
          ))}
      </div>
  );
}

export default ArtCard