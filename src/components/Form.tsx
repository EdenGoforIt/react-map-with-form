import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Coordinates, LocationDetails, MapProvider } from "../types";

interface FormProp {
  coordinates: Coordinates | null;
  locationDetails: LocationDetails | null;
  mapProvider: MapProvider;
  setMapProvider: (provider: MapProvider) => void;
  mapApiKey: string;
  setMapApiKey: (key: string) => void;
  isLoading: boolean;
  onClear: () => void;
}

const Form: React.FC<FormProp> = ({
  coordinates,
  locationDetails,
  mapProvider,
  setMapProvider,
  mapApiKey,
  setMapApiKey,
  isLoading,
  onClear,
}) => {
  const formatCoordinates = (val: number | undefined) =>
    val ? val.toFixed(6) : "";

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-8 flex-1">
        {/* Map Provider Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Map Provider
            </label>
          </div>

          <div className="relative">
            <select
              value={mapProvider}
              onChange={(e) => setMapProvider(e.target.value as MapProvider)}
              className="block w-full rounded-lg border-gray-300 bg-white border px-4 py-2.5 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none cursor-pointer"
            >
              <option value="osm">OpenStreetMap (Free)</option>
              <option value="google">Google Maps (API Key Required)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {mapProvider === "google" && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mt-2">
              <label className="block text-xs font-medium text-yellow-800 mb-1">
                Google API Key
              </label>
              <input
                type="password"
                value={mapApiKey}
                onChange={(e) => setMapApiKey(e.target.value)}
                placeholder="Paste API Key here"
                className="w-full p-2 text-xs border border-yellow-200 rounded focus:ring-yellow-500 focus:border-yellow-500 bg-white"
              />
            </div>
          )}
          {mapProvider === "osm" && (
            <p className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-100">
              ✓ Ready to use. No API key required.
            </p>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Location Details Form */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Location Details
            </h2>
            {isLoading && (
              <span className="text-xs text-indigo-600 font-medium animate-pulse">
                Fetching address...
              </span>
            )}
          </div>

          <div className="space-y-4">
            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
                Address
              </label>
              <textarea
                readOnly
                rows={3}
                value={locationDetails?.address || ""}
                placeholder="Address will appear here..."
                className="block w-full rounded-md border-gray-200 bg-gray-50 border px-3 py-2 text-gray-800 text-sm focus:outline-none resize-none"
              />
            </div>

            {/* City & Suburb */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
                  City / Town
                </label>
                <input
                  type="text"
                  value={locationDetails?.city || ""}
                  placeholder="-"
                  className="block w-full rounded-md border-gray-200 bg-gray-50 border px-3 py-2 text-gray-800 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
                  Suburb
                </label>
                <input
                  type="text"
                  value={locationDetails?.suburb || ""}
                  placeholder="-"
                  className="block w-full rounded-md border-gray-200 bg-gray-50 border px-3 py-2 text-gray-800 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">
                  Latitude
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formatCoordinates(coordinates?.lat)}
                    placeholder="0.000000"
                    className="block w-full rounded-md border-gray-200 bg-white border px-3 py-2 text-gray-600 font-mono text-xs focus:outline-none shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">
                  Longitude
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formatCoordinates(coordinates?.lng)}
                    placeholder="0.000000"
                    className="block w-full rounded-md border-gray-200 bg-white border px-3 py-2 text-gray-600 font-mono text-xs focus:outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {!coordinates && (
            <p className="text-xs text-gray-400 italic text-center pt-2">
              Click anywhere on the map to capture location data.
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClear}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => console.log({ coordinates, locationDetails })}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Submit
            </button>
          </div>

          {/* JSON Data Preview */}
          {coordinates && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-400 mb-2 uppercase">
                JSON Data
              </p>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                  maxHeight: "10rem",
                  margin: 0,
                }}
              >
                {JSON.stringify({ coordinates, locationDetails }, null, 2)}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
        <p className="text-[10px] text-gray-400">
          {mapProvider === "google"
            ? "Powered by Google Maps Platform"
            : "Powered by OpenStreetMap & Nominatim"}
        </p>
      </div>
    </div>
  );
};

export default Form;
