export interface GeoData {
  type: string;
  features: Feature[];
}

export interface Feature {
  id: string;
  type: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface MapLevel {
  level: 'country' | 'state' | 'county';
  selectedState?: string;
  selectedCounty?: string;
}