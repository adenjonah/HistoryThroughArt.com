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

    const handleStartLearning = () => {
        window.location.href = '/museum';
    }

    const handleViewMap = () => {
        window.location.href = '/map';
    }

    return (
        <div className="w3-container w3-display-container pagecontainer">
            <div className="w3-display-middle text">
                <h1 className="w3-xxlarge w3-text-white">Welcome to Korus' Corner!</h1>
                <p className="w3-large w3-text-white">
                    This site is intended to be a learning aid for students exploring the content of the AP Art History
                    curriculum.
                </p>
                <div className="button-container">
                    <button onClick={handleStartLearning} className="w3-button button w3-round">Start Learning</button>
                    <button onClick={handleFeelingLucky} className="w3-button button w3-round">I'm Feeling Lucky
                    </button>
                    <button onClick={handleViewMap} className="w3-button button w3-round">View Map</button>
                </div>
            </div>
            <div className="scrolling-background1"></div>
            <div className="scrolling-background2"></div>
        </div>
    );
}

export default Home;