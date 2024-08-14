import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import artPiecesData from '../../Data/artworks.json'; // Import the JSON data

// Your Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const images = require.context('../../artImages', false, /\.png$/);

const MapBox = ({ center, zoom, style, size, mapType }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [overlayData, setOverlayData] = useState([]);

  const getImagePath = (imageName) => {
    try {
      return images(`./${imageName}`);
    } catch (e) {
      console.error(`Cannot find image: ${imageName}`);
      return '';
    }
  };

  useEffect(() => {
    // Extract locations and relevant data from the JSON file

    //Show where each artpiece was created
    if(mapType === 'originated') {
        const filteredData = artPiecesData.filter(piece => piece.originatedLatitude && piece.originatedLongitude);
        const overlayData = filteredData.map(piece => ({
          id: piece.id,
          name: piece.name,
          location: piece.location,
          latitude: piece.originatedLatitude,
          longitude: piece.originatedLongitude,
          image: piece.image[0], // Assuming each piece has at least one image
        }));
        setOverlayData(overlayData);
    }
    //Show where each artpiece is currently displayed, or if mapType property is not set
    else {
      const filteredData = artPiecesData.filter(piece => piece.displayedLatitude && piece.displayedLongitude);

      const overlayData = filteredData.map(piece => ({
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
      style: style || 'mapbox://styles/mapbox/streets-v11',
      center: center || [-74.5, 40],
      zoom: zoom || 1.5,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

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

        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'points',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#009688',
              100,
              '#8BC34A',
              750,
              '#FFC107',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              15,
              100,
              25,
              750,
              35,
            ],
            'circle-stroke-color': '#fff',
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
            'circle-color': '#e91e63',
            'circle-radius': 10,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });

        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters'],
          });
          const clusterId = features[0].properties.cluster_id;
          map.getSource('points').getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
        });

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
  }, [center, zoom, style, overlayData, mapType]);

  return <div ref={mapContainerRef} style={{ width: size?.width || '80%', height: size?.height || '600px' }} />;
};

export default MapBox;