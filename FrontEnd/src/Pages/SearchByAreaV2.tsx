import React, { useState, useEffect, useRef } from 'react';
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
import {getAgentGeoProduction,setGeoAreaAgentProdReportClicked,setAgentGeoProdResult,setActivityReportClicked} from '../Redux/Slices/MapSlice'
import {getAgentGeoProductionForExtraction, setSelectedTabIndex} from '../Redux/Slices/AreaAgentSlice'
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






// interface AutocompleteItem {
//     value: number;
//     label: string;
//   }

interface MonthSuggestion {
    key: number;
    value: number;
}


function SearchByAreaV2() {


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

    const [searchTerm, setSearchTerm] = useState<AgentSearch>();
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

    const [searchHistory, setSearchHistory] = useState<Array<SearchItemArea>>([]);
    const [isLoadingSavedSearch, setIsLoadingSavedSearch] = useState(Boolean);
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
    const totalTransaction = useSelector((state: RootState) => state.areaAgent.totalTransaction);
    const totalListings = useSelector((state: RootState) => state.areaAgent.totalListings);
    const agentGeoProdResultExtract = useSelector((state: RootState) => state.areaAgent.agentGeoProdResultExtract);
    const extractionLoading = useSelector((state: RootState) => state.areaAgent.extractionLoading);
    // const [selectedTabIndex, setSelectedTabIndex] = useState(-1);
    const selectedTabIndex = useSelector((state: RootState) => state.areaAgent.selectedTabIndex);
    const TotalTransactions = useSelector((state: RootState) => state.map.totalTransactions);
    const TotalAgents = useSelector((state: RootState) => state.map.totalAgents);
    const listingsGeoLoading = useSelector((state: RootState) => state.areaAgent.listingsGeoLoading);

    


   
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
    const saveSearchHistory = async (savedType: string, city: string, zips: string,state : string, county : string, nbrMonth : number) => {

        if (keycloak.tokenParsed?.sub) {
            const userId = keycloak.tokenParsed.sub;
            let history = JSON.parse(localStorage.getItem(userId + '-area') || '[]');
            const newSearch = { savedType, city, zips,state,county,nbrMonth, isFavorite: true };
            if (!history.some((item: SearchItemArea) => item.city === city && item.zips === zips && item.state === state && item.county === county && item.nbrMonth === nbrMonth)) {
                
                console.log(newSearch);
                console.log(history);
                if (history.length >= 10) {
                    //history = history.slice(1);
                    history.pop();

                }
                //history.push(newSearch);
                history.unshift(newSearch);

                localStorage.setItem(userId + '-area', JSON.stringify(history));
                setSearchHistory(history);


                try {
                    await GeoAreaService.saveSearchHistory(userId, savedType, city, zips,state,county,nbrMonth);
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

            await GeoAreaService.getSavedSearches(userId, "area")
                .then((response: any) => {

                    /*  const history = response.data;
                     console.log(history);
                     localStorage.setItem(userId, JSON.stringify(history));
                     setSearchHistory(history); */
                    setSearchHistory(response.data);
                    console.log(response.data[0].city);
                    localStorage.setItem(userId + '-area', JSON.stringify(response.data));
                    setIsLoadingSavedSearch(false);
                })
                .catch((e: Error) => {
                    console.log(e);
                });



        }
    };

    useEffect(() => {
        if (keycloak.tokenParsed?.sub) {
            fetchSavedSearches();
            

        }
    }, [keycloak.tokenParsed?.sub]);

    

    const toggleFavorite = async (search: SearchItemArea, event: CheckboxChangeEvent) => {
        event.preventDefault();
        if (keycloak.tokenParsed?.sub) {
            const userId = keycloak.tokenParsed.sub;
            const updatedSearch = { ...search, isFavorite: !search.isFavorite };
            try {
                await GeoAreaService.toggleFavorite(userId, search.city, search.zips,search.state,search.county,search.nbrMonth, updatedSearch.isFavorite);
                setSearchHistory(prevHistory =>
                    prevHistory.map(item =>
                        item.city === search.city && item.zips === search.zips && item.state === search.state && item.county === search.county && item.nbrMonth === search.nbrMonth ? { ...item, isFavorite: !item.isFavorite } : item
                    )
                );
                localStorage.setItem(userId + '-area', JSON.stringify(searchHistory));
                if (updatedSearch.isFavorite === false) {
                    toast.success('['+ updatedSearch.zips +']' + ' Mo ['+ updatedSearch.nbrMonth +']' + ' is saved in your favorite list');
                } else {
                    toast.success('['+ updatedSearch.zips +']' + ' Mo ['+ updatedSearch.nbrMonth +']' + ' is deleted from your favorite list');

                }
            } catch (error) {
                console.error('Error toggling favorite:', error);
            }
        }
    };

    const headerPane1 = (options: PanelHeaderTemplateOptions) => {
        const className = `${options.className} justify-content-space-between`;


        return (

            <div className={className}>

                <div className="flex align-items-center gap-3">
                    <Avatar icon="pi pi-search" size="large" shape="circle" className="mr-1" />
                    <span className="mr-1"><strong>Choose Area</strong></span>
                    <a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The agent and office information shown here comes from the most recent phone numbers and email addresses used in their MLS listings.">
                        <i id="idInfoIcon" className="bi bi-info-circle" />
                    </a>
                </div>
                    {(selectedLocation.state || 
                        selectedLocation.county || 
                        selectedLocation.city?.length > 0 || 
                        selectedLocation.zip?.length > 0) && 
                        getMessageHeader(selectedLocation)
                    }

                <div className='grid'>

                    <div className='col'>
                        
                        {options.collapsed ? (
                        <button type="button" className="btn btn-tool " onClick={togglePanel}>
                            <strong>Open</strong>
                        </button>
                    ) : (
                        <button type="button" className="btn btn-tool " onClick={togglePanel}>
                            <strong>Close</strong>
                        </button>
                    )}
                    {/* {options.togglerElement} */}
                    </div>

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
     function getMessageHeader(selectedLocation: SelectedLocation) {
        const locationParts = [];
    
        if (selectedLocation.state) {
            locationParts.push(`${selectedLocation.state} (${selectedLocation.stateCode})`);
        }
    
        if (selectedLocation.county) {
            locationParts.push(`${selectedLocation.county}`);
        }
    
        if (selectedLocation.city?.length > 0) {
            locationParts.push(`${selectedLocation.city.join(', ')}`);
        }
    
        if (selectedLocation.zip?.length > 0) {
            locationParts.push(`${selectedLocation.zip.join(', ')}`);
        }
    
        return (
            <div className="flex align-items-center gap-3">
                {locationParts.length > 0 && (
                    <div>
                        <strong>
                            {locationParts.join(' • ')}
                        </strong>
                    </div>
                )}
                
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
          setSuggestions(results.data);
        } catch (error) {
          console.error("Erreur de recherche:", error);
        }
      };

    const getGeoProductionForAgent = async (agent: AgentSearch) => {
        try {
          const results = await GeoAreaAgentProdService.getGeoProductionForAgent(selectedLocation, agent.agentId);
          dispatch(setAgentGeoProdResult(results.data));
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
          "12mo Sales In/Out": item.total_global,
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
      
            // Création du fichier Excel
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
                "12mo Sales In/Out": item.total_global,
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

    const handleClickActivityReport = () => { 

        // setActivityReportClicked(!activityReportClicked);
        dispatch(setActivityReportClicked(!activityReportClicked));
    }

    return (
        <MapProvider>

        <div className="container mt-3">

            <Panel header="Choose Area" headerTemplate={headerPane1} ref={panelRef} toggleable>
                <div className="grid nested-grid" key={refreshKey}>
                    <div className="col-8">

                         <UsaMap />
                    
                    </div>  
                    <div className="col-12 md:col-4">
                    {/* <SearchHistory
                    title="Area History"
                    isLoading={isLoadingSavedSearch}
                    searchHistory={searchHistory}
                    onSearchClick={(search) => fetchTransactionsdata([search.zips], Number(search.nbrMonth), search.city, search.state, search.county)}
                    onToggleFavorite={toggleFavorite}
                    parent="Area"
                    />
 */}

                    </div>
                </div>

                <Divider />
                {/* <Messages ref={msgs} /> */}


            </Panel>
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
                                                        <span className="ml-2">Agents</span>
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
                                            <div className="col-sm-2 ">
                                                <div className="description-block">
                                                    <h5 className="">{totalAgents}</h5>
                                                    <span className="">Agents</span>
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            <div className="col-sm-2">
                                                <div className="description-block">
                                                    <h5 className="">{totalTransaction}</h5>
                                                    <span className="">Transactions</span>
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            <div className="col-sm-2">
                                                <div className="description-block">
                                                    <h5 className="">{totalListings}</h5>
                                                    <span className="">Listings</span>
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
                                                <AutoComplete
                                                    field="fullName"
                                                    value={searchTerm}
                                                    suggestions={suggestions}
                                                    completeMethod={searchAgents}
                                                    onChange={(e) => setSearchTerm(e.value)}
                                                    onSelect={(e) => {
                                                        setSearchTerm(e.value.fullName);
                                                        getGeoProductionForAgent(e.value);
                                                    }}
                                                    placeholder="Search an agent..."
                                                />

                                                {extractionLoading ? (
                                                    <div className="d-flex align-items-center">
                                                        <i className="pi pi-spin pi-spinner mr-2" style={{ fontSize: '1.5rem' }}></i>
                                                        <span>Exporting...</span>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        icon="pi pi-file-excel"
                                                        label="Export Excel"
                                                        className="mr-2"
                                                        onClick={exportExcel1}
                                                    />
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
                                                        <span className="ml-2">Listings</span>
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
                                            <div className="col-sm-3 ">
                                                <div className="description-block">
                                                    <h5 className="">{TotalTransactions}</h5>
                                                    <span className="">Transactions</span>
                                                </div>
                                                {/* /.description-block */}
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="description-block">
                                                    <h5 className="">{TotalAgents[0] ? TotalAgents[0]?.agents : '0' }</h5>
                                                    <span className="">Agents</span>
                                                </div>
                                                {/* /.description-block */}
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

        </div>

        </MapProvider>

    );
};

export default SearchByAreaV2;
