import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import jsonData from './extracted_placemarks.json';

// Your Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapBox = ({ center, zoom, style }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const transformData = () => {
      return jsonData.map((item, index) => {
        const coordinates = item.Coordinates.split(',').map(Number);
        const imageUrlMatch = item.Description.match(/<img src="([^"]+)"/);
        const imageUrl = imageUrlMatch ? imageUrlMatch[1] : '';

        return {
          id: index + 1,
          name: item.Name,
          imageUrl: imageUrl, // Add image URL to the data
          coordinates: [coordinates[0], coordinates[1]],
          description: item.Description.replace(/<[^>]+>/g, ''), // Remove HTML tags for plain text description
        };
      });
    };

    const overlayData = transformData();

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
              coordinates: overlay.coordinates,
            },
            properties: {
              id: overlay.id,
              name: overlay.name,
              location: overlay.foundLocation,
              imageUrl: overlay.imageUrl, // Add image URL to properties
            },
          })),
        };

        map.addSource('points', {
          type: 'geojson',
          data: geojsonData,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
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
              ${location}
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
          window.location.href = `http://localhost:3000/exhibit?id=${id}`;
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
  }, [center, zoom, style]);

  return <div ref={mapContainerRef} style={{ width: '80%', height: '600px' }} />;
};

export default MapBox;