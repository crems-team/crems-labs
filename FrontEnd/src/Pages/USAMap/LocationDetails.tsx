import React, { useState, useEffect, useRef } from 'react';
import Cities from "../../Models/Cities";
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteChangeEvent } from 'primereact/autocomplete';
import SelectedLocation from "../../Models/GeoAreaAgentProd/SelectedLocation"
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { useAppDispatch } from '../../Hooks/DispatchHook';
import {setSelectedLocation,getAgentGeoProduction,setGeoAreaAgentProdReportClicked,setAgentGeoProdResult,setTotalTransactions,setTotalAgents,getTotalAgentsListings,getTotalTransactionsListings,setActivityReportClicked} from '../../Redux/Slices/MapSlice'
import {getTotalAgents,getTotalTransaction, setSelectedTabIndex,setTotalTransactionsAg,setTotalListings,setTotalAgent, getTotalListings,setSelectedOption,setSelectedZipCode, getZipCodesByCity,setListingsGeoProduction,getListingsGeoProduction} from '../../Redux/Slices/AreaAgentSlice'
import { useSearch } from '../../Components/Context/Context';
import Zip from "../../Models/Zip";
import { MultiSelect } from 'primereact/multiselect';
import { SplitButton } from 'primereact/splitbutton';




interface LocationState {
  state: string;
  stateCode : string;
  county: string;
  city: string[];
}

interface LocationDetailsProps {
  county: string;
  cities: Cities[];
  copyCities : Cities[];
  onCitySelect: (city: Cities) => void;
  selectedLocation:SelectedLocation;
//   setCurrentCities: (
// city: Cities | null) => Promise<void>;
  
}

