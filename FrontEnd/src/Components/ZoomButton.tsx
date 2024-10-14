import React,{ useState, useEffect, useRef,forwardRef }  from 'react';
import { useMapContext } from './Map/MapContext';
import { Button } from 'primereact/button';
import GeoAreaService from "../Services/GeoAreaService";
import { Icon, icon } from 'leaflet';
import Zip from "../Models/Zip";
import Cities from "../Models/Cities";
import States from "../Models/States";
import Counties from "../Models/Counties";



import CityCoordinates from "../Models/CityCoordinates";
import { Transaction } from 'neo4j-driver';
// import { useDispatch } from 'react-redux';
import { useAppDispatch } from '../Hooks/DispatchHook';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';

import { fetchTotalTransactions,fetchTotalAgents ,fetchTransactions,setActivityReportClicked,setNbrMonthSaveSearch} from '../Redux/Slices/MapSlice';



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

interface ZoomButtonProps {
  zoom: number;
  Currentstate : States | null,
  CurrentCounty :Counties | null,
  zips: Zip[];
  city: Cities | null;
  // isLoadingTransactions: boolean| any;
  // onLoadingTransactionsChange: (newBoolean: boolean) => void;
  nbrMonth : number;
  saveSearchHistory : (savedType: string, city: string, zips: string,state : string, county : string, nbrMonth : number) => void;
  // handleClickActivityReport : () => void;
//   onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

}

// const housingIcon = new Icon({
//   iconUrl: 'https://img.icons8.com/color/96/neighborhood.png',
//   iconSize: [38, 45], // size of the icon
//   iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//   popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
// });

// const selectIcon = new Icon({
//   iconUrl: 'https://img.icons8.com/external-inkubators-blue-inkubators/100/external-pin-ecommerce-user-interface-inkubators-blue-inkubators.png',
//   iconSize: [38, 45], // size of the icon
//   iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//   popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
// });

// const defaultIcon = new Icon({
//   iconUrl: 'https://img.icons8.com/officel/80/marker.png',
//   iconSize: [38, 45], // size of the icon
//   iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//   popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
// });

