import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet';

// Define the types for the context values
interface MapContextType {
  zoomToLocation: (zoomLevel: number, center: [number, number]) => void;
  setMapInstance: (map: LeafletMap | null) => void;
  getMapInstance: () => LeafletMap | undefined;
  addMarker: (element: any) => void;
  setMarkers: React.Dispatch<React.SetStateAction<any[]>>;
  markers: any[];
  transactions: any[];
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;

}

// Create the context with a default value of null
const MapContext = createContext<MapContextType | null>(null);

// Custom hook to use the MapContext
export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};

// Define the props for the provider component
interface MapProviderProps {
  children: ReactNode;
}

// Create the MapProvider component
export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const mapRef = useRef<LeafletMap | undefined>(undefined);
  const [markers, setMarkers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);


  const getMapInstance = (): LeafletMap | undefined => {
    return mapRef.current;
  };

  const setMapInstance = (map: LeafletMap | null): void => {
    mapRef.current = map ?? undefined;
  };

  const zoomToLocation = (zoomLevel: number, center: [number, number]): void => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoomLevel);
    }
  };

  const addMarker = (element: any): void => {
    setMarkers((prevMarkers) => [...prevMarkers, element]);
  };

  const showPanel = (index: number): void => {
   
  };

  return (
    <MapContext.Provider value={{ zoomToLocation, setMapInstance, getMapInstance, addMarker, setMarkers, markers, transactions, setTransactions}}>
      {children}
    </MapContext.Provider>
  );
};