const LocationDetails: React.FC<LocationDetailsProps> = ({ county, cities,copyCities, onCitySelect, selectedLocation }) => {
    
    const [currentCity, setCurrentCity] = useState<Cities | null>();
    const [filteredCities, setFilteredCities] = useState<Cities[]>(cities);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const menu = useRef<Menu>(null);
    // const [selectedOption, setSelectedOption] = useState<'cities' | 'zip'>('cities');
    const dispatch = useAppDispatch();
    const { panelRef, togglePanel,collapsed ,setCollapsed } = useSearch();
    // const selectedLocation = useSelector((state: RootState) => state.map.selectedLocation);
    const AgentGeoProdResult = useSelector((state: RootState) => state.map.AgentGeoProdResult);
    const loadingAgentGeoProdResult = useSelector((state: RootState) => state.map.loadingAgentGeoProdResult);
    const geoAreaAgentProdReportClicked = useSelector((state: RootState) => state.map.geoAreaAgentProdReportClicked);
    const zipcodes = useSelector((state: RootState) => state.areaAgent.zipcodes);
    const selectedOption = useSelector((state: RootState) => state.areaAgent.selectedOption);



    //Zip Codes
    // const [selectedZipCode, setSelectedZipCode] = useState<Zip[]>([]);
    const selectedZipCode = useSelector((state: RootState) => state.areaAgent.selectedZipCode);
    const activityReportClicked = useSelector((state: RootState) => state.map.activityReportClicked);


    useEffect(() => {
      if (!searchQuery.trim()) {
        setFilteredCities(cities);
        return;
      }
  
      const results = copyCities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(results);
    }, [searchQuery, cities, copyCities]);

    // const handleCityClick = (code: number) => {
    //     const newSelection = selectedCityCodes.includes(code)
    //       ? selectedCityCodes.filter(c => c !== code) 
    //       : [...selectedCityCodes, code]; 
        
    //     onCitySelect(newSelection);
    //   };

    const setCurrentCities = async (city: Cities | null) => {
    try {
        console.log(city);
        setCurrentCity(city);
        //   loadZips(city);
        // dispatch(setCurrentCitySaveSearch(city));//for re-populate field when back to page

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    
    const handleMenuSelection = (option : string) => {
      dispatch(setSelectedOption(option));
      if (option === 'zip') {
        dispatch(getZipCodesByCity({selectedLocation}));
      } else {
        // fetchZipCodes(selectedState, selectedCounty).then(data => setZipCodes(data));
      }
    };
  
    // const items: MenuItem[] = [
    //   {
    //     label: 'Options',
    //     items: [
    //       // {
    //       //   label: 'Search by city',
    //       //   // icon: 'pi pi-map-marker',
    //       //   command: () => handleMenuSelection('cities')
    //       // },
    //       {
    //         label: 'Search by Zip Codes',
    //         icon: 'bi bi-pin-map',
    //         command: () => handleMenuSelection('zip')
    //       }
    //     ]
    //   }
    // ];
    const items: MenuItem[] = [
      {
          label: 'Search by Zip Codes',
          icon: 'bi bi-pin-map',
          command: () => handleMenuSelection('zip')

      }
    ];
  

    const handleSearch = async () => {
            dispatch(setAgentGeoProdResult([]));
            dispatch(setTotalAgent(0));
            dispatch(setTotalTransactionsAg(0));
            dispatch(setTotalListings(0));
            // dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));

            // if(!geoAreaAgentProdReportClicked){
            //   dispatch(setGeoAreaAgentProdReportClicked(true));
            // }

            
            try {
                dispatch(setSelectedTabIndex(0));
                togglePanel();
                await dispatch(getAgentGeoProduction({selectedLocation}));
                dispatch(getTotalAgents({selectedLocation}));
                dispatch(getTotalTransaction({selectedLocation}));
                dispatch(getTotalListings({selectedLocation}));
                handleSearchListings();

            } catch (e) {
                console.error(e);
            } finally {
                    
                if(geoAreaAgentProdReportClicked){
                dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));
                }
            }
    };
    const handleSearchByZip = async () => {
            
      try {

        togglePanel();
        await dispatch(getAgentGeoProduction({selectedLocation}));
        dispatch(getTotalAgents({selectedLocation}));
        dispatch(getTotalTransaction({selectedLocation}));
        dispatch(getTotalListings({selectedLocation}));
        handleSearchListingsByZip();
                                         
      } catch (e) {
          console.error(e);
      } finally {
              
          if(geoAreaAgentProdReportClicked){
          dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));
          }
      }
    };

    const handleSearchListings = async () => {
      dispatch(setListingsGeoProduction([]));
      dispatch(setTotalAgents([]));
      dispatch(setTotalTransactions(0));
      dispatch(setTotalListings(0));
      // dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));

      // if(!geoAreaAgentProdReportClicked){
      //   dispatch(setGeoAreaAgentProdReportClicked(true));
      // }

      
      try {
          // dispatch(setSelectedTabIndex(0));
          // togglePanel();
          await dispatch(getListingsGeoProduction({selectedLocation}));
          dispatch(getTotalAgents({selectedLocation}));
          dispatch(getTotalAgentsListings({selectedLocation}));
          dispatch(getTotalTransactionsListings({selectedLocation}));

      } catch (e) {
          console.error(e);
      } finally {
              
          if(activityReportClicked){
          dispatch(setActivityReportClicked(!activityReportClicked));
          }
      }
    };

    const handleSearchListingsByZip = async () => {
      dispatch(setListingsGeoProduction([]));
      dispatch(setTotalAgents([]));
      dispatch(setTotalTransactions(0));
      dispatch(setTotalListings(0));
      // dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));

      // if(!geoAreaAgentProdReportClicked){
      //   dispatch(setGeoAreaAgentProdReportClicked(true));
      // }

      
      try {
          // dispatch(setSelectedTabIndex(0));
          // togglePanel();
          await dispatch(getListingsGeoProduction({selectedLocation}));
          dispatch(getTotalAgents({selectedLocation}));
          dispatch(getTotalAgentsListings({selectedLocation}));
          dispatch(getTotalTransactionsListings({selectedLocation}));

      } catch (e) {
          console.error(e);
      } finally {
              
          if(activityReportClicked){
          dispatch(setActivityReportClicked(!activityReportClicked));
          }
      }
    };

    const handleClickZip = async (val: Zip[]) => {
      const param = val.map((element) => element.zip);
      dispatch(setSelectedLocation({
        ...selectedLocation,
        zip: param
      }));
    };
    //  useEffect(() => {
        
    //     console.log(cities);
    //   }, []);
   

  return (
      <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
          <div className="row">

          {selectedOption === 'cities' && (<div className="col-6 md:col-4 col-4">
              <div className="mb-3">
                <label htmlFor="autocompletcity" className="block text-lg font-semibold mb-2">
                  Choose City
                </label>
                <AutoComplete
                  inputId="citySearch"
                  field="name"
                  value={searchQuery}
                  // suggestions={[]} // Pas de suggestions
                  // completeMethod={() => {}} // Méthode vide
                  onChange={(e) => setSearchQuery(e.value)}
                  dropdown={false}
                  placeholder="Type to filter cities..."
                />
              </div>
              
            </div>)
          }
          {selectedOption === 'zip' &&(
                <div className="col-6 md:col-6 col-4 mt-auto">
                    <span className="p-float-label">
                        <MultiSelect inputId="multiselect" value={selectedZipCode} options={zipcodes} onChange={(e) => { dispatch(setSelectedZipCode(e.value)); handleClickZip(e.value)}} optionLabel="zip" className="w-full md:w-20rem" />
                        <label htmlFor="multiselect">Zip Codes</label>

                    </span>

                </div>
              )                          
              }
              <div className="col-6 md:col-4 col-4">
              {selectedOption === 'cities' ? (selectedLocation.city?.length>0 &&<div className="mt-5 d-flex flex-row-reverse">
                {/* <Menu model={items} popup ref={menu} id="popup_menu"/>
                <Button
                  size="small"
                  label="Search"
                  icon="pi pi-search"
                  onClick={(e) => menu.current?.toggle(e)}
                  aria-controls="popup_menu" aria-haspopup
                /> */}
               <SplitButton label="Search by City" icon="pi pi-search" onClick={handleSearch} model={items} />

                </div>)
                :(<div className="mt-5 d-flex flex-row-reverse">

                    <Button className="m-1" label="Search by Zip" icon="pi pi-search" size="small" onClick={handleSearchByZip} />
                  
                  </div>)
              }
                </div>
            </div>

              <div className="grid grid-cols-2 gap-2">
              {selectedOption === 'cities' && filteredCities.map((city) => (
                      <button
                          key={city.code}
                          onClick={() => onCitySelect(city)}
                          className={`text-left px-4 py-2 rounded focus:outline-none focus:ring-2 ${
                            selectedLocation.city?.includes(city.name)
                              ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
                              : "hover:bg-blue-50 focus:ring-blue-500"
                          }`}
                          >
                          {city.name}
                      </button>
              ))}
              
                  
              </div>
          </div>
      </div>
  );
};

export default LocationDetails;