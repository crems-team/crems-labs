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
import SearchItemArea from "../Models/SearchItemArea";
import { useKeycloak } from "@react-keycloak/web";
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { toast } from 'react-toastify';
import { Dialog } from 'primereact/dialog';
import DisplayTableTransactionsBtn from '../Components/DisplayTableTransactionsBtn';
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";


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
    const [CurrentCountie, setCurrentCountie] = useState<Counties | null>();
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

    const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);

    const handleLoadingTransactions = (newBoolean: boolean) => {
        setIsLoadingTransactions(newBoolean);
    };

    const [refreshKey, setRefreshKey] = useState(0);
    const ListMonthSuggestions: MonthSuggestion[] = [
        { value: 12, key: 4 },
        { value: 9, key: 3 },
        { value: 6, key: 2 },
        { value: 3, key: 1 }
    ];
    const [currentMonth, setCurrentMonth] = useState<number>(3);
    const [listSuggestionsMonth, setListSuggestionsMonth] = useState<MonthSuggestion[]>([]);




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
    const [activityReportClicked, setActivityReportClicked] = useState(true);
    const [areaReportClicked, setareaReportClicked] = useState(false);
    const ref = useRef<Panel>(null);
    const [visible, setVisible] = useState(false);
    const [switchbtwMapTable, setSwitchbtwMapTable] = useState(false);

    const areaReportRendred = () => {
        setareaReportClicked(prevState => !prevState);
    };












    useEffect(() => {
        // Fetch autocomplete suggestions from API based on inputValue
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

    }, []);

    const setCurrentStates = async (state: States) => {
        try {
            //const result = await geoservice.fetchState(state.code);
            console.log(state);
            setCurrentstate(state);
            loadCounties(state)
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

    const loadCounties = async (state: States) => {

        GeoAreaService.getCounties(state.code)
            .then((response: any) => {
                setCounties(response.data);
                setCopyCounties(response.data);
                localStorage.setItem('counties', JSON.stringify(response.data));


            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const setCurrentCounties = async (county: Counties) => {
        try {
            setCurrentCountie(county);
            loadCities(county);
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


    const loadCities = async (county: Counties) => {

        GeoAreaService.getCities(county.code)
            .then((response: any) => {
                setCities(response.data);
                setCopyCities(response.data);
                localStorage.setItem('cities', JSON.stringify(response.data));


            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const setCurrentCities = async (city: Cities) => {
        try {
            setCurrentCity(city);
            loadZips(city);
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

    const loadZips = async (city: Cities) => {

        GeoAreaService.getZips(city.code)
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
        setCurrentMonth(1);
        setRefreshKey(prevKey => prevKey + 1); // Change the refresh key to force re-render    
    }

    const completeMethod = () => {
        setListSuggestionsMonth(ListMonthSuggestions);
    };

    const handleChangeMonth = (e: AutoCompleteChangeEvent) => {
        setCurrentMonth(e.value);
    };
    //Save search and favorite
    const saveSearchHistory = async (savedType: string, city: string, zips: string) => {
        if (keycloak.tokenParsed?.sub) {
            const userId = keycloak.tokenParsed.sub;
            let history = JSON.parse(localStorage.getItem(userId + '-area') || '[]');
            const newSearch = { savedType, city, zips, isFavorite: true };
            if (!history.some((item: SearchItemArea) => item.city === city && item.zips === zips)) {
                if (history.length >= 10) {
                    //history = history.slice(1);
                    history.pop();

                }
                //history.push(newSearch);
                history.unshift(newSearch);

                localStorage.setItem(userId + '-area', JSON.stringify(history));
                setSearchHistory(history);
                try {
                    await GeoAreaService.saveSearchHistory(userId, savedType, city, zips);
                } catch (error) {
                    console.error('Error saving search history:', error);
                }
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
                await GeoAreaService.toggleFavorite(userId, search.city, search.zips, updatedSearch.isFavorite);
                setSearchHistory(prevHistory =>
                    prevHistory.map(item =>
                        item.city === search.city && item.zips === search.zips ? { ...item, isFavorite: !item.isFavorite } : item
                    )
                );
                localStorage.setItem(userId + '-area', JSON.stringify(searchHistory));
                if (updatedSearch.isFavorite === false) {
                    toast.success(updatedSearch.city + ' is saved in your favorite list');
                } else {
                    toast.success(updatedSearch.city + ' is deleted from your favorite list');

                }
            } catch (error) {
                console.error('Error toggling favorite:', error);
            }
        }
    };

    const handleClickActivityReport = () => {

        setActivityReportClicked(!activityReportClicked);
    }

    const displayAreaMap = () => {

        setVisible(true);
    }
    const SwitchMapTable = () => {
        console.log('switch');
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
                <div className='grid'>

                    <div className='col'>
                        {options.togglerElement}
                    </div>

                </div>
            </div>
        );
    };



    return (
        <MapProvider>


            <Panel header="Choose Area" headerTemplate={headerPane1} toggleable>
                <div className="grid nested-grid" key={refreshKey}>


                    <div className="col-8">
                        <div className="grid">
                            <div className="col-6 md:col-6 lg:col-4">
                                <span className="p-float-label">
                                    <AutoComplete inputId="autocompletstate" field="name" value={Currentstate} suggestions={states} completeMethod={filterStates} onChange={(e) => { setCurrentStates(e.value) }} dropdown />
                                    <label htmlFor="autocompletstate">Choose State</label>

                                </span>
                            </div>

                            <div className="col-6 md:col-6 col-4">
                                <span className="p-float-label">
                                    <AutoComplete inputId="autocompletcounty" field="name" value={CurrentCountie} suggestions={counties} completeMethod={filterCounties} onChange={(e) => { setCurrentCounties(e.value) }} dropdown />
                                    <label htmlFor="autocompletcounty">Choose County</label>
                                </span>
                            </div>

                            <div className="col-6 md:col-6 col-4">
                                <span className="p-float-label">
                                    <AutoComplete inputId="autocompletcity" field="name" value={currentCity} suggestions={cities} completeMethod={filterCities} onChange={(e) => { setCurrentCities(e.value) }} dropdown />
                                    <label htmlFor="autocompletcity">Choose City</label>
                                </span>
                            </div>

                            <div className="col-6 md:col-6 col-4">
                                <span className="p-float-label">
                                    <MultiSelect inputId="multiselect" value={selectedZipCode} options={zipcodes} onChange={(e) => { setSelectedZipCode(e.value); handleClickZip(e.value) }} optionLabel="zip" className="w-full md:w-20rem" />
                                    <label htmlFor="multiselect">Zip Codes</label>

                                </span>

                            </div>

                            <div className="col-12 md:col-12 col-6">

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
                            <div className="col-fixed">
                                <span role="button" onClick={(event) => ref.current?.toggle(event)}><ZoomButton zoom={15} zips={currentZip ? currentZip : []} city={currentCity ? currentCity : null} isLoadingTransactions={isLoadingTransactions} onLoadingTransactionsChange={handleLoadingTransactions} nbrMonth={currentMonth ? currentMonth : 12}
                                    saveSearchHistory={saveSearchHistory} handleClickActivityReport={handleClickActivityReport} /></span>
                                <ClearButton clearData={clearData} />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 md:col-4">
                        <div className="card" >
                            <div className="card-header bg-primary text-white">
                                <span className="page-title">Area History</span>
                                <span className="subtitle" style={{ fontSize: '12px' }}>
                                    Click the <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-square" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                    </svg> icon to save. Click the <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square-fill" viewBox="0 0 16 16">
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"></path>
                                    </svg> icon to unsave.
                                </span>

                            </div>
                            <div className="card-body cardRecentSearch">
                                {isLoadingSavedSearch ? (<div  >
                                    <ul className="" style={{ listStyleType: 'none' }}>

                                        <li>
                                            <BeatLoader className="loading-container mt-3" size={10} color="#36d7b7" />
                                        </li>

                                    </ul>
                                </div>
                                ) :
                                    searchHistory.length > 0 ? (
                                        <ul className="list-group">
                                            {searchHistory.map((search, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center" >
                                                    <span role="button" >
                                                        {"City: "}{search.city}{" | zip "}{"[" + search.zips + "]"}
                                                    </span>
                                                    <Checkbox onChange={(event) => toggleFavorite(search, event)} checked={!search.isFavorite}></Checkbox>
                                                    {/* <button
                        className={`btn ${search.isFavorite ? 'btn-primary' : 'btn-danger'}`}
                        onClick={(event) => toggleFavorite(search,event)}
                        > */}
                                                    {/* <FontAwesomeIcon icon={search.isFavorite ?  faStarHalfAlt:  faStar} /> */}
                                                    {/* <FontAwesomeIcon icon={search.isFavorite ? faSave : faTrashAlt } /> */}

                                                    {/* </button> */}
                                                </li>
                                            ))}
                                        </ul>
                                    ) :
                                        <ul className="list-group">
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                No recent searches.

                                            </li>
                                        </ul>


                                }

                            </div>
                        </div>

                    </div>
                </div>

                <Divider />
                <Messages ref={msgs} />


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
                                        <h5 className="">0</h5>
                                        <span className="">Transactions</span>
                                    </div>
                                    {/* /.description-block */}
                                </div>
                                <div className="col-sm-3 border-right">
                                    <div className="description-block">
                                        <h5 className="">0</h5>
                                        <span className="">Agents</span>
                                    </div>
                                    {/* /.description-block */}
                                </div>
                                <div className="col-sm-3">
                                    <div className="description-block">
                                        {isLoadingTransactions && (<div className="col-12 mb-5"><BeatLoader className="loading-container" size={10} color="#36d7b7" /></div>)

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
