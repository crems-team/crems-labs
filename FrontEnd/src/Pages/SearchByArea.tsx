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
import CremsTable from '../Components/CremsTable';
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
import { fetchTransactions,setActivityReportClicked,fetchTotalTransactions,fetchTotalAgents,setMarkers,setTransactions,setTotalTransactions,setTotalAgents,setCurrentCitySaveSearch,setCurrentZipSaveSearch, setCurrentstateSaveSearch, setCurrentCountySaveSearch, setSelectedZipCodeSaveSearch, setNbrMonthSaveSearch,setFirstLoad} from '../Redux/Slices/MapSlice'
import { useSearch } from '../Components/Context/Context';
import SearchHistory from '../Components/SearchHistory';
import {useLocation } from 'react-router-dom';





// interface AutocompleteItem {
//     value: number;
//     label: string;
//   }

interface MonthSuggestion {
    key: number;
    value: number;
}


function SearchByArea() {


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

    // const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);
    const transactions = useSelector((state: RootState) => state.map.transactions);
    const isLoadingTransactions = useSelector((state: RootState) => state.map.loadingTransactions);
    const TotalTransactions = useSelector((state: RootState) => state.map.totalTransactions);
    const TotalAgents = useSelector((state: RootState) => state.map.totalAgents);
    const currentZipSaveSearch = useSelector((state: RootState) => state.map.currentZipSaveSearch);
    const currentCitySaveSearch = useSelector((state: RootState) => state.map.currentCitySaveSearch);
    const currentstateSaveSearch = useSelector((state: RootState) => state.map.currentstateSaveSearch);
    const currentCountySaveSearch = useSelector((state: RootState) => state.map.currentCountySaveSearch);
    const selectedZipCodeSaveSearch = useSelector((state: RootState) => state.map.selectedZipCodeSaveSearch);
    const nbrMonthSaveSearch = useSelector((state: RootState) => state.map.nbrMonthSaveSearch);
    const { panelRef, togglePanel,collapsed ,setCollapsed } = useSearch();





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


    const areaReportRendred = () => {
        setareaReportClicked(prevState => !prevState);
    };












    useEffect(() => {
        
        const fetchStates = async () => {

            GeoAreaService.getStates()
                .then((response: any) => {
                    setstates(response.data);
                    setCopyStates(response.data);
                    localStorage.setItem('states', JSON.stringify(response.data));
                    completeMethod();

                })
                .catch((e: Error) => {
                    console.log(e);
                });
        };

        fetchStates();
        const toggle= location.state?.fromReportPage;
        console.log(location.state?.fromReportPage);
        if(toggle){


            togglePanel();


        }

        // setCollapsed(true);

    //     if (isFirstLoad ) {

    //     dispatch(setMarkers([]));
    //     dispatch(setTransactions([]));
    //     dispatch(setTotalTransactions(0));
    //     dispatch(setTotalAgents([]));
    //     dispatch(setActivityReportClicked(true));
    //     dispatch(setCurrentZipSaveSearch([]));
    //     dispatch(setCurrentCitySaveSearch(null));
    //     dispatch(setCurrentstateSaveSearch(null));
    //     dispatch(setCurrentCountySaveSearch(null));
    //     dispatch(setSelectedZipCodeSaveSearch([]));
    //     dispatch(setNbrMonthSaveSearch(3));
    //     setCollapsed(true);
    //     setCurrentCities(currentCitySaveSearch);
    //     setCurrentZip(currentZipSaveSearch);
    //     setSelectedZipCode(selectedZipCodeSaveSearch);
    //     setCurrentStates(currentstateSaveSearch);
    //     setCurrentCounties(currentCountySaveSearch);
    //     setCurrentMonth(nbrMonthSaveSearch);
    //     console.log('nbr'+isFirstLoad)
    //     dispatch(setFirstLoad(false));
    // }



    }, []);

    const setCurrentStates = async (state: States | null) => {
        try {
            //const result = await geoservice.fetchState(state.code);
            console.log(state);
            setCurrentstate(state);
            loadCounties(state);
            dispatch(setCurrentstateSaveSearch(state));//for re-populate field when back to page

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    //   const filterStates = (event: any) => {

    //     // Timeout to emulate a network connection

    //       let _filtered: States[];
    //       //var initialFilteres = states;
    //       _filtered = states;
    //       if (!event.query.trim().length) {
    //         //console.log(initialFilteres);
    //         console.log('in copy block');
    //         //console.log(copyStates);
    //         _filtered = copyStates//[...states];
    //        // setstates(copyStates);
    //       } else {
    //         console.log('else');
    //         _filtered = states.filter((item) => {
    //           return item.name.toLowerCase().startsWith(event.query.toLowerCase());
    //         });
    //       }
    //       console.log(_filtered);

    //      // setstates(_filtered);

    //   };

    const filterStates = (event: any) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filtered;
            if (!event.query.trim().length) {
                _filtered = [...copyStates];
            }
            else {

                var list = JSON.parse(localStorage.getItem('states') || '[]');

                _filtered = list.filter((item: States) => {

                    return item.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setstates(_filtered);
        }, 250);
    }

    //  const filterStates = (event: any) => {
    //     const query = event.query.toLowerCase();
    //     if (query.trim().length === 0) {
    //       setFilteredStates(states);
    //     } else {
    //       const filtered = states.filter((state) => state.name.toLowerCase().startsWith(query));
    //       setFilteredStates(filtered);
    //     }
    //   };

    const loadCounties = async (state: States | null) => {

        GeoAreaService.getCounties(state?state.code:null)
            .then((response: any) => {
                setCounties(response.data);
                setCopyCounties(response.data);
                localStorage.setItem('counties', JSON.stringify(response.data));


            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const setCurrentCounties = async (county: Counties | null) => {
        try {
            setCurrentCountie(county);
            loadCities(county);
            dispatch(setCurrentCountySaveSearch(county));//for re-populate field when back to page
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    //   const filterCounties = (event: any) => {

    //     // Timeout to emulate a network connection
    //     setTimeout(() => {
    //       let _filtered: Counties[];

    //       if (!event.query.trim().length) {
    //         _filtered = copyCounties//[...states];
    //       } else {
    //         _filtered = counties.filter((item) => {
    //           return item.name.toLowerCase().startsWith(event.query.toLowerCase());
    //         });
    //       }

    //       setCounties(_filtered);
    //     }, 250);
    //   };

    const filterCounties = (event: any) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filtered;
            if (!event.query.trim().length) {
                _filtered = [...copyCounties];
            }
            else {

                var list = JSON.parse(localStorage.getItem('counties') || '[]');

                _filtered = list.filter((item: Counties) => {

                    return item.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setCounties(_filtered);
        }, 250);
    }

    // const filterCounties = (event: any) => {
    //     const query = event.query.toLowerCase();
    //     if (query.trim().length === 0) {
    //       setFilteredCounties(counties);
    //     } else {
    //       const filtered = counties.filter((county) => county.name.toLowerCase().startsWith(query));
    //       setFilteredCounties(filtered);
    //     }
    //   };


    const loadCities = async (county: Counties | null) => {

        GeoAreaService.getCities(county?county.code:null)
            .then((response: any) => {
                setCities(response.data);
                setCopyCities(response.data);
                localStorage.setItem('cities', JSON.stringify(response.data));


            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const setCurrentCities = async (city: Cities | null) => {
        try {
            setCurrentCity(city);
            loadZips(city);
            dispatch(setCurrentCitySaveSearch(city));//for re-populate field when back to page

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    //   const filterCities = (event: any) => {

    //     // Timeout to emulate a network connection
    //     setTimeout(() => {
    //       let _filtered: Cities[];

    //       if (!event.query.trim().length) {
    //         _filtered = copyCities//[...states];
    //       } else {
    //         _filtered = cities.filter((item) => {
    //           return item.name.toLowerCase().startsWith(event.query.toLowerCase());
    //         });
    //       }

    //       setCities(_filtered);
    //     }, 250);
    //   };

    const filterCities = (event: any) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filtered;
            if (!event.query.trim().length) {
                _filtered = [...copyCities];
            }
            else {

                var list = JSON.parse(localStorage.getItem('cities') || '[]');

                _filtered = list.filter((item: Cities) => {

                    return item.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setCities(_filtered);
        }, 250);
    }

    // const filterCities = (event: any) => {
    //     const query = event.query.toLowerCase();
    //     if (query.trim().length === 0) {
    //       setFilteredCities(cities);
    //     } else {
    //       const filtered = cities.filter((city) => city.name.toLowerCase().startsWith(query));
    //       setFilteredCities(filtered);
    //     }
    //   };

    const loadZips = async (city: Cities | null) => {

        GeoAreaService.getZips(city?city.code:null)
            .then((response: any) => {
                setZipcodes(response.data);

            })
            .catch((e: Error) => {
                console.log(e);
            });
    };


    const handleClickZip = async (val: Zip[]) => {
        const param = val.map((element) => element.zip);
        // show zips before encoding
        showMessages(`City: ${currentCity ? currentCity.name : ''} | zip [${param.join(', ')}]`);

        // const encodedParam = encodeURIComponent(param.join(','));

        // const zip = await GeoAreaService.getZipByCode(encodedParam);
        // setCurrentZip(zip);
        await GeoAreaService.getZipByCode(param.toString())
            .then((response: any) => {
                setCurrentZip(response.data);
                dispatch(setCurrentZipSaveSearch(response.data));
                dispatch(setSelectedZipCodeSaveSearch(response.data));




            })
            .catch((e: Error) => {
                console.log(e);
            });
    };
    const clearData = () => {

        if (msgs.current) {
            msgs.current.clear();
        }

        setCurrentstate(null);
        setCurrentCountie(null);
        setCurrentCity(null);
        setSelectedZipCode([]);
        setCurrentMonth(3);
        setRefreshKey(prevKey => prevKey + 1); // Change the refresh key to force re-render    
        dispatch(setMarkers([]));
        dispatch(setTransactions([]));
        dispatch(setTotalTransactions(0));
        dispatch(setTotalAgents([]));
        dispatch(setActivityReportClicked(true));

    }

    const completeMethod = () => {
        setListSuggestionsMonth(ListMonthSuggestions);
    };

    const handleChangeMonth = (e: AutoCompleteChangeEvent) => {
        setCurrentMonth(e.value);
    };
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

    const handleClickActivityReport = () => { 

        // setActivityReportClicked(!activityReportClicked);
        dispatch(setActivityReportClicked(!activityReportClicked));
    }

    const displayAreaMap = () => {

        setVisible(true);
    }
    const SwitchMapTable = () => {
        setSwitchbtwMapTable(prevState => !prevState);
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
                {currentZip &&(
                    currentCity && (
                        getMessageHeader(currentCity, currentZip || [])
                    )
                )}
               
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
    const fetchTransactionsdata = async (paramZip: string[],nbrMonth : number,citySelected : string,state : string,county : string) => {

        try {

            console.log(collapsed);
            // if(collapsed){
                togglePanel();
            // }
            
            // onLoadingTransactionsChange(true);
        
            // const response = await GeoAreaService.fetchTransactions(paramZip.join(','),nbrMonth);
        
            // dispatch(setTransactions(response));
            await dispatch(fetchTransactions({ paramZip, nbrMonth }));
            await dispatch(fetchTotalTransactions({paramZip, nbrMonth}));
            await dispatch(fetchTotalAgents({paramZip, nbrMonth}));

            //Re-populate fields
            const city: Cities = { name: citySelected.split(',')[0], code: Number(citySelected.split(',')[1]) };
            // setCurrentCities(city);
            dispatch(setCurrentCitySaveSearch(city));
            const stateObj: States = { name: state.split(',')[1], code: state.split(',')[0] };
            // setCurrentStates(stateObj);
            dispatch(setCurrentstateSaveSearch(stateObj));
            const countyObj: Counties = { name: county.split(',')[1], code: Number(county.split(',')[0]) };
            // setCurrentCounties(countyObj);
            // setCurrentMonth(nbrMonth);
            dispatch(setCurrentCountySaveSearch(countyObj));
            dispatch(setNbrMonthSaveSearch(nbrMonth));
         

           
        // setCurrentZip(zip);
            await GeoAreaService.getZipByCode(paramZip.toString())
            .then((response: any) => {
                // setCurrentZip(response.data);
                // setSelectedZipCode(response.data);
                dispatch(setCurrentZipSaveSearch(response.data));//for re-populate field when back to page
                dispatch(setSelectedZipCodeSaveSearch(response.data));//for re-populate field when back to page

                



            })
            .catch((e: Error) => {
                console.log(e);
            });

            
        
        } catch (e) {
            console.error(e);
        } finally {
            // onLoadingTransactionsChange(false);
            
            if(activityReportClicked){
            dispatch(setActivityReportClicked(!activityReportClicked));
            }
        }
    };

        // useEffect(() => {
        //    console.log(TotalTransactions[0]?.transactions);
        //    console.log(TotalAgents[0]?.agents);


        // }, [TotalTransactions,TotalAgents]);

    function getMessageHeader(city: Cities,zips : Zip[]){
        const param = zips.map((element) => element.zip);

           return(

            <div className="flex align-items-center gap-3">
                <strong>
            {`City: ${city ? city.name : ''} | zip [${param.join(', ')}]`}
            </strong>
            <div>
            <strong>
                {currentMonth+' - Month'}
                </strong>

            </div>
         </div>

           );
        };
    useEffect(() => {
        setCurrentCities(currentCitySaveSearch);
        setCurrentZip(currentZipSaveSearch);
        setSelectedZipCode(selectedZipCodeSaveSearch);
        setCurrentStates(currentstateSaveSearch);
        setCurrentCounties(currentCountySaveSearch);
        setCurrentMonth(nbrMonthSaveSearch);
        

        

    }, [currentCitySaveSearch,currentZipSaveSearch,currentstateSaveSearch,
        currentCountySaveSearch ,
        selectedZipCodeSaveSearch,
        nbrMonthSaveSearch]);
    


    return (
        <MapProvider>


            <Panel header="Choose Area" headerTemplate={headerPane1} ref={panelRef} toggleable>
                <div className="grid nested-grid" key={refreshKey}>
                    <div className="col-8">
                        <div className="grid">
                            <div className="col-6 md:col-4 lg:col-4">
                                <span className="p-float-label">
                                    <AutoComplete inputId="autocompletstate" field="name" value={Currentstate} suggestions={states} completeMethod={filterStates} onChange={(e) => { setCurrentStates(e.value) }} dropdown />
                                    <label htmlFor="autocompletstate">Choose State</label>

                                </span>
                            </div>

                            <div className="col-6 md:col-4 col-4">
                                <span className="p-float-label">
                                    <AutoComplete inputId="autocompletcounty" field="name" value={CurrentCountie} suggestions={counties} completeMethod={filterCounties} onChange={(e) => { setCurrentCounties(e.value) }} dropdown />
                                    <label htmlFor="autocompletcounty">Choose County</label>
                                </span>
                            </div>

                            <div className="col-6 md:col-4 col-4">
                                <span className="p-float-label">
                                    <AutoComplete inputId="autocompletcity" field="name" value={currentCity} suggestions={cities} completeMethod={filterCities} onChange={(e) => { setCurrentCities(e.value) }} dropdown />
                                    <label htmlFor="autocompletcity">Choose City</label>
                                </span>
                            </div>

                            <div className="col-6 md:col-6 col-4 mt-auto">
                                <span className="p-float-label">
                                    <MultiSelect inputId="multiselect" value={selectedZipCode} options={zipcodes} onChange={(e) => { setSelectedZipCode(e.value); handleClickZip(e.value) }} optionLabel="zip" className="w-full md:w-20rem" />
                                    <label htmlFor="multiselect">Zip Codes</label>

                                </span>

                            </div>

                            <div className="col-12 md:col-6 col-6">

                                <div className="flex flex-wrap gap-2">
                                    <div className="flex align-items-center">
                                        <span>Number of month</span>
                                    </div>
                                    <div className="flex align-items-center">
                                        <RadioButton inputId="3" name="3" value={3} onChange={(e: RadioButtonChangeEvent) => setCurrentMonth(e.value)} checked={currentMonth === 3} />
                                        <label htmlFor="3" className="ml-2">3</label>
                                    </div>
                                    <div className="flex align-items-center">
                                        <RadioButton inputId="6" name="6" value={6} onChange={(e: RadioButtonChangeEvent) => setCurrentMonth(e.value)} checked={currentMonth === 6} />
                                        <label htmlFor="6" className="ml-2">6</label>
                                    </div>
                                    <div className="flex align-items-center">
                                        <RadioButton inputId="9" name="9" value={9} onChange={(e: RadioButtonChangeEvent) => setCurrentMonth(e.value)} checked={currentMonth === 9} />
                                        <label htmlFor="9" className="ml-2">9</label>
                                    </div>
                                    <div className="flex align-items-center">
                                        <RadioButton inputId="12" name="12" value={12} onChange={(e: RadioButtonChangeEvent) => setCurrentMonth(e.value)} checked={currentMonth === 12} />
                                        <label htmlFor="12" className="ml-2">12</label>
                                    </div>

                                </div>

                            </div>
                     
                            
                        </div>
                        <div className="d-flex justify-content-end ">
                                <div>
                                <span role="button" onClick={togglePanel}>
                                    <ZoomButton 
                                        zoom={15} 
                                        zips={currentZip ? currentZip : []} 
                                        city={currentCity ? currentCity : null} 
                                        Currentstate={Currentstate}
                                        CurrentCounty={CurrentCountie} 
                                        nbrMonth={currentMonth ? currentMonth : 12}
                                        saveSearchHistory={saveSearchHistory}  
                                    />
                                </span>
                                <ClearButton clearData={clearData} />
                                </div>
                            </div>
                    </div>
                    <div className="col-12 md:col-4">
                    <SearchHistory
                    title="Area History"
                    isLoading={isLoadingSavedSearch}
                    searchHistory={searchHistory}
                    onSearchClick={(search) => fetchTransactionsdata([search.zips], Number(search.nbrMonth), search.city, search.state, search.county)}
                    onToggleFavorite={toggleFavorite}
                    parent="Area"
                    />


                    </div>
                </div>

                <Divider />
                {/* <Messages ref={msgs} /> */}


            </Panel>
            <div className="row mt-1">
                <div className="col-md-12 col-sm-6">
                    <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the agent’s total monthly production for the most recently completed 12 months, compared to the same 12-month period a year ago. It does not include the current “partial” month’s production. The values include listing and co-listing transactions. Plus, sales outside of the MLS, if we have that data.">
                        <i className="bi bi-info-circle fs-6" /></a> Area Activity: Transactions in these zip codes</h5>
                    <div className={`card ${!activityReportClicked ? '' : 'collapsed-card'}`}>
                        <div className="card-header">
                            <div className="row">
                                <div className="col-sm-3 border-right">
                                    <div className="description-block">
                                        <h5 className="">{TotalTransactions}</h5>
                                        <span className="">Transactions</span>
                                    </div>
                                    {/* /.description-block */}
                                </div>
                                <div className="col-sm-3 border-right">
                                    <div className="description-block">
                                        <h5 className="">{TotalAgents[0] ? TotalAgents[0]?.agents : '0' }</h5>
                                        <span className="">Agents</span>
                                    </div>
                                    {/* /.description-block */}
                                </div>
                                <div className="col-sm-3">
                                    <div className="description-block">
                                        {isLoadingTransactions && (<div className="col-12 mb-5"><BeatLoader className="loading-container mt-3" size={25} color="#36d7b7" /></div>)

                                        }
                                    </div>
                                    {/* /.description-block */}
                                </div>
                                <div className="col-sm-1">


                                </div>

                                <div className="col-sm-2 text-right">
                                    <button id="idDisplayChart" type="button" className="btn btn-tool " onClick={handleClickActivityReport}>

                                        {!activityReportClicked ? <strong>Close</strong> : <strong>Open</strong>}

                                        {/* <i id="idDisplayChart" className="fas fa-plus" /> */}
                                    </button>
                                </div>
                            </div>
                            {/* /.card-tools */}
                        </div>
                        {/* /.card-header */}
                        <div className={`card-body pb-0 pt-0 pr-0 pl-0 ${!activityReportClicked ? '' : 'd-none'}`}>
                            <span role="button"  ><DisplayTableTransactionsBtn zoom={13} zips={currentZip ? currentZip : []} city={currentCity ? currentCity : null} nbrMonth={currentMonth ? currentMonth : 12} SwitchMapTable={SwitchMapTable} switchbtwMapTable={switchbtwMapTable} /></span>
                            {!switchbtwMapTable && <div className="row  pb-0 pt-0 pr-0 pl-0">
                                {!activityReportClicked && <CremsTable displayAreaMap={displayAreaMap} nbrMonth={currentMonth ? currentMonth : 12} ></CremsTable>}
                                <div className=" justify-content-center">

                                    <Dialog header="Map Area" visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                                        <div>
                                            {!areaReportClicked && <CremsMap />}

                                        </div>
                                    </Dialog>
                                    {/* <div className={`modal fade ${areaReportClicked ? 'show' : ''}`} tabIndex={-1} role="dialog" style={{ display: areaReportClicked ? 'block' : 'none' }}>
                                    <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Circle of Influence (COI): Team Investigator</h5>
                                                <button type="button" className="close" onClick={areaReportRendred}>
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                            <CremsMap center={currentZip ? [parseFloat(currentZip[0].lat), parseFloat(currentZip[0].lng)] : [36.7783, -119.4179]} zoom={15} />
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={areaReportRendred}>Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                </div>

                            </div>}

                            {switchbtwMapTable && <div className="row  pb-0 pt-0 pr-0 pl-0">
                                <div className=" justify-content-center">
                                    <CremsMap />
                                </div>

                            </div>}

                        </div>
                        {/* /.card-body */}

                    </div>
                    {/* /.card */}



                </div>

            </div>






        </MapProvider>

    );
};

export default SearchByArea;
