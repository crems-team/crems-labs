import React,{ useState, useEffect, useRef,forwardRef }  from 'react';
import { useMapContext } from './Map/MapContext';
import { Button } from 'primereact/button';
import GeoAreaService from "../Services/GeoAreaService";
import { Icon, icon } from 'leaflet';
import Zip from "../Models/Zip";
import Cities from "../Models/Cities";
import CityCoordinates from "../Models/CityCoordinates";
import { Transaction } from 'neo4j-driver';
import { useDispatch } from 'react-redux';
import { setMarkers, addMarker ,setLoadingMarkers} from '../Redux/Slices/MapSlice';
import { setMapInstance } from '../Redux/Slices/MapSlice';




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

interface TableTransBtnProps {
  zoom: number;
  zips: Zip[];
  city: Cities | null;
  nbrMonth : number;
  SwitchMapTable: () => void;
  switchbtwMapTable : boolean| any;

//   onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

}


const DisplayTableTransactionsBtn: React.FC<TableTransBtnProps> = ({ zoom, zips, city, nbrMonth,SwitchMapTable,switchbtwMapTable}) => {
//   const { zoomToLocation, getMapInstance, markers, addMarker, setMarkers, setTransactions } = useMapContext();
// const { zoomToLocation, getMapInstance, markers, setTransactions ,setMarkers} = useMapContext();
const {  getMapInstance,zoomToLocation } = useMapContext();
  //const geoservice = new GeoService();
  const [Cities, setCities] = useState<Array<CityCoordinates>>([]);
  const [zipcodes, setZipcodes] = useState<Array<Zip>>([]);
  const [listPositions, setListPositions] = useState<Array<any>>([]);
  const dispatch = useDispatch();


  
  var center: [number, number] =[0,0];
  let marker = null;
  useEffect(() => {
    console.log(listPositions);
    if (listPositions.length > 0) {
      zoomToLocation(zoom,  [parseFloat(listPositions[0]?.lat), parseFloat(listPositions[0]?.lng)]);
      listPositions.forEach((element: any) => {
        dispatch(addMarker({
          position: [element.lat, element.lng],
          zip: element.zip,
          street: element.street,
          nbrlist: element.nbrlist,
          nbragt: element.nbragt,
          icon: null,
        }));
      });
      dispatch(setLoadingMarkers(false));

    }
  }, [listPositions, dispatch]);


const fetchMarkers = async (paramZip: string[],nbrMonth : number) => {

    dispatch(setMarkers([]));

    dispatch(setLoadingMarkers(true));

        await GeoAreaService.fetchTransactionsGeo(paramZip.join(','),nbrMonth)
            .then((response: any) => {

                /*  const history = response.data;
                 console.log(history);
                 localStorage.setItem(userId, JSON.stringify(history));
                 setSearchHistory(history); */
                 setListPositions(response); 
                //  areaReportRendred(false); 
                 
            })
            .catch((e: Error) => {
                console.log(e);
            });
};

  const handleZoomClick = async () => {
    SwitchMapTable();
    // onLoadingTransactionsChange(true);

    const map = getMapInstance();
    // if (!city) {
    //   return;
    // }
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
        console.log(zips);

        fetchMarkers(paramZip,nbrMonth);

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

        
  };

  return (
    <>
    {!switchbtwMapTable &&(<button type="button" className="btn btn-light btn-md mt-1 ml-1" onClick={handleZoomClick}>
        <span className="mr-1">chosen zips map area</span>
        <i className="bi bi-geo-alt-fill"></i>
    </button>)}
    {switchbtwMapTable &&(<button type="button" className="btn btn-light btn-md mt-1 ml-1" onClick={SwitchMapTable}>
        <span className="mr-1">Transactions Table </span>
        <i className="bi bi-table"></i>
    </button>)}
    </>
  );
};

export default DisplayTableTransactionsBtn;