const ZoomButton: React.FC<ZoomButtonProps> = ({ zoom, zips, city,Currentstate,CurrentCounty, nbrMonth ,saveSearchHistory}) => {
//   const { zoomToLocation, getMapInstance, markers, addMarker, setMarkers, setTransactions } = useMapContext();
// const { zoomToLocation, getMapInstance, markers, setTransactions ,setMarkers} = useMapContext();

  //const geoservice = new GeoService();
  const [Cities, setCities] = useState<Array<CityCoordinates>>([]);
  const [zipcodes, setZipcodes] = useState<Array<Zip>>([]);
  const [listPositions, setListPositions] = useState<Array<any>>([]);
  // const dispatch = useDispatch();
  const dispatch = useAppDispatch();
  const activityReportClicked = useSelector((state: RootState) => state.map.activityReportClicked);
  const TotalTransactions = useSelector((state: RootState) => state.map.totalTransactions);
  const TotalAgents = useSelector((state: RootState) => state.map.totalAgents);



  
  var center: [number, number] =[0,0];
  let marker = null;
  //var listPositions:any;
//   useEffect(() => {
//     zipcodes.forEach(element => {
//         let exist = false;
//         zips.forEach(item => {
//           if (item.zip === element.zip) {
//             exist = true;
//           }
//         });
  
//         if (exist) {
//           marker = { position: [element.lat, element.lng], zip: element.zip, icon: selectIcon };
//         } else {
//           marker = { position: [element.lat, element.lng], zip: element.zip, icon: defaultIcon };
//         }
//         markers.push(marker);
//         addMarker(marker);
  
//         console.log('markers'+markers);
//       });
//   }, [zipcodes]);

// useEffect(() => {

//     listPositions.forEach((element: any) => {
//         marker ={'position':[element.lat,element.lng],'zip':element.zip,'icon':defaultIcon,'nbrlist':element.nbrlist,'nbragt':element.nbragt,'street':element.street}
//         addMarker(marker);
//       });
//       }, [listPositions]);


const fetchTransactionsdata = async (paramZip: string[],nbrMonth : number) => {
  
try {
    // onLoadingTransactionsChange(true);

    // const response = await GeoAreaService.fetchTransactions(paramZip.join(','),nbrMonth);

    // dispatch(setTransactions(response));
    await dispatch(fetchTransactions({ paramZip, nbrMonth }));
    await dispatch(fetchTotalTransactions({paramZip, nbrMonth}));
    await dispatch(fetchTotalAgents({paramZip, nbrMonth}));
    dispatch(setNbrMonthSaveSearch(nbrMonth));



} catch (e) {
    console.error(e);
} finally {
    // onLoadingTransactionsChange(false);
    if(activityReportClicked){
      dispatch(setActivityReportClicked(!activityReportClicked));
      }
    }
};

  const handleZoomClick = async () => {
    // onLoadingTransactionsChange(true);

    // const map = getMapInstance();
    if (!city) {
      return;
    }
    //let obj = await geoservice.fetchCityById(city.code);

    // await GeoAreaService.getCityById(city.code)
    //     .then((response: any) => {
    //       setCities(response.data);
    //       //center = [parseFloat(response.data[0].lat), parseFloat(response.data[0].lng)];
          
    //     })
    //     .catch((e: Error) => {
    //       console.log(e);
    //     });

    //const zipcodes = await geoservice.fetchZipByCity(city.code);

    // await GeoAreaService.getZipByCity(city.code)
    //     .then((response: any) => {
    //         setZipcodes(response.data);
          
          
    //     })
    //     .catch((e: Error) => {
    //       console.log(e);
    //     });


    const paramZip: string[] = [];

    // setMarkers([]);
  

    // center = [parseFloat(zips[0].lat), parseFloat(zips[0].lng)];
    
    // zoomToLocation(zoom, center);
    //dispatch(zoomToLocation({ zoomLevel: zoom, center: [parseFloat(zips[0].lat), parseFloat(zips[0].lng)] }));


    zips.forEach(item => {
      paramZip.push(item.zip);
    });
    // const txs = await geoservice.fetchTransactions(paramZip.join(','));
    // setTransactions(txs);
        // await GeoAreaService.fetchTransactions(paramZip.join(','))
        //     .then((response: any) => {
        //         setTransactions(response); 
              
        //         onLoadingTransactionsChange(false);
                
        //     })
        //     .catch((e: Error) => {
        //         onLoadingTransactionsChange(false);

        //     console.log(e);
        //     });

        // fetchTransactions(paramZip,nbrMonth); active in old version
        fetchTransactionsdata(paramZip,nbrMonth);

        // await GeoAreaService.fetchTransactionsGeo(paramZip.join(','),nbrMonth)
        // .then((response: any) => {
        //     setListPositions(response);  
        
        // })
        // .catch((e: Error) => {
        // console.log(e);
        // });
        
            //  listPositions = await GeoAreaService.fetchTransactionsGeo(paramZip.join(','));
            //if (listPositions === null ||  listPositions === undefined) return;
            // listPositions.forEach((element: { lat: any; lng: any; zip: any; nbrlist: any; nbragt: any; street: any; }) => {
            //   marker ={'position':[element.lat,element.lng],'zip':element.zip,'icon':defaultIcon,'nbrlist':element.nbrlist,'nbragt':element.nbragt,'street':element.street}
            //   console.log(marker);
            //   addMarker(marker);
            // });


            saveSearchHistory("area",city.name+','+city.code,paramZip.join(','),Currentstate?.code+','+Currentstate?.name,CurrentCounty?.code+','+CurrentCounty?.name,nbrMonth);
        
  };

  return (
    <Button className="m-1" label="Display" icon="pi pi-search" size="small" onClick={handleZoomClick} />
  );
};

export default ZoomButton;
