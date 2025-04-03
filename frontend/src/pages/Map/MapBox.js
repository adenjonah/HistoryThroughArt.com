import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import artPiecesData from "../../data/artworks.json";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const images = require.context("../../artImages", false, /\.webp$/);

const MapBox = ({ center, zoom, style, size, onMapTypeChange, mapType: initialMapType }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapType, setMapType] = useState(initialMapType || "originated");
  const [overlayData, setOverlayData] = useState([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState(null);

  const handleMapToggle = () => {
    setMapType((prevType) => {
      const newType =
        prevType === "originated" ? "currentlyDisplayed" : "originated";

      if (onMapTypeChange) {
        onMapTypeChange(newType);
      }

      return newType;
    });
  };

  const getImagePath = (imageName) => {
    if (!imageName) return "";
    
    try {
      return images(`./${imageName}`);
    } catch (e) {
      console.error(`Cannot find image: ${imageName}`);
      return "";
    }
  };

  // Update overlay data when map type changes
  useEffect(() => {
    if (mapType === "originated") {
      const filteredData = artPiecesData.filter(
        (piece) => piece.originatedLatitude && piece.originatedLongitude
      );
      const overlayData = filteredData.map((piece) => ({
        id: piece.id,
        name: piece.name,
        location: piece.location,
        latitude: piece.originatedLatitude,
        longitude: piece.originatedLongitude,
        image: piece.image && piece.image.length > 0 ? piece.image[0] : null,
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
        image: piece.image && piece.image.length > 0 ? piece.image[0] : null,
      }));
      setOverlayData(overlayData);
    }
  }, [mapType]);

  // Initialize the map
  useEffect(() => {
    // Check for mapbox token
    if (!mapboxgl.accessToken) {
      setMapError("Mapbox access token is missing");
      return;
    }

    // Ensure the map container is empty before initializing
    if (mapContainerRef.current) {
      // Remove any existing content
      while (mapContainerRef.current.firstChild) {
        mapContainerRef.current.removeChild(mapContainerRef.current.firstChild);
      }
    }

    const isMobile = window.innerWidth <= 768;
    const defaultZoom = isMobile ? 1 : 4;
    
    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: style || "mapbox://styles/mapbox/satellite-streets-v12",
        center: center || [-117.420015, 47.673373],
        zoom: zoom !== undefined ? zoom : defaultZoom,
      });

      mapRef.current = map;
      setMapInitialized(true);

      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.on("load", () => {
        if (overlayData && overlayData.length > 0) {
          // Create a valid GeoJSON data structure
          const geojsonData = {
            type: "FeatureCollection",
            features: overlayData
              .filter(overlay => overlay.longitude && overlay.latitude) // Filter out any invalid coordinates
              .map((overlay) => ({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [overlay.longitude, overlay.latitude],
                },
                properties: {
                  id: overlay.id,
                  name: overlay.name,
                  location: overlay.location,
                  imageUrl: overlay.image ? getImagePath(overlay.image) : "",
                },
              })),
          };

          // Only add source if there are valid features
          if (geojsonData.features.length > 0) {
            // Check if source already exists and remove it if it does
            if (map.getSource("points")) {
              map.removeLayer("clusters");
              map.removeLayer("cluster-count");
              map.removeLayer("unclustered-point");
              map.removeSource("points");
            }

            map.addSource("points", {
              type: "geojson",
              data: geojsonData,
              cluster: true,
              clusterMaxZoom: 14,
              clusterRadius: 25,
            });

            map.addLayer({
              id: "clusters",
              type: "circle",
              source: "points",
              filter: ["has", "point_count"],
              paint: {
                "circle-color": [
                  "step",
                  ["get", "point_count"],
                  "#ff9999",
                  5,
                  "#ff6666",
                  10,
                  "#ff3333",
                  15,
                  "#cc0000",
                ],
                "circle-radius": [
                  "step",
                  ["get", "point_count"],
                  10,
                  5,
                  15,
                  10,
                  20,
                  25,
                  25,
                ],
                "circle-stroke-color": "#000000",
                "circle-stroke-width": 2,
              },
            });

            map.addLayer({
              id: "cluster-count",
              type: "symbol",
              source: "points",
              filter: ["has", "point_count"],
              layout: {
                "text-field": ["get", "point_count_abbreviated"],
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 14,
              },
              paint: {
                "text-color": "#ffffff",
              },
            });

            map.addLayer({
              id: "unclustered-point",
              type: "circle",
              source: "points",
              filter: ["!", ["has", "point_count"]],
              paint: {
                "circle-color": "#ff0000",
                "circle-radius": 5,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#000000",
              },
            });

            map.on("click", "clusters", (e) => {
              const features = map.queryRenderedFeatures(e.point, {
                layers: ["clusters"],
              });
              const clusterId = features[0].properties.cluster_id;
              map
                .getSource("points")
                .getClusterExpansionZoom(clusterId, (err, zoom) => {
                  if (err) return;

                  map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom,
                  });
                });
            });

            map.on("mouseenter", "unclustered-point", (e) => {
              map.getCanvas().style.cursor = "pointer";

              const coordinates = e.features[0].geometry.coordinates.slice();
              const { id, name, location, imageUrl } = e.features[0].properties;

              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Create popup content with null/undefined checks
              const imgTag = imageUrl ? `<img src="${imageUrl}" height="200" width="200" /><br/>` : '';
              const nameText = name || 'Unknown';
              const locationText = location || 'Unknown location';
              
              const popupContent = `
                <div>
                  ${imgTag}
                  ${id}. ${nameText}<br/>
                  ${locationText}<br/>
                </div>
              `;

              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(map);
            });

            map.on("mouseleave", "unclustered-point", () => {
              map.getCanvas().style.cursor = "";
              const popups = document.getElementsByClassName("mapboxgl-popup");
              if (popups.length) {
                popups[0].remove();
              }
            });

            map.on("click", "unclustered-point", (e) => {
              const { id } = e.features[0].properties;
              window.location.href = `/exhibit?id=${id}&mapType=${mapType}`;
            });

            map.on("mouseenter", "clusters", () => {
              map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", "clusters", () => {
              map.getCanvas().style.cursor = "";
            });
          }
        }
      });

      // Cleanup function to remove the map when component unmounts
      return () => {
        if (map) {
          map.remove();
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(`Failed to initialize map: ${error.message}`);
    }
  }, [center, zoom, style, overlayData, mapType]);

  // Show error state if necessary
  if (mapError) {
    return (
      <div
        style={{
          width: size?.width || "100%",
          height: size?.height || "calc(100% - 20px)",
          minHeight: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          borderRadius: "20px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p>Map could not be loaded: {mapError}</p>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={mapContainerRef}
        style={{
          width: size?.width || "100%",
          height: size?.height || "calc(100% - 20px)",
          minHeight: "600px", 
          borderRadius: "20px",
        }}
      />
      {mapInitialized && (
        <button
          onClick={handleMapToggle}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1,
            backgroundColor: "var(--button-color, rgba(174, 143, 177, 0.8))",
            color: "var(--button-text-color, white)",
            padding: "10px 15px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Switch To {mapType === "originated" ? "Displayed" : "Origin"} Locations
        </button>
      )}
    </div>
  );
};

export default MapBox;
