"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";

const MapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [routePolyline, setRoutePolyline] = useState<string | null>(null);
  const [travelInfo, setTravelInfo] = useState<{
    distance: string | null;
    duration: string | null;
  }>({ distance: null, duration: null });

  const [loading, setLoading] = useState(true);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting current location:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry) {
      setDestination({
        lat: place.geometry.location?.lat() || 0,
        lng: place.geometry.location?.lng() || 0,
      });
    }
  };

  useEffect(() => {
    const fetchRoute = async () => {
      if (currentLocation && destination) {
        try {
          const response = await fetch(
            `https://routes.googleapis.com/directions/v2:computeRoutes?key=${GOOGLE_MAPS_API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Goog-FieldMask":
                  "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
              },
              body: JSON.stringify({
                origin: {
                  location: {
                    latLng: {
                      latitude: currentLocation.lat,
                      longitude: currentLocation.lng,
                    },
                  },
                },
                destination: {
                  location: {
                    latLng: {
                      latitude: destination.lat,
                      longitude: destination.lng,
                    },
                  },
                },
                travelMode: "DRIVE",
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();

            const route = data.routes[0];

            setRoutePolyline(route.polyline.encodedPolyline);

            const durationString = route.duration || "0s";
            const durationSeconds = parseInt(
              durationString.replace("s", ""),
              10
            );

            const hours = Math.floor(durationSeconds / 3600);
            const minutes = Math.ceil((durationSeconds % 3600) / 60);

            const formattedDuration =
              durationSeconds > 0
                ? hours > 0
                  ? `${hours} hrs ${minutes} mins`
                  : `${minutes} mins`
                : "Unavailable";

            const distanceMeters = route.distanceMeters ?? 0;

            setTravelInfo({
              distance:
                distanceMeters > 0
                  ? `${(distanceMeters / 1000).toFixed(2)} km`
                  : "Unavailable",
              duration: formattedDuration,
            });
          } else {
            console.error("Failed to fetch route:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      }
    };

    fetchRoute();
  }, [currentLocation, destination]);

  const decodePolyline = (encoded: string) => {
    const points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }

    return points;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {currentLocation && (
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;

            if (autocomplete) {
              autocomplete.setOptions({
                bounds: new google.maps.LatLngBounds(currentLocation),
                strictBounds: false,
              });
            }
          }}
          onPlaceChanged={handlePlaceChanged}
          className="w-full"
        >
          <input
            type="text"
            placeholder="Search for a destination"
            className="appearance-none block w-full py-3 px-4 leading-tight text-gray-700 bg-white border border-gray-200 rounded focus:outline-none w-full"
          />
        </Autocomplete>
      )}

      <div className="w-full h-96 md:h-[60vh] lg:h-[70vh] max-w-7xl">
        {loading ? (
          <span className="loading loading-spinner loading-lg bg-orange-400 "></span>
        ) : (
          <GoogleMap
            zoom={14}
            center={currentLocation || { lat: 51.509865, lng: -0.118092 }}
            mapContainerClassName="w-full h-full"
          >
            {currentLocation && <Marker position={currentLocation} />}
            {destination && <Marker position={destination} />}
            {routePolyline && (
              <Polyline
                path={decodePolyline(routePolyline)}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                }}
              />
            )}
            {destination && travelInfo.distance && travelInfo.duration && (
              <InfoWindow position={destination}>
                <div className="text-neutral">
                  <p>
                    <strong>Distance:</strong> {travelInfo.distance}
                  </p>
                  <p>
                    <strong>Duration:</strong> {travelInfo.duration}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
