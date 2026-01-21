
export interface Coordinates {
    lat: number;
    lng: number;
}

export interface LocationDetails {
    address: string;
    suburb: string;
    city: string;
}


// Either google or open streem map
export type MapProvider = "google" | 'osm';