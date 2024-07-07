import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";

const images = require.context('../../artImages', false, /\.png$/);

function ArtCard( {artPiecesArray, search, setArtPiecesArray}) {

    const navigate = useNavigate();

    const [imagesArray, setImagesArray] = useState([]);

    const getImagePath = (imageName) => {
        try {
            return images(`./${imageName}`);
        } catch (e) {
            console.error(`Cannot find image: ${imageName}`);
            return '';
        }
    };

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

    useEffect(() => {
        fetch('http://localhost:5001/museum-images')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setImagesArray(data))
            .catch(error => console.error('Error:', error));
    }, []);

    console.log(imagesArray);

  artPiecesArray = artPiecesArray.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase())
          || item.artist_culture.toLowerCase().includes(search.toLowerCase())
          || item.location.toLowerCase().includes(search.toLowerCase())
          || item.id.toString().toLowerCase().includes(search.toLowerCase());
  });
  // console.log(artPiecesArray);

  return (
      <div>
          {artPiecesArray.map((item, index) => (
              <div className='w3-panel w3-card artCard w3-hover-shadow w3-hover-opacity' key={index}
                   onClick={() => navigate(`/exhibit?id=${item.id}`)}>
                  <div className='column'>
                      {imagesArray.map((imageItem, imageIndex) => {
                          if (imageItem.id === item.id)
                              return <img className='images' src={getImagePath(imageItem.image)}
                                          alt="nope"></img>
                          return null;
                      })}
                  </div>
                  <div className='column'>
                  <h3>{item.name}</h3>
                  <div>ID: {item.id}</div>

                  {/*<img className='images' src={getImagePath(item.image)} alt="nope" ></img>*/}
                  {item.artist_culture !== "None" && <div>Artist/Culture: {item.artist_culture}</div>}
                  {item.location !== "None" && <div>Location: {item.location}</div>}
                  <p></p></div>
              </div>
          ))}
      </div>
  );
}

export default ArtCard