import React, {useEffect, useState} from 'react'

function ArtCard() {

    const [stuff, setStuff] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setStuff(data))
        .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className='w3-panel w3-card artCard'>{stuff ? JSON.stringify(stuff) : 'Loading...'}</div>


  );
}

export default ArtCard