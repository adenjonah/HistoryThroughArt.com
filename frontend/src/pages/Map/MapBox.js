import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import artPiecesData from '../../Data/artworks.json'; // Import the JSON data

// Your Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const images = require.context('../../artImages', false, /\.webp$/);

const MapBox = ({ center, zoom, style, size, onMapTypeChange, spin }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapType, setMapType] = useState('originated'); // Default to 'originated'
  const [overlayData, setOverlayData] = useState([]);
  const [isSpinning, setIsSpinning] = useState(spin);
  const spinRef = useRef(null); // Ref to keep track of spinning animation frame

  const handleMapToggle = () => {
    setMapType((prevType) => {
      const newType = prevType === 'originated' ? 'currentlyDisplayed' : 'originated';
      if (onMapTypeChange) {
        onMapTypeChange(newType);
      }
      return newType;
    });
  };

  const getImagePath = (imageName) => {
    try {
      return images(`./${imageName}`);
    } catch (e) {
      console.error(`Cannot find image: ${imageName}`);
      return '';
    }
  };

  // Function to rotate the globe as it would look from space (around the North-South axis)
  const rotateGlobe = (map) => {
    if (!isSpinning) return; // Stop spinning if the flag is false

    map.easeTo({
      bearing: map.getBearing() + 0.1, // Increment bearing to rotate around the North-South axis
      duration: 10, // Adjust duration for smoothness
      // center: map.getCenter(), // Keep the center fixed (no latitude/longitude change)
      pitch: 60, // Set pitch to 60 degrees for a 3D, space-like view (adjust as needed)
    });

    spinRef.current = requestAnimationFrame(() => rotateGlobe(map)); // Store the animation frame ID
  };

  // Stop the globe from spinning by canceling the animation frame
  const stopGlobeSpin = () => {
    setIsSpinning(false);
    if (spinRef.current) {
      cancelAnimationFrame(spinRef.current);
      spinRef.current = null;
    }
  };

  useEffect(() => {
    // Set overlay data depending on map type
    if (mapType === 'originated') {
      const filteredData = artPiecesData.filter(
        (piece) => piece.originatedLatitude && piece.originatedLongitude
      );
      const overlayData = filteredData.map((piece) => ({
        id: piece.id,
        name: piece.name,
        location: piece.location,
        latitude: piece.originatedLatitude,
        longitude: piece.originatedLongitude,
        image: piece.image[0], // Assuming each piece has at least one image
      }));
      setOverlayData(overlayData);
    } else {
      const filteredData = artPiecesData.filter(
        (piece) => piece.displayedLatitude && piece.displayedLongitude
      );
      const overlayData = filteredData.map((piece) => ({
        id: piece.id,
        name: piece.name,
        location: piece.displayedLocation,
        latitude: piece.displayedLatitude,
        longitude: piece.displayedLongitude,
        image: piece.image[0], // Assuming each piece has at least one image
      }));
      setOverlayData(overlayData);
    }
  }, [mapType]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: style || 'mapbox://styles/mapbox/satellite-streets-v12',
      // center: center || [-117.420015, 47.673373],
      center: center || [0,90],
      zoom: zoom || 1.5,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Start spinning the globe if `spin` is true
    if (spin) {
      setIsSpinning(true);
      rotateGlobe(map);
    }

    // Stop the spinning when the map is clicked
    map.on('click', () => {
      stopGlobeSpin();
    });

    map.on('load', () => {
      if (overlayData && overlayData.length > 0) {
        const geojsonData = {
          type: 'FeatureCollection',
          features: overlayData.map((overlay) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [overlay.longitude, overlay.latitude],
            },
            properties: {
              id: overlay.id,
              name: overlay.name,
              location: overlay.location,
              imageUrl: getImagePath(overlay.image),
            },
          })),
        };

        map.addSource('points', {
          type: 'geojson',
          data: geojsonData,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 25,
        });

        // Add the clustering and point layers
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'points',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#ff9999',
              5,
              '#ff6666',
              10,
              '#ff3333',
              15,
              '#cc0000',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              10,
              5,
              15,
              10,
              20,
              25,
              25,
            ],
            'circle-stroke-color': '#000000',
            'circle-stroke-width': 2,
          },
        });

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'points',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 14,
          },
          paint: {
            'text-color': '#ffffff',
          },
        });

        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'points',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#ff0000',
            'circle-radius': 5,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#000000',
          },
        });

        // Event for expanding clusters
        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters'],
          });
          const clusterId = features[0].properties.cluster_id;
          map
            .getSource('points')
            .getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;

              map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
              });
            });
        });

        // Event for displaying popup on unclustered points
        map.on('mouseenter', 'unclustered-point', (e) => {
          map.getCanvas().style.cursor = 'pointer';

          const coordinates = e.features[0].geometry.coordinates.slice();
          const { id, name, location, imageUrl } = e.features[0].properties;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          const popupContent = `
            <div>
              <img src="${imageUrl}" height="200" width="200" /><br/>
              ${id}. ${name}<br/>
              ${location}<br/>
            </div>
          `;

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
        });

        map.on('mouseleave', 'unclustered-point', () => {
          map.getCanvas().style.cursor = '';
          const popups = document.getElementsByClassName('mapboxgl-popup');
          if (popups.length) {
            popups[0].remove();
          }
        });

        // Click event to navigate to an exhibit
        map.on('click', 'unclustered-point', (e) => {
          const { id } = e.features[0].properties;
          window.location.href = `/exhibit?id=${id}&mapType=${mapType}`;
        });

        map.on('mouseenter', 'clusters', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'clusters', () => {
          map.getCanvas().style.cursor = '';
        });
      }
    });

    return () => map.remove();
  }, [center, zoom, style, overlayData, mapType, spin]);

  return (
    <div ref={mapContainerRef} style={{ width: size?.width || '100%', height: size?.height || '600px', position: 'relative' }}>
      <button
        onClick={handleMapToggle}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '10px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1,
        }}
      >
        Toggle Currently Displayed/Originated
      </button>
    </div>
  );
};

export default MapBox;