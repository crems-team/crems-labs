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
import {setSelectedLocation,getAgentGeoProduction,setGeoAreaAgentProdReportClicked,setAgentGeoProdResult,setTotalTransactions,setTotalAgents,setActivityReportClicked} from '../../Redux/Slices/MapSlice'
import {getTotalAgents,getTotalTransactionAgent, setSelectedTabIndex,setTotalTransactionsAg,setTotalListingsAgent,setTotalAgent,
         getTotalListingsAgent,setSelectedOption,setSelectedZipCode, getZipCodesByCity,setListingsGeoProduction,getListingsGeoProduction,
         getTotalTransactionForListings,getTotalAgentForListing,setTotalAgentForListing,
         setTotalTransactionForListings,setSearchHistory,setSearchHistoryTeam,setDisplayedData,setOriginalData,setZipCodes} from '../../Redux/Slices/AreaAgentSlice'
import { useSearch } from '../../Components/Context/Context';
import Zip from "../../Models/Zip";
import { MultiSelect, MultiSelectChangeEvent, MultiSelectAllEvent } from 'primereact/multiselect';
import { SplitButton } from 'primereact/splitbutton';
import { useKeycloak } from "@react-keycloak/web";
import SearchItemArea from "../../Models/SearchItemHistory";
import GeoAreaAgentProdService from "../../Services/GeoAreaAgentProdService";
import { RadioButton } from 'primereact/radiobutton';
import { toast } from "react-toastify";
import { getTeamGeoProduction, getAgentTeamTable, setAllCities,setAllZipCodes } from '../../Redux/Slices/AreaAgentSlice';
import { Checkbox } from 'primereact/checkbox';



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
  selectedLocation:SelectedLocation;
//   setCurrentCities: (
// city: Cities | null) => Promise<void>;
  
}

