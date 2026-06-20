import React, { useState, useEffect, useRef ,useMemo} from 'react';
import CremsMap from '../Components/Map';
import { MultiSelect } from 'primereact/multiselect';
import { CascadeSelect } from 'primereact/cascadeselect';

import { Button } from 'primereact/button';
// import { ButtonGroup } from 'primereact/buttongroup';
// import { GeoService } from './services/geoService';

import { MapProvider, useMapContext } from '../Components/Map/MapContext';

import ZoomButton from '../Components/ZoomButton';
import ClearButton from '../Components/ClearButton';

// import CremsTable from './cremsTable'

import { Panel, PanelHeaderTemplateOptions } from 'primereact/panel';
import { Avatar } from 'primereact/avatar';

import { Divider } from 'primereact/divider';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteChangeEvent } from 'primereact/autocomplete';
import { Messages } from 'primereact/messages';
import States from "../Models/States";
import GeoAreaService from "../Services/GeoAreaService";
import { stat } from 'fs';
import { initial } from 'lodash';
import Counties from "../Models/Counties";
import Cities from "../Models/Cities";
import Zip from "../Models/Zip";
import CremsTableAgents from '../Components/CremsTableAgents';
import CremsTableListings from '../Components/CremsTableListings';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import SearchItemArea from "../Models/SearchItemHistory";
import { useKeycloak } from "@react-keycloak/web";
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { toast } from 'react-toastify';
import { Dialog } from 'primereact/dialog';
import DisplayTableTransactionsBtn from '../Components/DisplayTableTransactionsBtn';
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { useAppDispatch } from '../Hooks/DispatchHook';
import {getAgentGeoProduction,setGeoAreaAgentProdReportClicked,setAgentGeoProdResult,
        setActivityReportClicked,setSelectedLocation,setInitialeAgentGeoProdResult, setSearchTerm, setIsFiltered} from '../Redux/Slices/MapSlice'
import {getAgentGeoProductionForExtraction, setSelectedTabIndex,setSearchHistory,getTotalTransactionAgent,getTotalAgents,setTotalTransactionsAg,setTotalListingsAgent,setTotalAgent,getTotalListingsAgent,setTotalTransactionForListings,
        setTotalAgentForListing,setListingsGeoProduction,getTotalTransactionForListings,getTotalAgentForListing,getListingsGeoProduction,
        setOriginalData,setDisplayedData,setSearchHistoryTeam,getTeamGeoProduction, setAccordionIndex} from '../Redux/Slices/AreaAgentSlice'

import { useSearch } from '../Components/Context/Context';
import SearchHistory from '../Components/SearchHistory';
import {useLocation } from 'react-router-dom';
import UsaMap from './USAMap/MapIndex';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import GeoAreaAgentProdService from "../Services/GeoAreaAgentProdService";
import AgentSearch from "../Models/GeoAreaAgentProd/AgentSearch";
import SelectedLocation from "../Models/GeoAreaAgentProd/SelectedLocation";
import { utils, writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
import { TabView, TabPanel } from 'primereact/tabview';
import { Sidebar } from 'primereact/sidebar';
import { ProgressSpinner } from 'primereact/progressspinner';
import AreaTeamTable from '../Components/AreaTeam/AreaTeamTable';
import SearchByInputCounty from './USAMap/SearchByInput/SearchByInputCounty';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Accordion, AccordionTab } from 'primereact/accordion';






// interface AutocompleteItem {
//     value: number;
//     label: string;
//   }

interface MonthSuggestion {
    key: number;
    value: number;
}


