import MapBox from "../Map/MapBox";
import React from "react";

function MiniMap({mapType, artPiece}) {

    // Sets the location of the art piece on the map
    const artPieceMapLocation = mapType === 'originated' ? [artPiece.originatedLongitude, artPiece.originatedLatitude] : [artPiece.displayedLongitude, artPiece.displayedLatitude];

    return (
        <div className="w3-col s12 m6 l6 grid-item">
            <div className='w3-display-container'>
                <MapBox
                    center={artPieceMapLocation}
                    zoom={artPieceMapLocation[0] === null ? 0 : 5}
                    size={{width: '100%', height: '500px'}}
                    mapType={mapType}
                />
                <div className='w3-display-topleft w3-padding w3-marginleft w3-large'>
                    {mapType === 'currentlyDisplayed' ?
                        (artPiece.displayedLongitude === null ?
                            "Art piece is not currently displayed" :
                            "Currently Displayed") :
                        (artPiece.originatedLongitude === null ?
                            "No originated location for this art piece" :
                            "Originated")}
                </div>
            </div>
        </div>
    );
}

export default MiniMap;