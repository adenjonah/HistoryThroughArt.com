import React from 'react';
import './Home.css';

function Home() {

    const handleFeelingLucky = () => {
        const randomId = Math.floor(Math.random() * 250) + 1;
        window.location.href = `/exhibit?id=${randomId}`;
    };

    const handleStartLearning = () => {
        window.location.href = '/tutorial';
    }

    const handleViewMap = () => {
        window.location.href = '/map';
    }

    return (
        <div className="w3-container w3-display-container w3-center"
             style={{minHeight: 'calc(100vh - 60px)', zIndex: 0, overflowX: 'hidden'}}>
            <div className="w3-display-middle text">
                <h1 className="w3-xxlarge w3-text-white">Welcome to History Through Art!</h1>
                <p className="w3-large w3-text-white">
                    This site is intended to be a learning aid for students exploring the content of the AP Art History
                    curriculum.
                </p>
                <div className="w3-row w3-center w3-margin-top">
                    <div className="w3-col s12 m12 l12 w3-margin-bottom">
                        <button onClick={handleStartLearning}
                                className="w3-button button w3-round w3-block">How To Use This Site
                        </button>
                    </div>
                    <div className="w3-col s12 m12 l12 w3-margin-bottom">
                        <button onClick={handleFeelingLucky}
                                className="w3-button button w3-round w3-block">Random Art Piece
                        </button>
                    </div>
                    <div className="w3-col s12 m12 l12 w3-margin-bottom">
                        <button onClick={handleViewMap}
                                className="w3-button button w3-round w3-block">View Map
                        </button>
                    </div>
                </div>
            </div>
            <div className="scrolling-background1"></div>
            <div className="scrolling-background2"></div>
        </div>
    );
}

export default Home;