import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import type { Coordinates } from "../types";

// TODO: Remove Any and provide the right type
// Fix for default marker icons in webpack/esm environments
const fixLeafletIcons = () => {
  const iconRetinaUrl =
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
  const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
  const shadowUrl =
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  });
};

fixLeafletIcons();

interface LeafletMapWrapperProps {
  onMapClick: (coords: Coordinates) => void;
  selectedLocation: Coordinates | null;
}

const NZ_CENTER: Coordinates = { lat: -41.5, lng: 172.5 };
const DEFAULT_ZOOM = 5;

const LeafletMapWrapper: React.FC<LeafletMapWrapperProps> = ({
  onMapClick,
  selectedLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setIsDropdownOpen(false);
      }
    }, 800); // 800ms debounce to be nice to Nominatim

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // Use Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=nz&limit=5&addressdetails=1`,
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
      setIsDropdownOpen(true);
    } catch (err) {
      console.error("Search failed", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView([NZ_CENTER.lat, NZ_CENTER.lng], DEFAULT_ZOOM);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        crossOrigin: "anonymous",
      }).addTo(map);

      map.on("click", (e: L.LeafletMouseEvent) => {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
        setIsDropdownOpen(false); // Close dropdown on map click
      });

      mapInstanceRef.current = map;
    }
  }, [onMapClick]);

  // Handle Markers & Pan
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (selectedLocation) {
      if (markerRef.current) {
        markerRef.current.setLatLng([
          selectedLocation.lat,
          selectedLocation.lng,
        ]);
      } else {
        markerRef.current = L.marker([
          selectedLocation.lat,
          selectedLocation.lng,
        ]).addTo(map);
      }
      map.setView([selectedLocation.lat, selectedLocation.lng], 15, {
        animate: true,
      });
    }
  }, [selectedLocation]);

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    onMapClick({ lat, lng });
    setSearchResults([]);
    setIsDropdownOpen(false);
    setSearchQuery(result.display_name.split(",")[0]); // simplified name in input
  };

  return (
    <div className="relative h-full w-full">
      {/* Search Overlay */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[2000] w-full max-w-md px-4 pointer-events-none">
        <div className="pointer-events-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search NZ using OpenStreetMap..."
            className="w-full px-4 py-3 pl-10 bg-white shadow-lg rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-slate-800 placeholder-gray-400 transition-all"
            onFocus={() => {
              if (searchResults.length > 0) setIsDropdownOpen(true);
            }}
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
          {isSearching && (
            <div className="absolute right-3 top-3.5 h-5 w-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isDropdownOpen && searchResults.length > 0 && (
          <div className="pointer-events-auto mt-2 bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
            <ul>
              {searchResults.map((result, idx) => (
                <li
                  key={result.place_id || idx}
                  onClick={() => selectSearchResult(result)}
                  className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-none text-sm text-slate-700 transition-colors text-left"
                >
                  <p className="font-medium truncate">
                    {result.display_name.split(",")[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {result.display_name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        ref={mapContainerRef}
        className="h-full w-full outline-none bg-slate-100"
      />
    </div>
  );
};

export default LeafletMapWrapper;