const LocationDetails: React.FC<LocationDetailsProps> = ({ county, cities,copyCities, selectedLocation }) => {
    
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
    //Save search
    const { keycloak, initialized } = useKeycloak();
    // const [searchHistory, setSearchHistory] = useState<Array<SearchItemArea>>([]);
    const searchHistory = useSelector((state: RootState) => state.areaAgent.searchHistory);
    const displayedData = useSelector((state: RootState) => state.areaAgent.displayedData);
    const listingsGeoProduction = useSelector((state: RootState) => state.areaAgent.listingsGeoProduction);

    // const [selectedCities, setSelectedCities] = useState<Cities | null>(null);
    const [selectedCities, setSelectedCities] = useState<Cities[]>([]);
    const allCities = useSelector((state: RootState) => state.areaAgent.allCities);
    const allZipCodes = useSelector((state: RootState) => state.areaAgent.allZipCodes);




    // useEffect(() => {
    //   if (!searchQuery.trim()) {
    //     setFilteredCities(cities);
    //     return;
    //   }
  
    //   const results = copyCities.filter(city =>
    //     city.name.toLowerCase().includes(searchQuery.toLowerCase())
    //   );
    //   setFilteredCities(results);
    // }, [searchQuery, cities, copyCities]);

    //

    useEffect(() => {
      const selectedCityNames = selectedLocation.city || [];
      
      const citiesToSelect = copyCities.filter((city: Cities) => 
        selectedCityNames.includes(city.name)
      );
      
      setSelectedCities(citiesToSelect);
    }, [selectedLocation.city, copyCities]);

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
            
      if (selectedLocation.searchType === 'A'){
         console.log(selectedLocation);

            dispatch(setAgentGeoProdResult([]));
            dispatch(setTotalAgent(0));
            dispatch(setTotalTransactionsAg(0));
            dispatch(setTotalListingsAgent(0));
            // dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));

            // if(!geoAreaAgentProdReportClicked){
            //   dispatch(setGeoAreaAgentProdReportClicked(true));
            // }

            
            try {
                dispatch(setSelectedTabIndex(0));
                togglePanel();
                // await dispatch(getAgentGeoProduction({selectedLocation}));
                try {
                      await dispatch(getAgentGeoProduction({ selectedLocation })).unwrap();
                    } catch (err: any) {
                      toast.error(err.message);
                    }
                dispatch(getTotalAgents({selectedLocation}));
                dispatch(getTotalTransactionAgent({selectedLocation}));
                dispatch(getTotalListingsAgent({selectedLocation}));
                handleSearchListings();
                //Save Search
                saveSearchHistory("area", selectedLocation.city.join(','), selectedLocation.zip.join(','),selectedLocation.stateCode, selectedLocation.county);

            } catch (e) {
                console.error(e);
            } finally {
                    
                if(geoAreaAgentProdReportClicked){
                dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));
                }
            }

            console.log(selectedLocation);
            
       }

       if (selectedLocation.searchType === 'T') {
        try {
            togglePanel();

            await dispatch(getTeamGeoProduction(selectedLocation));

            saveSearchHistory(
                "areaTeam",
                selectedLocation.city.join(','),
                selectedLocation.zip.join(','),
                selectedLocation.stateCode,
                selectedLocation.county
            );
        } catch (e) {
            console.error(e);
        }
      }
    };
    // const handleSearchByZip = async () => {
    //   if (selectedLocation.searchType === 'A'){

    //         dispatch(setAgentGeoProdResult([]));
    //         dispatch(setTotalAgent(0));
    //         dispatch(setTotalTransactionsAg(0));
    //         dispatch(setTotalListingsAgent(0));
            
    //       try {

    //         togglePanel();
    //         await dispatch(getAgentGeoProduction({selectedLocation}));
    //                 dispatch(getTotalAgents({selectedLocation}));
    //                 dispatch(getTotalTransactionAgent({selectedLocation}));
    //                 dispatch(getTotalListingsAgent({selectedLocation}));
    //                 handleSearchListingsByZip();
    //                 //Save Search
    //                 saveSearchHistory("area", selectedLocation.city.join(','), selectedLocation.zip.join(','),selectedLocation.stateCode, selectedLocation.county);
                                            
    //       } catch (e) {
    //           console.error(e);
    //       } finally {
                  
    //           if(geoAreaAgentProdReportClicked){
    //           dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));
    //           }
    //       }
    //     }
        
    //     if (selectedLocation.searchType === 'T') {
    //     try {
    //         togglePanel();

    //         await dispatch(getTeamGeoProduction(selectedLocation));

    //         saveSearchHistory("areaTeam", 
    //               selectedLocation.city.join(','),
    //               selectedLocation.zip.join(','),
    //               selectedLocation.stateCode,
    //               selectedLocation.county
    //             );

    //     } catch (e) {
    //         console.error(e);
    //     }
    //   }

    // };

    const handleSearchListings = async () => {
      dispatch(setListingsGeoProduction([]));
      dispatch(setTotalAgentForListing(0));
      dispatch(setTotalTransactionForListings(0));
      // dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));

      // if(!geoAreaAgentProdReportClicked){
      //   dispatch(setGeoAreaAgentProdReportClicked(true));
      // }

      
      try {
          // dispatch(setSelectedTabIndex(0));
          // togglePanel();

          // await dispatch(getListingsGeoProduction({selectedLocation}));
          try {
            await dispatch(getListingsGeoProduction({ selectedLocation })).unwrap();
          } catch (err: any) {
            toast.error(err.message);
          }
          // dispatch(setOriginalData(listingsGeoProduction));
          // dispatch(setDisplayedData(listingsGeoProduction));
          dispatch(getTotalAgentForListing({selectedLocation}));
          dispatch(getTotalTransactionForListings({selectedLocation}));

      } catch (e) {
          console.error(e);
      } finally {
              
          if(activityReportClicked){
          dispatch(setActivityReportClicked(!activityReportClicked));
          }
      }
    };

    // const handleSearchListingsByZip = async () => {
    //   dispatch(setListingsGeoProduction([]));
    //   dispatch(setTotalAgentForListing(0));
    //   dispatch(setTotalTransactionForListings(0));
    //   // dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));

    //   // if(!geoAreaAgentProdReportClicked){
    //   //   dispatch(setGeoAreaAgentProdReportClicked(true));
    //   // }

      
    //   try {
    //       // dispatch(setSelectedTabIndex(0));
    //       // togglePanel();
    //       await dispatch(getListingsGeoProduction({selectedLocation}));
    //       // dispatch(setOriginalData(listingsGeoProduction));
    //       // dispatch(setDisplayedData(listingsGeoProduction));
    //       dispatch(getTotalAgentForListing({selectedLocation}));
    //       dispatch(getTotalTransactionForListings({selectedLocation}));

    //   } catch (e) {
    //       console.error(e);
    //   } finally {
              
    //       if(activityReportClicked){
    //       dispatch(setActivityReportClicked(!activityReportClicked));
    //       }
    //   }
    // };

    const handleClickZip = async (val: Zip[]) => {
      const param = val.map((element) => element.zip);
      dispatch(setSelectedLocation({
        ...selectedLocation,
        zip: param
      }));
    };
   //Search agent in listings Tab
      //  useEffect(() => {
   
      //      dispatch(setOriginalData(listingsGeoProduction));
      //      dispatch(setDisplayedData(listingsGeoProduction));
   
           
      //  }, [listingsGeoProduction]);
   
    const saveSearchHistory = async (savedType: string, city: string, zips: string,state : string, county : string) => {
            if (keycloak.tokenParsed?.sub) {
                const userId = keycloak.tokenParsed.sub;
                let history = JSON.parse(localStorage.getItem(userId + '-'+savedType) || '[]');
                const newSearch = { savedType, city, zips,state,county, isFavorite: true };
                if (!history.some((item: SearchItemArea) => item.city === city && item.zips === zips && item.state === state && item.county === county)) {
                    
                    console.log(newSearch);
                    console.log(history);
                    if (history.length >= 10) {
                        //history = history.slice(1);
                        history.pop();

                    }
                    //history.push(newSearch);
                    history.unshift(newSearch);

                    localStorage.setItem(userId + '-'+savedType, JSON.stringify(history));
                    if(savedType === 'area'){
                      dispatch(setSearchHistory(history));
                    }else if(savedType === 'areaTeam'){
                      dispatch(setSearchHistoryTeam(history));
                    }


                    try {
                        await GeoAreaAgentProdService.saveSearchHistory(userId, savedType, city, zips,state,county);
                    } catch (error) {
                        console.error('Error saving search history:', error);
                    }
                }
            }
        };
        //
        const handleCitiesChange = (e: MultiSelectChangeEvent) => {
          const newSelectedCities: Cities[] = e.value;
           
            setSelectedCities(newSelectedCities);
            
            const newCityNames = newSelectedCities.map(city => city.name);
            
            const updatedLocation = {
              ...selectedLocation,
              city: newCityNames
            };
            
            dispatch(setSelectedLocation(updatedLocation));

            if (newSelectedCities.length === 0) {

                return;
            }
               dispatch(getZipCodesByCity({ selectedLocation: updatedLocation }));


            // loadZips(updatedLocation);
        };

         //Zip Codes
        const loadZips = async (selectedLocation: SelectedLocation) => {

          GeoAreaAgentProdService.getZipsbyCityName(selectedLocation)
              .then((response: any) => {
                console.log(response.data);
                  // const mergedZips = [...zipcodes, ...response.data];
                  dispatch(setZipCodes(response.data));

              })
              .catch((e: Error) => {
                  console.log(e);
              });
      };

      const handleSearchTypeChange = (val: 'A' | 'T') => {
        dispatch(setSelectedLocation({ ...selectedLocation, searchType: val }));
      };
  return (
      <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
          <div className="row g-2">

          {selectedOption === 'cities' && (

              <div className="col-12 md:col-4">

                <div className="mb-3 w-full">

                  {/* LABEL CITIES */}
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label htmlFor="multiselect-cities" className="font-medium mb-0">
                      Cities:
                    </label>

                    {/* <div className="d-flex align-items-center gap-2">
                      <Checkbox
                        inputId="all-cities"
                        checked={allCities}
                        onChange={(e) => {
                          const checked = e.checked ?? false;

                          dispatch(setAllCities(checked));

                         if (checked) {
                            const updatedLocation = {
                              ...selectedLocation,
                              city: []
                            };

                            setSelectedCities([]);

                            // dispatch(setSelectedZipCode([]));

                            dispatch(setSelectedLocation(updatedLocation));
                          }
                        }}
                      />
                      <label htmlFor="all-cities" className="mb-0">
                        All
                      </label>
                    </div> */}
                  </div>

                  <MultiSelect
                    inputId="multiselect-cities"
                    value={selectedCities}
                    options={copyCities}
                    onChange={handleCitiesChange}
                    // disabled={allCities}
                    optionLabel="name"
                    placeholder="Select Cities"
                    filter
                    display="chip"
                    panelStyle={{ maxHeight: '60vh' }}
                    maxSelectedLabels={3}
                    className="w-full mb-3"
                  />

                  {/* LABEL ZIP */}
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label htmlFor="multiselect-zip" className="font-medium mb-0">
                      Zip Codes:
                    </label>

                    {/* <div className="d-flex align-items-center gap-2">
                      <Checkbox
                        inputId="all-zip"
                        checked={allZipCodes}
                        onChange={(e) => {
                          const checked = e.checked ?? false;

                          dispatch(setAllZipCodes(checked));

                         if (checked) {
                            const updatedLocation = {
                              ...selectedLocation,
                              zip: []
                            };

                            // setSelectedCities([]);

                            dispatch(setSelectedZipCode([]));
                            
                            dispatch(setSelectedLocation(updatedLocation));
                          }
                        }}
                      />
                      <label htmlFor="all-zip" className="mb-0">
                        All
                      </label>
                    </div> */}
                  </div>

                  <MultiSelect 
                    inputId="multiselect-zip"
                    value={selectedZipCode} 
                    options={zipcodes} 
                    onChange={(e) => { 
                      dispatch(setSelectedZipCode(e.value)); 
                      handleClickZip(e.value);
                    }} 
                    // disabled={allZipCodes}
                    optionLabel="zip" 
                    placeholder="Select Zip codes"
                    display="chip"
                    filter
                    panelStyle={{ maxHeight: '60vh' }} 
                    className="w-full"
                  />

                </div>

                {/* SEARCH TYPE */}
                <div className="d-flex gap-3 align-items-center mt-2">

                  <div className="d-flex align-items-center gap-2">
                    <RadioButton
                      inputId="city-agents"
                      name="searchTypeCities"
                      value="A"
                      onChange={() => handleSearchTypeChange('A')}
                      checked={(selectedLocation.searchType ?? 'A') === 'A'}
                    />
                    <label htmlFor="city-agents" className="mb-0">Agents</label>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <RadioButton
                      inputId="city-teams"
                      name="searchTypeCities"
                      value="T"
                      onChange={() => handleSearchTypeChange('T')}
                      checked={(selectedLocation.searchType ?? 'A') === 'T'}
                    />
                    <label htmlFor="city-teams" className="mb-0">Teams</label>
                  </div>

                </div>

              </div>
            )
          }
          {/* {selectedOption === 'zip' &&(
                <div className="col-12 md:col-4 mt-auto">
                    <span className="p-float-label">
                        <MultiSelect 
                        inputId="multiselect" 
                        value={selectedZipCode} 
                        options={zipcodes} 
                        onChange={(e) => { dispatch(setSelectedZipCode(e.value)); handleClickZip(e.value)}} 
                        optionLabel="zip" 
                        display="chip"
                        filter
                        panelStyle={{ maxHeight: '60vh' }} 
                        className="w-full" />

                        <label htmlFor="multiselect">Zip Codes</label>

                    </span>

                    <div className="d-flex gap-3 align-items-center mt-2">
                      <div className="d-flex align-items-center gap-2">
                        <RadioButton
                          inputId="zip-agents"
                          name="searchTypeZip"
                          value="A"
                          onChange={() => handleSearchTypeChange('A')}
                          checked={(selectedLocation.searchType ?? 'A') === 'A'}
                        />
                        <label htmlFor="zip-agents" className="mb-0">Agents</label>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <RadioButton
                          inputId="zip-teams"
                          name="searchTypeZip"
                          value="T"
                          onChange={() => handleSearchTypeChange('T')}
                          checked={(selectedLocation.searchType ?? 'A') === 'T'}
                        />
                        <label htmlFor="zip-teams" className="mb-0">Teams</label>
                      </div>
                    </div>

                </div>
              )                          
              } */}
              <div className="col-12 md:col-4">
              {selectedOption === 'cities' &&
              (
                selectedLocation.city?.length > 0 ||
                allCities ||
                allZipCodes
              ) && (<div className="mt-5 d-flex flex-row-reverse">
                {/* <Menu model={items} popup ref={menu} id="popup_menu"/>
                <Button
                  size="small"
                  label="Search"
                  icon="pi pi-search"
                  onClick={(e) => menu.current?.toggle(e)}
                  aria-controls="popup_menu" aria-haspopup
                /> */}
               {/* <SplitButton label="Search by City" icon="pi pi-search" onClick={handleSearch} model={items} /> */}
               <Button
                    type="button"
                    outlined
                    severity="info"
                    icon="pi pi-search"
                    label="Search"
                    className="modern-history-btn"
                    onClick={handleSearch}
                />

                </div>)
             
              }
                </div>
            </div>

              
          </div>
      </div>
  );
};

export default LocationDetails;