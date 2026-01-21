# React Map with Form

A React application that allows users to select locations on an interactive map and capture address details through reverse geocoding.

## Features

- **Dual Map Provider Support**
  - OpenStreetMap (Leaflet) - Free, no API key required
  - Google Maps - Requires API key

- **Location Selection**
  - Click anywhere on the map to select a location
  - Search for addresses (OpenStreetMap provider)
  - Automatic marker placement

- **Reverse Geocoding**
  - Automatically fetches address details when a location is selected
  - Displays full address, city/town, and suburb
  - Shows coordinates (latitude/longitude)

- **Form Features**
  - Clear button to reset selection
  - Submit button to log data to console
  - Live JSON preview with syntax highlighting

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Leaflet (OpenStreetMap)
- @vis.gl/react-google-maps (Google Maps)
- react-syntax-highlighter

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Note: Google Maps API key is optional. The app defaults to OpenStreetMap which requires no API key.

## Usage

1. Select a map provider from the dropdown (OpenStreetMap is default)
2. Click anywhere on the map to select a location
3. The form will automatically populate with:
   - Full address
   - City/Town
   - Suburb (if available)
   - Latitude and Longitude
4. View the JSON data preview at the bottom
5. Click "Submit" to log data to console or "Clear" to reset

## API Attribution

- OpenStreetMap data is provided by [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)
- Geocoding powered by [Nominatim](https://nominatim.openstreetmap.org/)
