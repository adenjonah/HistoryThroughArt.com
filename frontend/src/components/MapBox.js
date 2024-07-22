import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Your Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapBox = ({ center, zoom, style, overlays }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

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
      if (overlays && overlays.length > 0) {
        // Convert overlays to GeoJSON format
        const geojsonData = {
          type: 'FeatureCollection',
          features: overlays.map((overlay) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: overlay.coordinates,
            },
            properties: {
              name: overlay.name,
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
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40,
            ],
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
            'text-size': 12,
          },
        });

        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'points',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#ff0000', // red color for unclustered points
            'circle-radius': 10, // larger size for unclustered points
            'circle-stroke-width': 1,
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

        // Hover event for showing popup
        map.on('mouseenter', 'unclustered-point', (e) => {
          map.getCanvas().style.cursor = 'pointer';

          const coordinates = e.features[0].geometry.coordinates.slice();
          const { name } = e.features[0].properties;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`Name: ${name}`)
            .addTo(map);
        });

        map.on('mouseleave', 'unclustered-point', () => {
          map.getCanvas().style.cursor = '';
          const popups = document.getElementsByClassName('mapboxgl-popup');
          if (popups.length) {
            popups[0].remove();
          }
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
  }, [center, zoom, style, overlays]);

  return <div ref={mapContainerRef} style={{ width: '80%', height: '800px' }} />;
};

export default MapBox;