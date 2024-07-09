import React, {useEffect, useState} from 'react'

const images = require.context('../../artImages', false, /\.png$/);

function Gallery( {id} ) {

  const getImagePath = (imageName) => {
    try {
      return images(`./${imageName}`);
    } catch (e) {
      console.error(`Cannot find image: ${imageName}`);
      return '';
    }
  };

  const [artImages, setArtImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5001/exhibit-images?id=${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok - exhibit-images');
          }
          return response.json();
        })
        .then(data => setArtImages(data))
        .catch(error => console.error('Error:', error));
  }, [id]);

  return (
    <div>{artImages.map((imageItem, index) => {
      return <img className='images' src={getImagePath(imageItem.image)} key={index}
                  alt="nope"></img>
    } ) }
    </div>
  )
}

export default Gallery