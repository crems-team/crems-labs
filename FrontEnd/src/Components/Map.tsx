// import './Map.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, Marker, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useMapContext } from '../Components/Map/MapContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/Store';
import { setMapInstance,setLoadingMarkers } from '../Redux/Slices/MapSlice';
import { BeatLoader } from 'react-spinners';



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
    const { setMapInstance } = useMapContext();
    const map = useMap();
    const markers = useSelector((state: RootState) => state.map.markers);
    const dispatch = useDispatch();


  
    useEffect(() => {
      setMapInstance(map);
    }, [map, setMapInstance]);
    console.log(markers);
  
  
    return (
      <>
         {markers.map((marker, index) => (
        <Marker key={index} position={marker.position} >
          <Popup>
            <div>Zip: {marker.zip}</div>
            <div>Street: {marker.street}</div>
            <div>Listings: {marker.nbrlist}</div>
            <div>Agents: {marker.nbragt}</div>
            <div>{marker.position}</div>
          </Popup>
        </Marker>
      ))}
      </>
    );
  };


const CremsMap: React.FC = () => {
    // const dispatch = useDispatch();
    // const markers = useSelector((state: RootState) => state.map.markers);

    // const { setMapInstance } = useMapContext();
    // const map = useMap();
  
    // useEffect(() => {
    //   setMapInstance(map);
    // }, [map, setMapInstance]);

    // const MapEvents = () => {
    //     const map = useMap();
    //     useEffect(() => {
    //       dispatch(setMapInstance(map));
    //     }, [map]);
    //     return null;
    //   };
    const loadingMarkers = useSelector((state: RootState) => state.map.loadingMarkers);


  return (
    <>
      <MapContainer center={[38.6270, -90.1994]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {loadingMarkers && <LoadingOverlay />} 
      {/* {!loadingMarkers && <MapComponent />}  */}
      <MapComponent />
      {/* <MapEvents /> */}
    </MapContainer>
    </>
  );
};

const LoadingOverlay: React.FC = () => {
  const map = useMap(); // Access Leaflet map instance

  return (
    <div
      className="map-loading-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${map.getSize().x}px`,
        height: `${map.getSize().y}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1000,
      }}
    >
      <BeatLoader size={30} /> {/* Spinner component from PrimeReact or any other spinner */}
    </div>
  );
};

// const colorGenerator = (value: number): string => {
//   if (6 > value && value >= 0) {
//     console.log("0");
//     return colorScale[0];
//   } else if (12 > value && value >= 7) {
//     console.log("1");
//     return colorScale[1];
//   } else if (24 > value && value >= 13) {
//     console.log("2");
//     return colorScale[2];
//   } else {
//     console.log("3");
//     return colorScale[3];
//   }
// };

// const position: [number, number] = [41.284708166623396, -103.14654418685602];

// interface CremsMapProps {
//   center: [number, number];
//   zoom: number;
// }

// const CremsMap: React.FC<CremsMapProps> = ({ center, zoom }) => {
//   const [modal, setModal] = useState(false);
//   const [selectedFeature, setSelectedFeature] = useState({});
//   const toggle = () => setModal(!modal);
  

//   console.log("position" + position);
//   console.log("zoom" + JSON.stringify(zoom));

//   useEffect(() => {
//     // Side effects or data fetching logic here
//   }, []);

//   return (
//     <MapContainer center={center} zoom={zoom} style={{ height: '100vh' }}  >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <MapComponent />
//     </MapContainer>
//   );
// };

export default CremsMap;
