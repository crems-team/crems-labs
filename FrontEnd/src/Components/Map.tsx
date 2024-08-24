// import './Map.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, Marker, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useMapContext } from '../Components/Map/MapContext';

// Define the marker interface
interface MarkerData {
  position: [number, number];
  zip: string;
  street: string;
  nbrlist: string;
  nbragt: string;
  icon: Icon;
}

const colorScale = ["#4d1c19", "#61332e", "#754a45", "#88625c"];

const MapComponent: React.FC = () => {
  const { setMapInstance, markers } = useMapContext();
  const map = useMap();

  useEffect(() => {
    setMapInstance(map);
  }, [map, setMapInstance]);
  console.log(markers);

  useEffect(() => {
    console.log('Markers:', markers);
  }, [markers]);

  return (
    <>
      {markers.map((element: MarkerData, idx: number) => (
        <Marker key={idx} position={element.position} >
          <Popup>
          ZIP CODE :{element.zip} <br /> 
          {element.street}  <br /> 
          {element.nbrlist} Listings  <br /> 
          {element.nbragt} Agents  <br /> 
          {element.position}          
          </Popup>
        </Marker>
      ))}
    </>
  );
};

const colorGenerator = (value: number): string => {
  if (6 > value && value >= 0) {
    console.log("0");
    return colorScale[0];
  } else if (12 > value && value >= 7) {
    console.log("1");
    return colorScale[1];
  } else if (24 > value && value >= 13) {
    console.log("2");
    return colorScale[2];
  } else {
    console.log("3");
    return colorScale[3];
  }
};

const position: [number, number] = [41.284708166623396, -103.14654418685602];

interface CremsMapProps {
  center: [number, number];
  zoom: number;
}

const CremsMap: React.FC<CremsMapProps> = ({ center, zoom }) => {
  const [modal, setModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState({});
  const toggle = () => setModal(!modal);
  

  console.log("position" + position);
  console.log("zoom" + JSON.stringify(zoom));

  useEffect(() => {
    // Side effects or data fetching logic here
  }, []);

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100vh' }}  >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapComponent />
    </MapContainer>
  );
};

export default CremsMap;
