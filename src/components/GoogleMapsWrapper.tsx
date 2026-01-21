import {
  APIProvider,
  Map,
  Marker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Coordinates } from "../types";

interface GoogleMapsWrapperProps {
  apiKey: string;
  onMapClick: (coords: Coordinates) => void;
  selectedLocation: Coordinates | null;
}

const NZ_CENTER = { lat: -40.9006, lng: 174.886 };
const DEFAULT_ZOOM = 6;

// Internal component to handle Places Autocomplete
const PlaceAutocomplete = ({
  onPlaceSelect,
}: {
  onPlaceSelect: (place: any) => void;
}) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<any | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
      componentRestrictions: { country: "nz" }, // Restrict to NZ
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a place in NZ..."
          className="w-full px-4 py-3 pl-10 bg-white shadow-lg rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 placeholder-gray-400 transition-all"
        />
        <svg
          className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

// Internal component to handle camera updates when selectedLocation changes externally
const MapUpdater = ({
  selectedLocation,
}: {
  selectedLocation: Coordinates | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (map && selectedLocation) {
      map.panTo(selectedLocation);
      map.setZoom(15);
    }
  }, [map, selectedLocation]);

  return null;
};

const GoogleMapsWrapper: React.FC<GoogleMapsWrapperProps> = ({
  apiKey,
  onMapClick,
  selectedLocation,
}) => {
  const handleMapClick = useCallback(
    (e: any) => {
      if (e?.detail?.latLng) {
        onMapClick({
          lat: e.detail.latLng.lat,
          lng: e.detail.latLng.lng,
        });
      }
    },
    [onMapClick],
  );

  const handlePlaceSelect = useCallback(
    (place: any) => {
      if (place.geometry?.location) {
        onMapClick({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    },
    [onMapClick],
  );

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 p-8 text-center text-gray-500">
        <p>Enter a valid Google Maps API Key to load the map.</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["places"]}>
      <div className="h-full w-full relative">
        <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />

        <Map
          defaultCenter={NZ_CENTER}
          defaultZoom={DEFAULT_ZOOM}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          onClick={handleMapClick}
          className="h-full w-full outline-none"
          mapId="DEMO_MAP_ID" // Required for AdvancedMarker
        >
          {selectedLocation && <Marker position={selectedLocation} />}
          <MapUpdater selectedLocation={selectedLocation} />
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMapsWrapper;
