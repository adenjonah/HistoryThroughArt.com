import React, { useState } from 'react';
import MapBox from './MapBox';

// Assuming you have the JSON data in a file named 'data.json'
// import jsonData from './extracted_placemarks.json';

function Map() {
  // const [overlayData, setOverlayData] = useState([]);
  const [mapType, setMapType] = useState('currentlyDisplayed');

  // useEffect(() => {
  //   const transformData = () => {
  //     return jsonData.map((item, index) => {
  //       const coordinates = item.Coordinates.split(',').map(Number);
  //       return {
  //         id: index + 1,
  //         name: item.Name,
  //         foundLocation: '',
  //         currentLocation: '', // You can extract this from the Description if needed
  //         city: '', // You can extract this from the Description if needed
  //         stateCountry: '', // You can extract this from the Description if needed
  //         coordinates: [coordinates[0], coordinates[1]],
  //         description: item.Description.replace(/<[^>]+>/g, ''), // Remove HTML tags for plain text description
  //       };
  //     });
  //   };
  //
  //   setOverlayData(transformData());
  // }, []);

    const handleMapToggle = () => {

        if(mapType === 'currentlyDisplayed'){
            setMapType('originated');
        }
        else{
            setMapType('currentlyDisplayed');
        }
    }

    // console.log(mapType);
  return (
    <div className='map pagecontainer'>
      <h1 className="title">Map</h1>
      <p className='blurb'>Where the 250 art pieces {mapType === 'currentlyDisplayed' ? "are currently displayed" : "originated from"}</p>
      <button onClick={handleMapToggle}>Toggle Currently Displayed/Originated</button>
      <MapBox mapType={mapType}/>
    </div>
  );
}

export default Map;