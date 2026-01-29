import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useArtworks } from "../../hooks/useSanityData";
import { getImageHotspot } from "../../lib/sanity";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

// =============================================================================
// SPINNING GLOBE FEATURE - Set to false to disable globe spin on load
// =============================================================================
const ENABLE_GLOBE_SPIN = true;
const GLOBE_SPIN_SPEED = 0.5; // degrees per frame (lower = slower)
const GLOBE_INITIAL_ZOOM = 1.5; // zoomed out to show full globe
// =============================================================================

const MapBox = ({ center, zoom, style, size, onMapTypeChange, mapType: initialMapType }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const spinAnimationRef = useRef(null);
  const userInteractedRef = useRef(false); // Use ref to avoid re-render on interaction
  const [mapType, setMapType] = useState(initialMapType || "originated");
  const [overlayData, setOverlayData] = useState([]);
  const [missingLocationData, setMissingLocationData] = useState([]);
  const [showMissingPanel, setShowMissingPanel] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Fetch artworks from Sanity
  const { artworks: artPiecesData, loading: artworksLoading } = useArtworks();

  // Handle resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleModeChange = (newMode) => {
    if (newMode === mapType) return;
    setMapType(newMode);
    if (onMapTypeChange) {
      onMapTypeChange(newMode);
    }
  };

  // Get image URL - images from Sanity are already URLs
  const getImagePath = (imageUrl) => {
    if (!imageUrl) return "";
    // Sanity images come as full URLs
    if (imageUrl.startsWith('http')) return imageUrl;
    return imageUrl;
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

    const { id, name, location, imageUrl, imageHotspot } = properties;
    const nameText = name || 'Unknown';
    const locationText = location || 'Unknown location';
    const hotspotStyle = imageHotspot || 'center center';

    const popupContent = `
      <div class="map-popup-content">
        ${imageUrl ? `
          <img src="${imageUrl}" class="map-popup-image" style="object-position: ${hotspotStyle};" alt="${nameText}" />
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

  // Update overlay data when map type changes or artworks load
  useEffect(() => {
    if (artworksLoading || artPiecesData.length === 0) return;

    if (mapType === "originated") {
      const withCoords = artPiecesData.filter(
        (piece) => piece.originatedLatitude && piece.originatedLongitude
      );
      const withoutCoords = artPiecesData.filter(
        (piece) => !piece.originatedLatitude || !piece.originatedLongitude
      );
      const overlayData = withCoords.map((piece) => ({
        id: piece.id,
        name: piece.name,
        location: piece.location,
        latitude: piece.originatedLatitude,
        longitude: piece.originatedLongitude,
        image: piece.image && piece.image.length > 0 ? piece.image[0] : null,
        imageHotspot: getImageHotspot(piece.imageData?.[0]),
      }));
      setOverlayData(overlayData);
      setMissingLocationData(withoutCoords.map((piece) => ({
        id: piece.id,
        name: piece.name,
        location: piece.location || 'Unknown origin',
      })));
    } else {
      const withCoords = artPiecesData.filter(
        (piece) => piece.displayedLatitude && piece.displayedLongitude
      );
      const withoutCoords = artPiecesData.filter(
        (piece) => !piece.displayedLatitude || !piece.displayedLongitude
      );
      const overlayData = withCoords.map((piece) => ({
        id: piece.id,
        name: piece.name,
        location: piece.displayedLocation,
        latitude: piece.displayedLatitude,
        longitude: piece.displayedLongitude,
        image: piece.image && piece.image.length > 0 ? piece.image[0] : null,
        imageHotspot: getImageHotspot(piece.imageData?.[0]),
      }));
      setOverlayData(overlayData);
      setMissingLocationData(withoutCoords.map((piece) => ({
        id: piece.id,
        name: piece.name,
        location: piece.displayedLocation || piece.museum || 'Location unknown',
      })));
    }
  }, [mapType, artPiecesData, artworksLoading]);

  // Initialize the map
  useEffect(() => {
    // Don't initialize if still loading or container not ready
    if (artworksLoading || !mapContainerRef.current) {
      return;
    }

    // Check for mapbox token
    if (!mapboxgl.accessToken) {
      setMapError("Mapbox access token is missing");
      return;
    }

    // Ensure the map container is empty before initializing
    while (mapContainerRef.current.firstChild) {
      mapContainerRef.current.removeChild(mapContainerRef.current.firstChild);
    }

    const defaultZoom = isMobile ? 1 : 4;

    // Globe spin: use zoomed-out view if enabled and user hasn't interacted yet
    const useGlobeSpin = ENABLE_GLOBE_SPIN && !userInteractedRef.current;
    const initialZoom = useGlobeSpin ? GLOBE_INITIAL_ZOOM : (zoom !== undefined ? zoom : defaultZoom);

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: style || "mapbox://styles/mapbox/satellite-streets-v12",
        center: center || [0, 20], // Center on prime meridian for globe view
        zoom: initialZoom,
        projection: useGlobeSpin ? 'globe' : 'mercator',
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

      // Globe spin animation
      const spinGlobe = () => {
        if (!mapRef.current || userInteractedRef.current) return;
        const currentCenter = map.getCenter();
        map.setCenter([currentCenter.lng + GLOBE_SPIN_SPEED, currentCenter.lat]);
        spinAnimationRef.current = requestAnimationFrame(spinGlobe);
      };

      // Stop spinning when user interacts (no re-render needed)
      const stopSpinning = () => {
        if (spinAnimationRef.current) {
          cancelAnimationFrame(spinAnimationRef.current);
          spinAnimationRef.current = null;
        }
        userInteractedRef.current = true;
      };

      // Set up interaction listeners to stop spin (only if globe spin enabled)
      if (useGlobeSpin) {
        map.on('mousedown', stopSpinning);
        map.on('touchstart', stopSpinning);
        map.on('wheel', stopSpinning);
        map.on('dragstart', stopSpinning);
      }

      map.on("load", () => {
        // Start globe spin animation if enabled
        if (useGlobeSpin) {
          // Add atmosphere for globe effect
          map.setFog({
            color: 'rgb(186, 210, 235)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.02,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6
          });
          spinAnimationRef.current = requestAnimationFrame(spinGlobe);
        }
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
                  imageHotspot: overlay.imageHotspot || "center center",
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
        // Cancel spin animation on cleanup
        if (spinAnimationRef.current) {
          cancelAnimationFrame(spinAnimationRef.current);
          spinAnimationRef.current = null;
        }
        closePopup();
        if (map) {
          map.remove();
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(`Failed to initialize map: ${error.message}`);
    }
  }, [center, zoom, style, overlayData, mapType, isMobile, closePopup, showPopup, artworksLoading]);

  // Show loading state
  if (artworksLoading) {
    return (
      <div
        className="flex items-center justify-center bg-[var(--foreground-color)]
          rounded-2xl p-5 text-center min-h-[300px] md:min-h-[400px]"
        style={{
          width: size?.width || "100%",
          height: size?.height || "100%",
        }}
      >
        <p className="text-[var(--text-color)] animate-pulse text-sm md:text-base px-4">
          Loading map data...
        </p>
      </div>
    );
  }

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
        <>
          {/* Segmented mode toggle */}
          <div
            className="map-mode-toggle absolute top-3 left-3 sm:top-4 sm:left-4 z-10"
            role="tablist"
            aria-label="Map view mode"
          >
            <button
              role="tab"
              aria-selected={mapType === "originated"}
              className={mapType === "originated" ? "active" : ""}
              onClick={() => handleModeChange("originated")}
            >
              Origins
            </button>
            <button
              role="tab"
              aria-selected={mapType === "currentlyDisplayed"}
              className={mapType === "currentlyDisplayed" ? "active" : ""}
              onClick={() => handleModeChange("currentlyDisplayed")}
            >
              Current
            </button>
          </div>

          {/* Status bar with counter and warning badge */}
          <div className="map-status-bar absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
            <span>
              <strong>{overlayData.length}</strong> of {overlayData.length + missingLocationData.length} mapped
            </span>
            {missingLocationData.length > 0 && (
              <button
                className="map-status-warning"
                onClick={() => setShowMissingPanel(!showMissingPanel)}
                aria-expanded={showMissingPanel}
                aria-label={`${missingLocationData.length} artworks unmapped`}
              >
                ! {missingLocationData.length} unmapped
              </button>
            )}
          </div>

          {/* Missing locations panel - opens upward from status bar */}
          {showMissingPanel && missingLocationData.length > 0 && (
            <div className="map-missing-panel absolute bottom-16 left-3 sm:bottom-[72px] sm:left-4 z-20 w-[280px] sm:w-[320px]">
              <div className="map-missing-panel-header">
                <div>
                  <h3>
                    {mapType === "originated" ? "Missing Origin" : "Not on Display"}
                  </h3>
                  <p>
                    {missingLocationData.length} artwork{missingLocationData.length !== 1 ? 's' : ''} without coordinates
                  </p>
                </div>
                <button
                  className="map-missing-panel-close"
                  onClick={() => setShowMissingPanel(false)}
                  aria-label="Close panel"
                >
                  ×
                </button>
              </div>
              <ul className="map-missing-panel-list">
                {missingLocationData.map((piece) => (
                  <li key={piece.id}>
                    <a href={`/exhibit?id=${piece.id}&mapType=${mapType}`}>
                      <span className="artwork-name">
                        {piece.id}. {piece.name}
                      </span>
                      <span className="artwork-location">
                        {piece.location}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapBox;