function SearchByAreaV2() {
    
    function useIsMobile(breakpoint = 768) {
        const [isMobile, setIsMobile] = useState(
          typeof window !== "undefined" ? window.innerWidth < breakpoint : false
        );
        useEffect(() => {
          const onResize = () => setIsMobile(window.innerWidth < breakpoint);
          window.addEventListener("resize", onResize);
          return () => window.removeEventListener("resize", onResize);
        }, [breakpoint]);
        return isMobile;
      }
      
    const isMobile = useIsMobile();

    const [states, setstates] = useState<Array<States>>([]);
    const [copyStates, setCopyStates] = useState<Array<States>>([]);
    const [Currentstate, setCurrentstate] = useState<States | null>(null);
    const [filteredStates, setFilteredStates] = useState<States[]>(states);

    const [counties, setCounties] = useState<Array<Counties>>([]);
    const [copyCounties, setCopyCounties] = useState<Array<Counties>>([]);
    const [CurrentCountie, setCurrentCountie] = useState<Counties | null>(null);
    const [filteredCounties, setFilteredCounties] = useState<Counties[]>(counties);

    const [cities, setCities] = useState<Array<Cities>>([]);
    const [copyCities, setCopyCities] = useState<Array<Cities>>([]);
    const [currentCity, setCurrentCity] = useState<Cities | null>();
    const [filteredCities, setFilteredCities] = useState<Cities[]>(cities);

    const [zipcodes, setZipcodes] = useState<Array<Zip>>([]);
    // const [selectedZipCode, setSelectedZipCode] = useState<Zip>();
    const [currentZip, setCurrentZip] = useState<Zip[]>();
    // const [currentZip, setCurrentZip] = useState<string>('');
    const [selectedZipCode, setSelectedZipCode] = useState<Zip[]>([]);
    const msgs = useRef<Messages>(null);

    const isLoadingTransactions = useSelector((state: RootState) => state.map.loadingTransactions);
    const { panelRef, togglePanel,collapsed ,setCollapsed } = useSearch();
    const selectedLocation = useSelector((state: RootState) => state.map.selectedLocation);
    const AgentGeoProdResult = useSelector((state: RootState) => state.map.AgentGeoProdResult);
    const loadingAgentGeoProdResult = useSelector((state: RootState) => state.map.loadingAgentGeoProdResult);
    const geoAreaAgentProdReportClicked = useSelector((state: RootState) => state.map.geoAreaAgentProdReportClicked);
    const error = useSelector((state: RootState) => state.map.error);
    const searchTerm = useSelector((state: RootState) => state.map.searchTerm);

        // const [currentCity, setCurrentCity] = useState<Cities | null>();
    const [suggestions, setSuggestions] = useState<Array<AgentSearch>>([]);

    // const handleLoadingTransactions = (newBoolean: boolean) => {
    //     setIsLoadingTransactions(newBoolean);
    // };

    const [refreshKey, setRefreshKey] = useState(0);
    const ListMonthSuggestions: MonthSuggestion[] = [
        { value: 12, key: 4 },
        { value: 9, key: 3 },
        { value: 6, key: 2 },
        { value: 3, key: 1 }
    ];
    const [currentMonth, setCurrentMonth] = useState<number>(3);
    const [listSuggestionsMonth, setListSuggestionsMonth] = useState<MonthSuggestion[]>([]);
    const dispatch = useAppDispatch();




    const showMessages = (text: string) => {
        if (msgs.current) {
            msgs.current.clear();
            msgs.current.show([
                { severity: 'info', summary: 'Info', detail: text, sticky: true, closable: false }
            ]);
        }
    }

    // const [searchHistory, setSearchHistory] = useState<Array<SearchItemArea>>([]);
    const searchHistory = useSelector((state: RootState) => state.areaAgent.searchHistory);
    const searchHistoryTeam = useSelector((state: RootState) => state.areaAgent.searchHistoryTeam);
    const [isLoadingSavedSearch, setIsLoadingSavedSearch] = useState(Boolean);
    const [isLoadingSavedSearchTeam, setIsLoadingSavedSearchTeam] = useState(Boolean);
    const { keycloak, initialized } = useKeycloak();
    //const [activityReportClicked, setActivityReportClicked] = useState(true);
    const activityReportClicked = useSelector((state: RootState) => state.map.activityReportClicked);

    const [areaReportClicked, setareaReportClicked] = useState(false);
    const ref = useRef<Panel>(null);
    const [visible, setVisible] = useState(false);
    const [switchbtwMapTable, setSwitchbtwMapTable] = useState(false);
    const isFirstLoad = useSelector((state: RootState) => state.map.firstLoad);
    const location = useLocation();
    const totalAgents = useSelector((state: RootState) => state.areaAgent.totalAgent);
    const totalAgentLoading = useSelector((state: RootState) => state.areaAgent.totalAgentLoading);
    const totalTransactionAgent = useSelector((state: RootState) => state.areaAgent.totalTransactionAgent);
    const totalTransactionAgentLoading = useSelector((state: RootState) => state.areaAgent.totalTransactionAgentLoading);
    const totalListingsAgent = useSelector((state: RootState) => state.areaAgent.totalListingsAgent);
    const totalListingsAgentLoading = useSelector((state: RootState) => state.areaAgent.totalListingsAgentLoading);
    const agentGeoProdResultExtract = useSelector((state: RootState) => state.areaAgent.agentGeoProdResultExtract);
    const extractionLoading = useSelector((state: RootState) => state.areaAgent.extractionLoading);
    // const [selectedTabIndex, setSelectedTabIndex] = useState(-1);
    const selectedTabIndex = useSelector((state: RootState) => state.areaAgent.selectedTabIndex);
    const totalTransactionForListings = useSelector((state: RootState) => state.areaAgent.totalTransactionForListings);
    const totalTransactionForListingsLoading = useSelector((state: RootState) => state.areaAgent.totalTransactionForListingsLoading);
    const TotalAgents = useSelector((state: RootState) => state.map.totalAgents);
    const listingsGeoLoading = useSelector((state: RootState) => state.areaAgent.listingsGeoLoading);
    const totalAgentForListing = useSelector((state: RootState) => state.areaAgent.totalAgentForListing);
    const totalAgentForListingLoading = useSelector((state: RootState) => state.areaAgent.totalAgentForListingLoading);
    const [visibleRight, setVisibleRight] = useState(false);
    const listingsGeoProduction = useSelector((state: RootState) => state.areaAgent.listingsGeoProduction);
    const initialeAgentGeoProdResult = useSelector((state: RootState) => state.map.initialeAgentGeoProdResult);
    const isFiltered = useSelector((state: RootState) => state.map.isFiltered);
    const [selectedTabIndexSearchHis, setselectedTabIndexSearchHis] = useState<number>(0);
    const areaOverlayRef = useRef<OverlayPanel>(null);
    const accordionIndex = useSelector((state: RootState) => state.areaAgent.accordionIndex);
    // const clearData = () => {

    //     if (msgs.current) {
    //         msgs.current.clear();
    //     }

    //     setCurrentstate(null);
    //     setCurrentCountie(null);
    //     setCurrentCity(null);
    //     setSelectedZipCode([]);
    //     setCurrentMonth(3);
    //     setRefreshKey(prevKey => prevKey + 1); // Change the refresh key to force re-render    
    //     dispatch(setMarkers([]));
    //     dispatch(setTransactions([]));
    //     dispatch(setTotalTransactions(0));
    //     dispatch(setTotalAgents([]));
    //     dispatch(setActivityReportClicked(true));

    // }

    //Save search and favorite
    const saveSearchHistory = async (savedType: string, city: string, zips: string,state : string, county : string) => {

        if (keycloak.tokenParsed?.sub) {
            const userId = keycloak.tokenParsed.sub;
            let history = JSON.parse(localStorage.getItem(userId + '-area') || '[]');
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

                localStorage.setItem(userId + '-area', JSON.stringify(history));
                dispatch(setSearchHistory(history));


                try {
                    await GeoAreaAgentProdService.saveSearchHistory(userId, savedType, city, zips,state,county);
                } catch (error) {
                    console.error('Error saving search history:', error);
                }
                console.log(searchHistory);
            }
        }
    };

    const fetchSavedSearches = async () => {
        if (keycloak.tokenParsed?.sub) {
            setIsLoadingSavedSearch(true);
            const userId = keycloak.tokenParsed.sub;

            await GeoAreaAgentProdService.getSavedSearches(userId, "area")
                .then((response: any) => {

                    /*  const history = response.data;
                     console.log(history);
                     localStorage.setItem(userId, JSON.stringify(history));
                     setSearchHistory(history); */
                    dispatch(setSearchHistory(response.data));
                    localStorage.setItem(userId + '-area', JSON.stringify(response.data));
                    setIsLoadingSavedSearch(false);
                })
                .catch((e: Error) => {
                    console.log(e);
                });



        }
    };

    const fetchSavedSearchesTeam = async () => {
        if (keycloak.tokenParsed?.sub) {
            setIsLoadingSavedSearchTeam(true);
            const userId = keycloak.tokenParsed.sub;

            await GeoAreaAgentProdService.getSavedSearches(userId, "areaTeam")
                .then((response: any) => {

                    /*  const history = response.data;
                     console.log(history);
                     localStorage.setItem(userId, JSON.stringify(history));
                     setSearchHistory(history); */
                    dispatch(setSearchHistoryTeam(response.data));
                    localStorage.setItem(userId + '-areaTeam', JSON.stringify(response.data));
                    setIsLoadingSavedSearchTeam(false);
                })
                .catch((e: Error) => {
                    console.log(e);
                });



        }
    };

    useEffect(() => {
        if (keycloak.tokenParsed?.sub) {
            fetchSavedSearches();
            fetchSavedSearchesTeam();
            

        }
    }, [keycloak.tokenParsed?.sub]);


    const toggleFavorite = async (search: SearchItemArea, event: CheckboxChangeEvent) => {
        event.preventDefault();
        if (keycloak.tokenParsed?.sub) {
            const userId = keycloak.tokenParsed.sub;
            const updatedSearch = { ...search, isFavorite: !search.isFavorite };
            if(search.savedType === 'area'){
                try {
                    await GeoAreaAgentProdService.toggleFavorite(userId, search.city, search.zips,search.state,search.county, updatedSearch.isFavorite);
                    const updatedHistory = searchHistory.map(item =>
                        item.city === search.city && 
                        item.zips === search.zips && 
                        item.state === search.state && 
                        item.county === search.county
                        ? { ...item, isFavorite: !item.isFavorite }
                        : item
                    );
                    
                    dispatch(setSearchHistory(updatedHistory));
                    
                    localStorage.setItem(userId + '-area', JSON.stringify(searchHistory));
                    if (updatedSearch.isFavorite === false) {
                        toast.success('Saved!');
                    } else {
                        toast.success('Deleted!');

                    }
                } catch (error) {
                    console.error('Error toggling favorite:', error);
                }
            }else if(search.savedType === 'areaTeam'){
                try {
                    await GeoAreaAgentProdService.toggleFavoriteTeam(userId, search.city, search.zips,search.state,search.county, updatedSearch.isFavorite);
                    const updatedHistory = searchHistoryTeam.map(item =>
                        item.city === search.city && 
                        item.zips === search.zips && 
                        item.state === search.state && 
                        item.county === search.county
                        ? { ...item, isFavorite: !item.isFavorite }
                        : item
                    );
                    
                    dispatch(setSearchHistoryTeam(updatedHistory));
                    
                    localStorage.setItem(userId + '-areaTeam', JSON.stringify(searchHistoryTeam));
                    if (updatedSearch.isFavorite === false) {
                        toast.success('Saved!');
                    } else {
                        toast.success('Deleted!');

                    }
                } catch (error) {
                    console.error('Error toggling favorite:', error);
                }
            }
        }
    };

    const deteteNonFavorite = async () => {
        if (keycloak.tokenParsed?.sub) {
          const userId = keycloak.tokenParsed.sub;
          if(selectedTabIndexSearchHis === 0){
            try {
                await GeoAreaAgentProdService.deteteNonFavorite(userId, 'area');
                fetchSavedSearches();     
        
            } catch (error) {
                console.error('Error detele non favorite:', error);
            }
          }else if(selectedTabIndexSearchHis === 1){
            try {
                await GeoAreaAgentProdService.deteteNonFavorite(userId, 'areaTeam');
                fetchSavedSearchesTeam();     
        
            } catch (error) {
                console.error('Error detele non favorite:', error);
            }
          }
        }
      };

    const buildAreaHeader = () => {
         
        const cities = selectedLocation.city || [];
        const zips = selectedLocation.zip || [];

        let header = `${selectedLocation.state} (${selectedLocation.stateCode})`;

        if (selectedLocation.county) {
            header += ` • ${selectedLocation.county}`;
        }

        if (cities.length > 0) {
            const displayedCities = cities.slice(0, 2).join(', ');
            const remainingCities = cities.length - 2;

            header += ` • ${displayedCities}`;

            if (remainingCities > 0) {
                header += `, ${remainingCities} Cities Selected`;
            }
        }

        if (zips.length > 0) {
            const displayedZips = zips.slice(0, 2).join(', ');
            const remainingZips = zips.length - 2;

            header += ` • ${displayedZips}`;

            if (remainingZips > 0) {
                header += `, ${remainingZips} Zip Codes Selected`;
            }
        }

        return header;
    };

    const headerPane1 = (options: PanelHeaderTemplateOptions) => {
        const className = `${options.className} justify-content-space-between`;

        const hasMoreItems =
            (selectedLocation.city?.length || 0) > 2 ||
            (selectedLocation.zip?.length || 0) > 2;

        const hasSelection =
            selectedLocation.state ||
            selectedLocation.county ||
            selectedLocation.city?.length > 0 ||
            selectedLocation.zip?.length > 0;

        return (
            <div className={className}>
                <div className="flex align-items-center gap-3">
                    <Avatar
                        icon="pi pi-search"
                        size="large"
                        shape="circle"
                        className="mr-1"
                    />

                    <span className="mr-1">
                        <strong>Choose Area</strong>
                    </span>

                    <a
                        className="badge badge-info"
                        role="button"
                        tabIndex={0}
                        data-bs-toggle="popover"
                        data-placement="bottom"
                        title="Note"
                        data-bs-content="The agent and office information shown here comes from the most recent phone numbers and email addresses used in their MLS listings."
                    >
                        <i
                            id="idInfoIcon"
                            className="bi bi-info-circle"
                        />
                    </a>
                </div>

                <div className="d-flex align-items-center flex-grow-1 justify-content-center gap-2">
                    {hasSelection && (
        <>
            <strong>{buildAreaHeader()}</strong>

            {hasMoreItems && (
                <>
                        <Button
                            type="button"
                            label="View"
                            link
                            className="p-0"
                            onClick={(e) => areaOverlayRef.current?.toggle(e)}
                        />

                        <OverlayPanel
                            ref={areaOverlayRef}
                            style={{ width: '450px' }}
                        >
                            <div
                                style={{
                                    maxHeight: '350px',
                                    overflowY: 'auto'
                                }}
                            >
                                {selectedLocation.city?.length > 0 && (
                                    <>
                                        <h6>Cities</h6>

                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            {selectedLocation.city.map((city) => (
                                                <span
                                                    key={city}
                                                    className="badge bg-primary"
                                                >
                                                    {city}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {selectedLocation.zip?.length > 0 && (
                                    <>
                                        <h6>Zip Codes</h6>

                                        <div className="d-flex flex-wrap gap-2">
                                            {selectedLocation.zip.map((zip) => (
                                                <span
                                                    key={zip}
                                                    className="badge bg-secondary"
                                                >
                                                    {zip}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </OverlayPanel>
                    </>
                )}
            </>
        )}
                </div>

                <div>
                    {options.collapsed ? (
                        <button
                            type="button"
                            className="btn btn-tool"
                            onClick={togglePanel}
                        >
                            <strong>Open</strong>
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-tool"
                            onClick={togglePanel}
                        >
                            <strong>Close</strong>
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // function getMessageHeader(selectedLocation :SelectedLocation){
    //     // const param = zips.map((element) => element.zip);

    //        return(

    //         <div className="flex align-items-center gap-3">
    //             <strong>
    //         {`${selectedLocation.city?.join(', ')}`}
    //         </strong>
    //         <div>
    //         <strong>
    //             {currentMonth+' - Month'}
    //             </strong>

    //         </div>
    //      </div>

    //        );
    //  };
    function getMessageHeader(sel: SelectedLocation) {
        const fullParts: string[] = [];
        if (sel.state) fullParts.push(`${sel.state} (${sel.stateCode})`);
        if (sel.county) fullParts.push(sel.county);
        if (sel.city?.length) fullParts.push(sel.city.join(", "));
        if (sel.zip?.length) fullParts.push(sel.zip.join(", "));
      
        const compactParts: string[] = [];
        if (sel.state) compactParts.push(`${sel.state} (${sel.stateCode})`);
        if (sel.county) compactParts.push(sel.county);
        if (sel.city?.length) compactParts.push(`${sel.city.length} cities`);
        if (sel.zip?.length) compactParts.push(`${sel.zip.length} zips`);
      
        const label = isMobile ? compactParts.join(" • ") : fullParts.join(" • ");
        const title = fullParts.join(" • "); // tooltip complet
      
        return (
          <div className="location-summary" title={title}>
            <strong>{label}</strong>
          </div>
        );
      }
      

    // const fetchTransactionsdata = async (paramZip: string[],nbrMonth : number,citySelected : string,state : string,county : string) => {

    //     try {

    //         console.log(collapsed);
    //         // if(collapsed){
    //             togglePanel();
    //         // }
            
    //         // onLoadingTransactionsChange(true);
        
    //         // const response = await GeoAreaService.fetchTransactions(paramZip.join(','),nbrMonth);
        
    //         // dispatch(setTransactions(response));
    //         await dispatch(fetchTransactions({ paramZip, nbrMonth }));
    //         await dispatch(fetchTotalTransactions({paramZip, nbrMonth}));
    //         await dispatch(fetchTotalAgents({paramZip, nbrMonth}));

    //         //Re-populate fields
    //         const city: Cities = { name: citySelected.split(',')[0], code: Number(citySelected.split(',')[1]) };
    //         // setCurrentCities(city);
    //         dispatch(setCurrentCitySaveSearch(city));
    //         const stateObj: States = { name: state.split(',')[1], code: state.split(',')[0] };
    //         // setCurrentStates(stateObj);
    //         dispatch(setCurrentstateSaveSearch(stateObj));
    //         const countyObj: Counties = { name: county.split(',')[1], code: Number(county.split(',')[0]) };
    //         // setCurrentCounties(countyObj);
    //         // setCurrentMonth(nbrMonth);
    //         dispatch(setCurrentCountySaveSearch(countyObj));
    //         dispatch(setNbrMonthSaveSearch(nbrMonth));
         

           
    //     // setCurrentZip(zip);
    //         await GeoAreaService.getZipByCode(paramZip.toString())
    //         .then((response: any) => {
    //             // setCurrentZip(response.data);
    //             // setSelectedZipCode(response.data);
    //             dispatch(setCurrentZipSaveSearch(response.data));//for re-populate field when back to page
    //             dispatch(setSelectedZipCodeSaveSearch(response.data));//for re-populate field when back to page

                



    //         })
    //         .catch((e: Error) => {
    //             console.log(e);
    //         });

            
        
    //     } catch (e) {
    //         console.error(e);
    //     } finally {
    //         // onLoadingTransactionsChange(false);
            
    //         if(activityReportClicked){
    //         dispatch(setActivityReportClicked(!activityReportClicked));
    //         }
    //     }
    // };

    
    
    const formatPrice = (price: any) => {
        if (!price || isNaN(price)) return "";  
        return `$ ${Number(price).toLocaleString("en-US")}`;
    };

    const handleClickGeoAreaAgentProdReport = () => { 

        // setActivityReportClicked(!activityReportClicked);
        dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));
    }

    const searchAgents = async (event:any) => {
        try {
          const results = await GeoAreaAgentProdService.searchAgents(
            selectedLocation, 
            event.query
          );
          setSuggestions(results);
        } catch (error) {
          console.error("Erreur de recherche:", error);
        }
      };

    const getGeoProductionForAgent = async (agent: AgentSearch) => {
        dispatch(setIsFiltered(true));
        try {
          const results = await GeoAreaAgentProdService.getGeoProductionForAgent(selectedLocation, agent.agentId);
          dispatch(setAgentGeoProdResult(results));

        } catch (error) {
          console.error("Erreur de recherche:", error);
        }
      };

    const displayAreaMap = () => {

        setVisible(true);
    }

    const exportExcel = async () => {

       await dispatch(getAgentGeoProductionForExtraction(selectedLocation));
        
       const headers = [
        "First Name",
        "Last Name",
        "Office Name",
        "Tier",
        "12mo Sales In/Out",
        "A12mo YoY % In/Out",
        "12mo Sales In/Only",
        "12mo YoY % In/Only",
        "Listing In/Out",
        "Selling In/Out"
      ];
      console.log(agentGeoProdResultExtract);

      if(agentGeoProdResultExtract.length >0){

      const ws = utils.json_to_sheet(
        agentGeoProdResultExtract.map(item => ({
          "First Name": item.firstName,
          "Last Name": item.lastName,
          "Office Name": item.officeName,
          "Tier": item.tier,
          "12mo Sales In/Out": item.total_cur,
          "A12mo YoY % In/Out": item.agentSalesYoyInOutArea,
          "12mo Sales In/Only": item.part_total_curr,
          "12mo YoY % In/Only": item.agentSalesYoyInArea,
          "Listing In/Out": item.list,
          "Selling In/Out": item.sell
        })),
        { header: headers }
      );
    
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Agents");
    
      writeFile(wb, "agents_export.xlsx", { compression: true });
    }


    
    };
    const exportExcel1 = async () => {
        // if (isExporting) return;
        const headers = [
            "First Name",
            "Last Name",
            "Office Name",
            "Office Address",
            "State",
            "City",
            "Tier",
            "Persona",
            "DNA",
            "12mo Sales In/Out",
            "A12mo YoY % In/Out",
            "12mo Sales In/Only",
            "12mo YoY % In/Only",
            "Listing In/Out",
            "Selling In/Out"
          ];
        try {
          const actionResult = await dispatch(getAgentGeoProductionForExtraction(selectedLocation));
          
          if (getAgentGeoProductionForExtraction.fulfilled.match(actionResult)) {
            const resultData = actionResult.payload;
            
            if (resultData.length === 0) {
              toast.warning("No data to export");
              return;
            }
      
            const ws = XLSX.utils.json_to_sheet(resultData.map(item => ({
                "First Name": item.firstName,
                "Last Name": item.lastName,
                "Office Name": item.officeName,
                "Office Address": item.officeAddress1,
                "State":item.state,
                "City" : item.city,
                "Tier": item.tier,
                "Persona": item.persona,
                "DNA": item.dna,
                "12mo Sales In/Out": item.total_cur,
                "A12mo YoY % In/Out": item.agentSalesYoyInOutArea,
                "12mo Sales In/Only": item.part_total_curr,
                "12mo YoY % In/Only": item.agentSalesYoyInArea,
                "Listing In/Out": item.list,
                "Selling In/Out": item.sell
              })),
              { header: headers });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Agents");
            XLSX.writeFile(wb, `export_${Date.now()}.xlsx`);
          }
        } catch (error) {
          toast.error("Export failed.");
        }
      };

    const handleTabChange = (e:any) => {

        dispatch(setSelectedTabIndex(e.index)); // Update the active tab index
    

    }

    const handleTabChangeSearchHis = (e:any) => {

        setselectedTabIndexSearchHis(e.index); // Update the active tab index
    

    }

    const handleClickActivityReport = () => { 

        // setActivityReportClicked(!activityReportClicked);
        dispatch(setActivityReportClicked(!activityReportClicked));
    }

    const handleSearchFromHist = async (selectedLocation: SelectedLocation) => {
        dispatch(setSelectedLocation(selectedLocation));
        if (selectedLocation.searchType === 'A'){
            setVisibleRight(false);
            dispatch(setAgentGeoProdResult([]));
            dispatch(setTotalAgent(0));
            dispatch(setTotalTransactionsAg(0));
            dispatch(setTotalListingsAgent(0));
            //listings
            dispatch(setListingsGeoProduction([]));
            dispatch(setTotalAgentForListing(0));
            dispatch(setTotalTransactionForListings(0));

            
            try {
                dispatch(setSelectedTabIndex(0));
                togglePanel();
                await dispatch(getAgentGeoProduction({selectedLocation}));
                dispatch(getTotalAgents({selectedLocation}));
                dispatch(getTotalTransactionAgent({selectedLocation}));
                dispatch(getTotalListingsAgent({selectedLocation}));
                //listings
                await dispatch(getListingsGeoProduction({selectedLocation}));
                // dispatch(setOriginalData(listingsGeoProduction));
                // dispatch(setDisplayedData(listingsGeoProduction));
                dispatch(getTotalAgentForListing({selectedLocation}));
                dispatch(getTotalTransactionForListings({selectedLocation}));
            } catch (e) {
                console.error(e);
            } finally {

                    
                if(geoAreaAgentProdReportClicked){
                dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));
                }
                if(activityReportClicked){
                    dispatch(setActivityReportClicked(!activityReportClicked));
                }
            }
        }
        if (selectedLocation.searchType === 'T') {
        try {
              togglePanel();

            await dispatch(getTeamGeoProduction(selectedLocation));

            
        } catch (e) {
            console.error(e);
        }
      }

    }

    //Search agent in listings Tab
    // useEffect(() => {

    //     dispatch(setOriginalData(listingsGeoProduction));
    //     dispatch(setDisplayedData(listingsGeoProduction));

        
    // }, [listingsGeoProduction]);

    useEffect(() => {
        if(!isFiltered){
        dispatch(setInitialeAgentGeoProdResult(AgentGeoProdResult));
        }
        
    }, [AgentGeoProdResult]);

    const clearSearchAgent = () => {
        dispatch(setSearchTerm(null));
        dispatch(setAgentGeoProdResult(initialeAgentGeoProdResult));
        dispatch(setIsFiltered(false));
        setSuggestions([]);
    };

    

    return (
        <MapProvider>

        <div className="container mt-3">

            <Panel header="Choose Area" headerTemplate={headerPane1} ref={panelRef} toggleable>
                <div className="grid nested-grid" key={refreshKey}>
                    {/* <div className="col-10">
                        <div className="row mb-3">
                         <SearchByInputCounty />
                        </div>
                         <UsaMap />
                    
                    </div>   */}
                    <div className="col-10">

                        <Accordion multiple={false} activeIndex={accordionIndex}
                        onTabChange={(e) =>
                            dispatch(setAccordionIndex(e.index))
                        } >

                            <AccordionTab header={
                                <span >
                                    <i className="pi pi-search mr-2" />
                                    Simple Search
                                </span>
                            }>
                                <SearchByInputCounty />
                            </AccordionTab>

                            <AccordionTab header={
                                <span>
                                    <i className="pi pi-map mr-2" />
                                    Advanced Search
                                </span>
                            }>
                                <UsaMap />
                            </AccordionTab>

                        </Accordion>

                    </div>
                    <div className="col-2 md:col-4">
                    <div className="d-flex justify-content-end">
                        
                        <Button
                            type="button"
                            outlined
                            severity="info"
                            icon="pi pi-history"
                            label="Search History"
                            className="modern-history-btn"
                            onClick={() => setVisibleRight(true)}
                        />
                    </div>
                        <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)} style={{width: '50rem'}}>
                            <TabView activeIndex={selectedTabIndexSearchHis} onTabChange={handleTabChangeSearchHis}>
                                <TabPanel header="Agents" rightIcon="bi bi-person-badge-fill ml-2">
                                    <div className="col-12  mx-auto">
                                        <SearchHistory
                                            title="Search History"
                                            isLoading={isLoadingSavedSearch}
                                            searchHistory={searchHistory}
                                            // onSearchClick={(search : any) => handleSearchFromHist({state:"",stateCode: search.state, county:search.county,city: search.city.split(',').map((c:any) => c.trim()),agentId:0,zip: search.zips?search.zips.split(',').map((c:any) => c.trim()):[],searchType: 'A'})}
                                            onSearchClick={(search: any) =>
                                                handleSearchFromHist({
                                                    state: "",
                                                    stateCode: search.state,
                                                    county: search.county,
                                                    city: search.city
                                                    ? search.city
                                                        .split(',')
                                                        .map((c: any) => c.trim())
                                                        .filter(Boolean)
                                                    : [],
                                                    agentId: 0,
                                                    zip: search.zips
                                                    ? search.zips
                                                        .split(',')
                                                        .map((c: any) => c.trim())
                                                        .filter(Boolean)
                                                    : [],
                                                    searchType: 'A'
                                                })
                                                }
                                            onToggleFavorite={toggleFavorite}
                                            onDeteteNonFavorite={deteteNonFavorite}
                                            parent="Area"
                                        />


                                    </div>  
                                
                                </TabPanel>
                                <TabPanel header="Teams" rightIcon="bi bi-people-fill ml-2">

                                     <div className="col-12  mx-auto">
                                        <SearchHistory
                                            title="Search History"
                                            isLoading={isLoadingSavedSearchTeam}
                                            searchHistory={searchHistoryTeam}
                                            // onSearchClick={(search : any) => handleSearchFromHist({state:"",stateCode: search.state, county:search.county,city: search.city.split(',').map((c:any) => c.trim()),agentId:0,zip: search.zips?search.zips.split(',').map((c:any) => c.trim()):[],searchType: 'T'})}
                                            onSearchClick={(search: any) =>
                                                handleSearchFromHist({
                                                    state: "",
                                                    stateCode: search.state,
                                                    county: search.county,
                                                    city: search.city
                                                    ? search.city
                                                        .split(',')
                                                        .map((c: any) => c.trim())
                                                        .filter(Boolean)
                                                    : [],
                                                    agentId: 0,
                                                    zip: search.zips
                                                    ? search.zips
                                                        .split(',')
                                                        .map((c: any) => c.trim())
                                                        .filter(Boolean)
                                                    : [],
                                                    searchType: 'T'
                                                })
                                                }
                                            onToggleFavorite={toggleFavorite}
                                            onDeteteNonFavorite={deteteNonFavorite}
                                            parent="Area"
                                        />


                                    </div>  

                                </TabPanel>
                                                

                            </TabView>
                        
                        </Sidebar>

                    </div>
                </div>

                <Divider />
                {/* <Messages ref={msgs} /> */}


            </Panel>
        {(selectedLocation.searchType ==='A')?    
            <div className="row mt-1" id="custom-tabview">
                <TabView activeIndex={selectedTabIndex} onTabChange={handleTabChange}>
                    
                    <TabPanel header={
                                    <div className="mt-1 pt-1">
                                            {loadingAgentGeoProdResult ? (
                                                <div className="flex align-items-center ">
                                                <span className="ml-2">Loading...</span>
                                                <i className="bi bi-arrow-repeat animate-spin" />
                                                </div>
                                            )  : (
                                                <>  
                                                    <div className="flex align-items-center ">
                                                        <span className="ml-2">Past Sales</span>
                                                        <i className="bi bi-person-vcard ml-2" />
                                                    </div>
                                                
                                                </>


                                            )}
                                        </div>
                                    }>
                            <div className="col-md-12 col-sm-6">
                                <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the agent’s total monthly production for the most recently completed 12 months, compared to the same 12-month period a year ago. It does not include the current “partial” month’s production. The values include listing and co-listing transactions. Plus, sales outside of the MLS, if we have that data.">
                                    <i className="bi bi-info-circle fs-6" /></a> Area Activity: Who are the Top Producing Agents in this area?</h5>
                                <div className={`card ${!geoAreaAgentProdReportClicked ? '' : 'collapsed-card'}`}>
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-sm-2 border-right">
                                                <div className="description-block">
                                                    {totalAgentLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                        :
                                                        <div className="mx-3">
                                                        <div className="flex justify-content-between gap-1">
                                                            <div className="flex flex-column gap-1">
                                                                <span className="text-secondary text-sm">Agents</span>
                                                                <span className="font-bold text-lg">{totalAgents}</span>
                                                            </div>
                                                            <span
                                                                className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                                style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                            >
                                                                <i className="fa fa-users   " />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    }
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            <div className="col-sm-2 border-right">
                                                <div className="description-block">  
                                                {totalTransactionAgentLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                        :
                                                        <div className="mx-3">
                                                        <div className="flex justify-content-between gap-1">
                                                            <div className="flex flex-column gap-1">
                                                                <span className="text-secondary text-sm">Transactions</span>
                                                                <span className="font-bold text-lg">{totalTransactionAgent}</span>
                                                            </div>
                                                            <span
                                                                className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                                style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                            >
                                                                <i className="fa fa-money-check-alt   " />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    }

                                                    
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            <div className="col-sm-2">
                                                <div className="description-block">  
                                                {totalListingsAgentLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                        :
                                                        <div className="mx-3">
                                                        <div className="flex justify-content-between gap-1">
                                                            <div className="flex flex-column gap-1">
                                                                <span className="text-secondary text-sm">Listings</span>
                                                                <span className="font-bold text-lg">{totalListingsAgent}</span>
                                                            </div>
                                                            <span
                                                                className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                                style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                            >
                                                                <i className="fa fa-clipboard-list   " />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    }                                             
                                                    
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="description-block">
                                                    {loadingAgentGeoProdResult && (<div className="col-12 mb-5"><BeatLoader className="loading-container mt-3" size={25} color="#36d7b7" /></div>)

                                                    }
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            <div className="col-sm-1">


                                            </div>

                                            <div className="col-sm-2 text-right">
                                                <button id="idDisplayChart" type="button" className="btn btn-tool " onClick={handleClickGeoAreaAgentProdReport} >

                                                    {!geoAreaAgentProdReportClicked ? <strong>Close</strong> : <strong>Open</strong>}

                                                    {/* <i id="idDisplayChart" className="fas fa-plus" /> */}
                                                </button>
                                            </div>
                                        </div>
                                        {/* /.card-tools */}
                                    </div>
                                    {/* /.card-header */}

                                    <div className={`card-body pb-0 pt-0 pr-0 pl-0 ${!geoAreaAgentProdReportClicked ? '' : 'd-none'}`}>
                                        {AgentGeoProdResult.length > 0 ?
                                            (<div className="mt-5 mb-5 ml-2 d-flex justify-content-between">
                                                <div className=" ml-2 d-flex align-items-center gap-2">
                                                    <AutoComplete
                                                        field="fullName"
                                                        value={searchTerm}
                                                        suggestions={suggestions}
                                                        completeMethod={searchAgents}
                                                        onChange={(e) => dispatch(setSearchTerm(e.value))}
                                                        onSelect={(e) => {
                                                        dispatch(setSearchTerm(e.value.fullName));
                                                        getGeoProductionForAgent(e.value);
                                                        }}
                                                        placeholder="Search an agent..."
                                                        className="w-25"
                                                    />

                                                    {isFiltered && (
                                                        <Button
                                                        icon="pi pi-times"
                                                        className="p-button-danger modern-history-btn"
                                                        label="Clear"
                                                        aria-label="Clear"
                                                        onClick={clearSearchAgent}
                                                        type="button"
                                                        outlined
                                                        severity="info"
                                                        />
                                                    )}
                                                </div>

                                                {extractionLoading ? (
                                                    <div className="d-flex align-items-center">
                                                        <i className="pi pi-spin pi-spinner mr-2" style={{ fontSize: '1.5rem' }}></i>
                                                        <span>Exporting...</span>
                                                    </div>
                                                ) : (
                                                    <div>
                                                    <Button
                                                        icon="pi pi-file-excel"
                                                        label="Export Excel"
                                                        aria-label="Export Excel"
                                                        className="modern-history-btn mr-2"
                                                        onClick={exportExcel1}
                                                        type="button"
                                                        outlined
                                                        severity="info"
                                                    />
                                                    </div>
                                                )}
                                            </div>)
                                            : null}

                                        <div className="row  pb-0 pt-0 pr-0 pl-0">
                                            {!geoAreaAgentProdReportClicked && <CremsTableAgents displayAreaMap={displayAreaMap} ></CremsTableAgents>}
                                            <div className=" justify-content-center">

                                                <Dialog header="Map Area" visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                                                    <div>
                                                        {error && <div className="alert alert-danger">{error}</div>}

                                                        <CremsMap />

                                                    </div>
                                                </Dialog>

                                            </div>

                                        </div>



                                    </div>
                                    {/* /.card-body */}

                                </div>
                                {/* /.card */}



                            </div>


                    </TabPanel>
                    <TabPanel header={
                            <div className="mt-1 pt-1">
                                {listingsGeoLoading ? (
                                                <div className="flex align-items-center ">
                                                <span className="ml-2">Loading...</span>
                                                <i className="bi bi-arrow-repeat animate-spin" />
                                                </div>
                                            )  : (
                                                <>  
                                                    <div className="flex align-items-center ">
                                                        <span className="ml-2">Current Listings</span>
                                                        <i className="bi bi-card-list ml-2" />
                                                    </div>
                                                
                                                </>


                                            )}
                            </div>
                        }>
                            <div className="col-md-12 col-sm-6">
                                <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the agent’s total monthly production for the most recently completed 12 months, compared to the same 12-month period a year ago. It does not include the current “partial” month’s production. The values include listing and co-listing transactions. Plus, sales outside of the MLS, if we have that data.">
                                    <i className="bi bi-info-circle fs-6" /></a> Area Activity: What transaction have there been in this area?</h5>
                                <div className={`card ${!activityReportClicked ? '' : 'collapsed-card'}`}>
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-sm-2 border-right ">
                                                <div className="description-block">  
                                                {totalAgentForListingLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                        :
                                                        <div className="mx-3">
                                                        <div className="flex justify-content-between gap-1">
                                                            <div className="flex flex-column gap-1">
                                                                <span className="text-secondary text-sm">Agents</span>
                                                                <span className="font-bold text-lg">{totalAgentForListing}</span>
                                                            </div>
                                                            <span
                                                                className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                                style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                            >
                                                                <i className="fa fa-users" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    }                                          
                                                
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            <div className="col-sm-2 border-right">
                                                <div className="description-block">     
                                                {totalTransactionForListingsLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                        :
                                                        <div className="mx-3">
                                                        <div className="flex justify-content-between gap-1">
                                                            <div className="flex flex-column gap-1">
                                                                <span className="text-secondary text-sm">Transactions</span>
                                                                <span className="font-bold text-lg">{totalTransactionForListings}</span>
                                                            </div>
                                                            <span
                                                                className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                                style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                            >
                                                                <i className="fa fa-money-check-alt   " />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    }                                                                                               
                                                    
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            <div className="col-sm-2">


                                            </div>
                                            <div className="col-sm-3">
                                                <div className="description-block">
                                                    {listingsGeoLoading && (<div className="col-12 mb-5"><BeatLoader className="loading-container mt-3" size={25} color="#36d7b7" /></div>)

                                                    }
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            <div className="col-sm-1">


                                            </div>

                                            <div className="col-sm-2 text-right">
                                                <button id="idDisplayChart" type="button" className="btn btn-tool " onClick={handleClickActivityReport} >

                                                    {!activityReportClicked ? <strong>Close</strong> : <strong>Open</strong>}

                                                    {/* <i id="idDisplayChart" className="fas fa-plus" /> */}
                                                </button>
                                            </div>
                                        </div>
                                        {/* /.card-tools */}
                                    </div>
                                    {/* /.card-header */}

                                    <div className={`card-body pb-0 pt-0 pr-0 pl-0 ${!activityReportClicked ? '' : 'd-none'}`}>
                                        <div className="row  pb-0 pt-0 pr-0 pl-0">
                                            {!activityReportClicked && <CremsTableListings displayAreaMap={displayAreaMap} nbrMonth={12} ></CremsTableListings>}
                                            <div className=" justify-content-center">

                                                <Dialog header="Map Area" visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                                                    <div>
                                                        {error && <div className="alert alert-danger">{error}</div>}

                                                        <CremsMap />

                                                    </div>
                                                </Dialog>

                                            </div>

                                        </div>



                                    </div>
                                    {/* /.card-body */}

                                </div>
                                {/* /.card */}



                            </div>
                       

                    </TabPanel>
                    {/* <TabPanel header="Second-Level Table" rightIcon="bi bi-table ml-2">


                    </TabPanel> */}
                    
                </TabView>
                

            </div>
        : 
        null    
        }
        {selectedLocation.searchType ==='T'? 
            <div className="row  pb-0 pt-0 pr-0 pl-0  ">
                        <div className="card mt-3"  >
                            <TabView  >
                                <TabPanel header="Team Table" rightIcon="bi bi-table ml-2">
                                  
                                  <AreaTeamTable  />

                                    
                                </TabPanel>                                                    

                            </TabView>
                        </div>
                    </div>
        :
        null


        }

        </div>

        </MapProvider>

    );
};

export default SearchByAreaV2;
