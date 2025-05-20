import React, { useState,useEffect } from 'react';
import USMap from './Maps/USMap';
import StateMap from './Maps/StateMap';
import LocationDetails from './LocationDetails';
import { MapLevel } from '../../Models/UsaMapType';
import { ChevronLeft } from 'lucide-react';
import GeoAreaService from "../../Services/GeoAreaService";
import Cities from "../../Models/Cities";
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { setSelectedLocation,setAgentGeoProdResult} from '../../Redux/Slices/MapSlice'
import { setMapLevel, setCopyCities, setCities,setSelectedOption,setSelectedZipCode,setZipCodes} from '../../Redux/Slices/AreaAgentSlice'
import { useAppDispatch } from '../../Hooks/DispatchHook';
import { BeatLoader } from 'react-spinners';
import GeoAreaAgentProdService from "../../Services/GeoAreaAgentProdService";
import SelectedLocation from "../../Models/GeoAreaAgentProd/SelectedLocation"



function MapIndex() {
    const mapLevel = useSelector((state: RootState) => state.areaAgent.mapLevel);

//   const [mapLevel, setMapLevel] = useState<MapLevel>({
//     level: 'country'
//   });

//   const [selectedLocation, setSelectedLocation] = useState({
//     state: '',
//     county: '',
//     city: [] as string[],
//     // zipCodes: [] as string[]
//   });

  // Mock data - in a real app, this would come from an API
  const mockCities = [
    'Springfield', 'Riverside', 'Franklin', 'Lebanon', 
    'Georgetown', 'Bristol', 'Clinton', 'Winchester'
  ];

//   const [cities, setCities] = useState<Cities[]>([]);
  const cities = useSelector((state: RootState) => state.areaAgent.cities);
//   const [copyCities, setCopyCities] = useState<Cities[]>([]);
  const copyCities = useSelector((state: RootState) => state.areaAgent.copyCities);

  const [currentCity, setCurrentCity] = useState<Cities | null>();
  const dispatch = useAppDispatch();
  const [selectedCodes, setSelectedCodes] = useState<number[]>([]);
  const selectedLocation = useSelector((state: RootState) => state.map.selectedLocation);
  const AgentGeoProdResult = useSelector((state: RootState) => state.map.AgentGeoProdResult);
  const zipcodes = useSelector((state: RootState) => state.map.zipcodes);

  const [isLoadingCities, setIsLoadingCities] = useState(Boolean);
  const selectedOption = useSelector((state: RootState) => state.areaAgent.selectedOption);


  const handleStateSelect = (state: string,stateCode: string) => {
    dispatch(setMapLevel({ level: 'state', selectedState: state }));
    // dispatch(setSelectedLocation(prev => ({ ...prev, state })));
    dispatch(setSelectedLocation({
        ...selectedLocation,
        state,
        stateCode
      }));
      console.log(selectedLocation);
  };

  const handleCountySelect = (countyId: string, county: string) => {
        setIsLoadingCities(true);
        GeoAreaService.getCitiesByCountyFips(countyId)
        .then((response: any) => {
            dispatch(setCities(response.data));
            dispatch(setCopyCities(response.data));
            setIsLoadingCities(false);



        })
        .catch((e: Error) => {
            console.log(e);
        });    

    dispatch(setMapLevel({ level: 'county', selectedState: selectedLocation.state, selectedCounty: county }));
    dispatch(setSelectedLocation({
            ...selectedLocation,
            county
      }));  };

  const handleCityClick = (city: Cities) => {
    const currentCities = selectedLocation.city || [];
    const newCities = currentCities.includes(city.name)
      ? currentCities.filter(c => c !== city.name)
      : [...currentCities, city.name];
    //   dispatch(setSelectedLocation({
    //     ...selectedLocation,
    //     city: newCities
    //   }));
      const updatedLocation = {
        ...selectedLocation,
        city: newCities
      };
      
      dispatch(setSelectedLocation(updatedLocation));
      loadZips(updatedLocation);

    
  

  };

  const handleBack = () => {
    if (mapLevel.level === 'county' && selectedOption === 'zip') {
    //  setSelectedLocation(prev => ({ ...prev, city:[] }));
    dispatch(setSelectedLocation({
        ...selectedLocation,
        // county:'',
        // city:[],
        zip:[]
      }));
      dispatch(setZipCodes([]));
      dispatch(setSelectedZipCode([]));
      dispatch(setSelectedOption('cities'));
    //   dispatch(setMapLevel({ level: 'state', selectedState: selectedLocation.state }));
    } 
    if (mapLevel.level === 'county' && selectedOption === 'cities') {
        //  setSelectedLocation(prev => ({ ...prev, city:[] }));
        dispatch(setSelectedLocation({
            ...selectedLocation,
            county:'',
            city:[],
            zip:[]
          }));
        //   dispatch(setZipCodes([]));
          dispatch(setSelectedOption('cities'));
          dispatch(setMapLevel({ level: 'state', selectedState: selectedLocation.state }));
        }else if (mapLevel.level === 'state') {
        dispatch(setSelectedLocation({
            ...selectedLocation,
            state:'',
            city:[],
            zip:[]
          }));
      dispatch(setMapLevel({ level: 'country' }));
    }
  };

  useEffect(() => {
    
    if(selectedLocation){
        // dispatch(setZipCodes([]));
        // dispatch(setSelectedLocation({state : '', stateCode: '',county:'', city:[],zip:[]}));
        // dispatch(setAgentGeoProdResult([]));
    }

    if(AgentGeoProdResult){

        // dispatch(setAgentGeoProdResult([]));


    }
  }, []);

  //Zip Codes
  const loadZips = async (selectedLocation: SelectedLocation) => {

    GeoAreaAgentProdService.getZipsbyCityName(selectedLocation)
        .then((response: any) => {

            // const mergedZips = [...zipcodes, ...response.data];
            dispatch(setZipCodes(response.data));

        })
        .catch((e: Error) => {
            console.log(e);
        });
};


  

  return (<>
          {/* <div className="container-fluid py-5 px-4 mx-auto" style={{ maxWidth: '1200px' }}> */}
              <div className="bg-white rounded-lg shadow p-4">
                  <div className="d-flex align-items-center mb-4">
                      {mapLevel.level !== 'country' && (
                          <button
                              onClick={handleBack}
                              className="d-flex align-items-center text-secondary btn btn-link p-0"
                          >
                              <ChevronLeft className="mr-1" style={{ width: '20px', height: '20px' }} />
                              Back
                          </button>
                      )}
                      {/* <h1 className="h5 font-weight-bold text-dark ml-3">
                          {mapLevel.level === 'country' && 'Select a State'}
                          {mapLevel.level === 'state' && `${selectedLocation.state}`}
                          {mapLevel.level === 'county' && `${selectedLocation.state}, ${selectedLocation.county}`}
                      </h1> */}
                  </div>

                  <div className="row">
                      <div className="col-12 col-lg-6">
                          <div className="mb-4">
                              {mapLevel.level === 'country' && (
                                  <USMap
                                      width={600}
                                      height={400}
                                      onStateSelect={handleStateSelect}
                                  />
                              )}
                              {mapLevel.level === 'state' && selectedLocation.state && (
                                  <StateMap
                                      width={600}
                                      height={400}
                                      stateName={selectedLocation.state}
                                      onCountySelect={handleCountySelect}
                                  />
                              )}
                              { isLoadingCities? ( <div  >
 
                                <BeatLoader className="loading-container mt-3"size={15} color="#36d7b7" />

                                </div>
                                ):mapLevel.level === 'county' && (
                                    <LocationDetails
                                        county={selectedLocation.county}
                                        cities={cities}
                                        copyCities={copyCities}                            
                                        onCitySelect={handleCityClick}
                                        selectedLocation={selectedLocation}
                                      //   setCurrentCities={setCurrentCities}
                                    />
                                
                                )}
                              {/* {mapLevel.level === 'county' && (
                                  <LocationDetails
                                      county={selectedLocation.county}
                                      cities={cities}
                                      copyCities={copyCities}                            
                                      onCitySelect={handleCityClick}
                                      selectedLocation={selectedLocation}
                                    //   setCurrentCities={setCurrentCities}
                                  />
                              )} */}
                          </div>
                      </div>

                      {/* <div className="col-12 col-lg-6">
                          <div className="bg-light p-4 rounded">
                              <h2 className="h4 font-weight-semibold mb-3">Selected Location</h2>
                              <div>
                                  {selectedLocation.state && (
                                      <p><span className="font-weight-bold">State:</span> {selectedLocation.state}</p>
                                  )}
                                  {selectedLocation.county && (
                                      <p><span className="font-weight-bold">County:</span> {selectedLocation.county}</p>
                                  )}
                                  {selectedLocation.city && (
                                      <p><span className="font-weight-bold">City:</span> {selectedLocation.city}</p>
                                  )}
                                  {selectedLocation.zipCodes.length > 0 && (
                                      <div>
                                          <p className="font-weight-bold">ZIP Codes:</p>
                                          <ul className="pl-4 mb-0">
                                              {selectedLocation.zipCodes.map(zip => (
                                                  <li key={zip}>{zip}</li>
                                              ))}
                                          </ul>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div> */}
                  </div>
              </div>
          {/* </div> */}
      </>
  );
}

export default MapIndex;