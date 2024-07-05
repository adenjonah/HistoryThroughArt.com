import React, { useEffect } from 'react';
import './Home.css';

function Home() {

    useEffect(() => {
        fetch('http://localhost:5001/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not okay');
                }
                return response.json();
            })
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleFeelingLucky = () => {
        const randomId = Math.floor(Math.random() * 250) + 1;
        window.location.href = `/exhibit?id=${randomId}`;
    };

    return (
        <div className="home pagecontainer">
            <h1 className="home title">Welcome to Korus' Corner!</h1>
            <p className="home blurb">
                This site is intended to be a learning aid for students exploring the content of the AP Art History curriculum.
            </p>
            <button onClick={handleFeelingLucky} className="w3-bar-item w3-button home button">I'm Feeling Lucky</button>
        </div>
    );
}

export default Home;