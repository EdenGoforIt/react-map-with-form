import { useCallback, useState } from "react";
import "./App.css";
import Form from "./components/Form";
import GoogleMapsWrapper from "./components/GoogleMapsWrapper";
import LeafletMapWrapper from "./components/LeafletMapWrapper";
import {
  type Coordinates,
  type LocationDetails,
  type MapProvider,
} from "./types";

const ENV_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App: React.FC = () => {
  const [mapProvider, setMapProvider] = useState<MapProvider>("osm");
  const [mapApiKey, setMapApiKey] = useState<string>(ENV_MAPS_KEY);

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const reverseGeocode = useCallback(
    async (coords: Coordinates): Promise<LocationDetails | null> => {
      if (mapProvider === "google" && mapApiKey) {
        // Google Geocoding API
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${mapApiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const components = result.address_components || [];

          const getComponent = (types: string[]) =>
            components.find((c: { types: string[] }) =>
              types.some((t) => c.types.includes(t))
            )?.long_name || "";

          return {
            address: result.formatted_address || "",
            suburb: getComponent(["sublocality", "neighborhood"]),
            city: getComponent(["locality", "administrative_area_level_2"]),
          };
        }
      } else {
        // Nominatim (OpenStreetMap) reverse geocoding
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.address) {
          const addr = data.address;
          return {
            address: data.display_name || "",
            suburb: addr.suburb || addr.neighbourhood || addr.hamlet || "",
            city:
              addr.city || addr.town || addr.village || addr.municipality || "",
          };
        }
      }
      return null;
    },
    [mapProvider, mapApiKey]
  );

  const handleMapClick = useCallback(
    async (coords: Coordinates) => {
      setCoordinates(coords);
      setIsLoading(true);
      setLocationDetails(null);

      try {
        const details = await reverseGeocode(coords);
        setLocationDetails(details);
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [reverseGeocode]
  );
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-100">
      {/* Left Panel: Form & Info */}
      <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 h-1/2 md:h-full z-20 shadow-xl relative">
        <Form
          coordinates={coordinates}
          locationDetails={locationDetails}
          mapProvider={mapProvider}
          setMapProvider={setMapProvider}
          mapApiKey={mapApiKey}
          setMapApiKey={setMapApiKey}
          isLoading={isLoading}
        />
      </div>

      {/* Right Panel: Map */}
      <div className="flex-1 h-1/2 md:h-full relative z-10">
        {mapProvider === "google" ? (
          <GoogleMapsWrapper
            apiKey={mapApiKey}
            onMapClick={handleMapClick}
            selectedLocation={coordinates}
          />
        ) : (
          <LeafletMapWrapper
            onMapClick={handleMapClick}
            selectedLocation={coordinates}
          />
        )}
      </div>
    </div>
  );
};

export default App;
