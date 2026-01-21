import { useState } from 'react'
import './App.css'
import { type MapProvider, type Coordinates, type LocationDetails } from './types';
import Form from './components/Form';

 
const ENV_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App: React.FC = () => {
  const [mapProvider, setMapProvider] = useState<MapProvider>("osm");
  const [mapApiKey, setMapApiKey] = useState<string>(ENV_MAPS_KEY);

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className='flex flex-col md:flex-row h-screen w-full bg-ray-100'>
      {/* Left panel: Currently we have a form in the center, but we could move that to the left */}
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
  )
};

export default App
