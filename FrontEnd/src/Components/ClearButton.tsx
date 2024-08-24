import React,{ useState, useEffect, useRef }  from 'react';
import { useMapContext } from './Map/MapContext';
import { Button } from 'primereact/button';
import GeoAreaService from "../Services/GeoAreaService";
import { Icon, icon } from 'leaflet';
import Zip from "../Models/Zip";
import Cities from "../Models/Cities";
import CityCoordinates from "../Models/CityCoordinates";
import { Transaction } from 'neo4j-driver';



// interface Zip {
//   zip: string;
//   lat: number;
//   lng: number;
// }

// interface City {
//   code: string;
//   lat: number;
//   lng: number;
// }

interface ClearButtonProps {
    clearData: () => void;
  }



const ClearButton: React.FC<ClearButtonProps> = ({ clearData }) => {
    const { zoomToLocation, getMapInstance, markers, addMarker, setMarkers, setTransactions } = useMapContext();


  
  var center: [number, number] =[0,0];
  let marker = null;

  const handleClear = async () => {

    setMarkers([]);
    setTransactions([]);
  

    center = [36.7783, -119.4179];
    zoomToLocation(5, center);
    clearData();
        
  };

  return (
    <Button className="m-1" label="Clear" icon="pi pi-times" size="small" onClick={() => handleClear()} />
  );
};

export default ClearButton;
