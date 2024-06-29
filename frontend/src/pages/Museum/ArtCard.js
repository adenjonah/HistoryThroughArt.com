import React, {useEffect, useState} from 'react'

function hiNum(index) {
    console.log("hello " + index);

}

function ArtCard() {

    const [artPiecesArray, setArtPiecesArray] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/museum')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setArtPiecesArray(data))
        .catch(error => console.error('Error:', error));
  }, []);


  return (
      <div>
          {artPiecesArray.map((item, index) => (
              <div className='w3-panel w3-card artCard' key={index} onClick={() => {hiNum(index+1)}}>
                  <h3>{item.name}</h3>
                  <div>Short Name: {item.shortName}</div>
                  <div>Unit: {item.unit}</div>
                  <div>Index in DB: {index + 1}</div>
                  <p></p>
              </div>
          ))}
      </div>


  );
}

export default ArtCard