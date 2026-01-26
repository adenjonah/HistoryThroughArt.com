import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import artPiecesData from "../../data/artworks.json";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const images = require.context("../../artImages", false, /\.webp$/);

const MapBox = ({ center, zoom, style, size, onMapTypeChange, mapType: initialMapType }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const [mapType, setMapType] = useState(initialMapType || "originated");
  const [overlayData, setOverlayData] = useState([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Close popup helper
  const closePopup = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  }, []);

  // Show popup helper
  const showPopup = useCallback((map, coordinates, properties) => {
    closePopup();

    const { id, name, location, imageUrl } = properties;
    const nameText = name || 'Unknown';
    const locationText = location || 'Unknown location';

    const popupContent = `
      <div class="map-popup-content">
        ${imageUrl ? `
          <img src="${imageUrl}" class="map-popup-image" alt="${nameText}" />
        ` : ''}
        <p class="map-popup-title">${id}. ${nameText}</p>
        <p class="map-popup-location">${locationText}</p>
        <p class="map-popup-hint">Tap to view details</p>
      </div>
    `;

    popupRef.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: isMobile ? '260px' : '300px',
      offset: isMobile ? 15 : 10,
    })
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map);
  }, [closePopup, isMobile]);

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
      while (mapContainerRef.current.firstChild) {
        mapContainerRef.current.removeChild(mapContainerRef.current.firstChild);
      }
    }

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

      // Add navigation controls - position based on device
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: !isMobile }),
        "top-right"
      );

      // Add geolocation control for mobile
      if (isMobile) {
        map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: false,
            showUserHeading: false,
          }),
          "top-right"
        );
      }

      map.on("load", () => {
        if (overlayData && overlayData.length > 0) {
          const geojsonData = {
            type: "FeatureCollection",
            features: overlayData
              .filter(overlay => overlay.longitude && overlay.latitude)
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

          if (geojsonData.features.length > 0) {
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
              clusterRadius: isMobile ? 40 : 25,
            });

            // Clusters layer - larger on mobile for touch
            map.addLayer({
              id: "clusters",
              type: "circle",
              source: "points",
              filter: ["has", "point_count"],
              paint: {
                "circle-color": [
                  "step",
                  ["get", "point_count"],
                  "rgba(112, 71, 163, 0.6)",
                  10,
                  "rgba(112, 71, 163, 0.8)",
                  25,
                  "rgba(112, 71, 163, 1)",
                ],
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["get", "point_count"],
                  2, isMobile ? 16 : 12,
                  10, isMobile ? 24 : 18,
                  50, isMobile ? 34 : 28,
                  100, isMobile ? 44 : 36,
                ],
                "circle-stroke-color": "rgba(255, 255, 255, 0.8)",
                "circle-stroke-width": 2,
                "circle-blur": 0.15,
                "circle-opacity": 0.95,
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
                "text-size": isMobile ? 16 : 14,
              },
              paint: {
                "text-color": "#ffffff",
              },
            });

            // Unclustered points - larger touch targets on mobile
            map.addLayer({
              id: "unclustered-point",
              type: "circle",
              source: "points",
              filter: ["!", ["has", "point_count"]],
              paint: {
                "circle-color": "#7047A3",
                "circle-radius": isMobile ? 12 : 7,
                "circle-stroke-width": 2,
                "circle-stroke-color": "rgba(255, 255, 255, 0.8)",
              },
            });

            // Cluster click - zoom in
            map.on("click", "clusters", (e) => {
              closePopup();
              const features = map.queryRenderedFeatures(e.point, {
                layers: ["clusters"],
              });
              const clusterId = features[0].properties.cluster_id;
              map
                .getSource("points")
                .getClusterExpansionZoom(clusterId, (err, expandZoom) => {
                  if (err) return;

                  map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: expandZoom,
                    duration: 500,
                  });
                });
            });

            // Point click - show popup and navigate
            map.on("click", "unclustered-point", (e) => {
              const coordinates = e.features[0].geometry.coordinates.slice();
              const properties = e.features[0].properties;

              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // If popup is already open for this point, navigate
              if (popupRef.current && popupRef.current._lngLat) {
                const currentLng = popupRef.current._lngLat.lng;
                const currentLat = popupRef.current._lngLat.lat;
                if (
                  Math.abs(currentLng - coordinates[0]) < 0.0001 &&
                  Math.abs(currentLat - coordinates[1]) < 0.0001
                ) {
                  window.location.href = `/exhibit?id=${properties.id}&mapType=${mapType}`;
                  return;
                }
              }

              showPopup(map, coordinates, properties);
            });

            // Desktop hover behavior
            if (!isMobile) {
              map.on("mouseenter", "unclustered-point", (e) => {
                map.getCanvas().style.cursor = "pointer";
                const coordinates = e.features[0].geometry.coordinates.slice();
                const properties = e.features[0].properties;

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                showPopup(map, coordinates, properties);
              });

              map.on("mouseleave", "unclustered-point", () => {
                map.getCanvas().style.cursor = "";
                closePopup();
              });
            }

            // Cursor styling
            map.on("mouseenter", "clusters", () => {
              map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", "clusters", () => {
              map.getCanvas().style.cursor = "";
            });

            if (isMobile) {
              map.on("mouseenter", "unclustered-point", () => {
                map.getCanvas().style.cursor = "pointer";
              });
              map.on("mouseleave", "unclustered-point", () => {
                map.getCanvas().style.cursor = "";
              });
            }

            // Close popup when clicking elsewhere on the map
            map.on("click", (e) => {
              const features = map.queryRenderedFeatures(e.point, {
                layers: ["unclustered-point", "clusters"],
              });
              if (features.length === 0) {
                closePopup();
              }
            });
          }
        }
      });

      return () => {
        closePopup();
        if (map) {
          map.remove();
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(`Failed to initialize map: ${error.message}`);
    }
  }, [center, zoom, style, overlayData, mapType, isMobile, closePopup, showPopup]);

  // Show error state if necessary
  if (mapError) {
    return (
      <div
        className="flex items-center justify-center bg-[var(--foreground-color)]
          rounded-2xl p-5 text-center min-h-[300px] md:min-h-[400px]"
        style={{
          width: size?.width || "100%",
          height: size?.height || "100%",
        }}
      >
        <p className="text-[var(--text-color)] opacity-70 text-sm md:text-base px-4">
          Map could not be loaded: {mapError}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[350px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[600px] rounded-2xl"
        style={{
          width: size?.width || "100%",
          height: size?.height || "100%",
        }}
      />
      {mapInitialized && (
        <button
          onClick={handleMapToggle}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10
            px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg
            bg-[var(--foreground-color)] text-[var(--background-color)]
            font-medium text-xs sm:text-sm
            shadow-lg hover:shadow-xl active:scale-95
            transition-all duration-200
            hover:scale-105 border-none cursor-pointer
            touch-manipulation select-none"
          aria-label={mapType === "originated" ? "Show current locations" : "Show origin locations"}
        >
          {mapType === "originated" ? "Show Current Locations" : "Show Origins"}
        </button>
      )}
    </div>
  );
};

export default MapBox;
