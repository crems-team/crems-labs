import React, { useState, useEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { BeatLoader } from 'react-spinners';
import { debounce } from 'lodash';
import SearchToolsService from "../../Services/Tools/SearchToolsService";
import CallListingsAPIService from "../../Services/Tools/CallListingsAPIService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { format } from "date-fns";
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import { Sidebar } from 'primereact/sidebar';
import { useKeycloak } from "@react-keycloak/web";
import SearchItemHistory from "../../Models/SearchItemHistory";
import { resetMapState} from '../../Redux/Slices/MapSlice'
import SearchHistory from '../../Components/SearchHistory';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { useAppDispatch } from '../../Hooks/DispatchHook';
import {handleSearchSource,setSearchSourceResult } from '../../Redux/Slices/MapSlice'
import { Panel, PanelHeaderTemplateOptions } from 'primereact/panel';
import { Avatar } from 'primereact/avatar';











interface AutocompleteItem {
    value: number;
    label: string;
}


function SearchApiListing() {
    
    const [progress, setProgress] = useState(0);
    //AgentID
    const [agentId, setAgentId] = useState('');
    const [isOpenSugAId, setIsOpenSugAId] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestionsAgentId, setSuggestionsAgentId] = useState<AutocompleteItem[]>([]);

    const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);

    //OfficeName
    const [officeName, setOfficeName] = useState('');
    const [isOpenSugOfnm, setIsOpenSugOfnm] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [suggestionsOfficeNm, setSuggestionsOfficeNm] = useState<AutocompleteItem[]>([]);

    //Address
    const [address, setAddress] = useState('');
    const [isOpenSugAdr, setIsOpenSugAdr] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [suggestionsAddress, setSuggestionsAddress] = useState<AutocompleteItem[]>([]);

    //City
    const [city, setCity] = useState('');
    const [isOpenSugCity, setIsOpenSugCity] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [suggestionsCity, setSuggestionsCity] = useState<AutocompleteItem[]>([]);

    //API fields
    const [mlsSid, setMlsSid] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [recLimit, setRecLimit] = useState('');


    const [searchResult, setSearchResult] = useState<any[]>([]);
    const [isLoadingSearch, setIsLoadingSearch] = useState(Boolean);
    const dt = useRef<DataTable<any>>(null);
    const [visibleRight, setVisibleRight] = useState(false);
    const { keycloak, initialized } = useKeycloak();
    const [searchHistory, setSearchHistory] = useState<Array<SearchItemHistory>>([]);
    const dispatch = useAppDispatch();
    const [isLoadingSavedSearch, setIsLoadingSavedSearch] = useState(Boolean);
    const navigate = useNavigate();
    const loadingSearchSourceResult = useSelector((state: RootState) => state.map.loadingSearchSourceResult);
    const searchSourceResult = useSelector((state: RootState) => state.map.searchSourceResult);
    const panelRefApi = useRef<Panel>(null);
    const [collapsedApi, setCollapsedApi] = useState(Boolean);
    const panelRefDb = useRef<Panel>(null);
    const [collapsedDb, setCollapsedDb] = useState(Boolean);
    const [isLoadingCalListApi, setIsLoadingCalListApi] = useState(false);


    //Agent Id
    const debouncedFetchSuggestionsAID = debounce(async () => {
        if (agentId.length >= 1 && !isSuggestionClicked) {
          setIsLoading(true);


          await SearchToolsService.getAgentIdAutoComplete({agentId : agentId})
            .then((response: any) => {

                setSuggestionsAgentId(response.data);
                setIsLoading(false);

            })
            .catch((e: Error) => {
                console.log(e);
                setIsLoading(false);

            })
        } else {
          setSuggestionsAgentId([]);
        }
    }, 1000);
  
    // useEffect(() => {
    // // Call the debounced function instead of fetchSuggestions directly
    // if (agentId.trim() !== '') {
    //     debouncedFetchSuggestionsAID();
    // } else {
    //     setSuggestionsAgentId([]);
    //     setIsSuggestionClicked(false);
    // }

    // // Cleanup function to cancel debounce on component unmount
    // return () => {
    //     debouncedFetchSuggestionsAID.cancel();
    // };
    // }, [agentId]);

    const handleInputChangeAgentId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgentId(e.target.value);
        // setIsOpenSugAId(e.target.value.length >= 1);
        // setIsSuggestionClicked(false);
    };

    const handleSuggestionClickAgentId = (suggestion: AutocompleteItem) => {
        setAgentId(suggestion.label);
        setSuggestionsAgentId([]);
        setIsOpenSugAId(false);
        setIsSuggestionClicked(true);
    };

    //OfficeName
    const debouncedFetchSuggestionsOfficeNm = debounce(async () => {
        if (officeName.length >= 1 && !isSuggestionClicked ) {
          setIsLoading(true);


          await CallListingsAPIService.getAutoCompleteOffice({office : officeName})
            .then((response: any) => {

                setSuggestionsOfficeNm(response.data);
                setIsLoading(false);

            })
            .catch((e: Error) => {
                console.log(e);
                setIsLoading(false);

            })
        } else {
          setSuggestionsOfficeNm([]);
        }
    }, 1000);
  
    useEffect(() => {
    // Call the debounced function instead of fetchSuggestions directly
    if (officeName.trim() !== '') {
        debouncedFetchSuggestionsOfficeNm();
    } else {
        setSuggestionsOfficeNm([]);
        setIsSuggestionClicked(false);
    }

    // Cleanup function to cancel debounce on component unmount
    return () => {
        debouncedFetchSuggestionsOfficeNm.cancel();
    };
    }, [officeName]);

    const handleInputChangeOffice = (e: React.ChangeEvent<HTMLInputElement>) => {

        // if(agentId === '' || agentId === null){
        //     toast.warn('The Agent ID is required and cannot be empty');
        //     return null;
        // }
        setOfficeName(e.target.value);
        setIsOpenSugOfnm(e.target.value.length >= 1);
        setIsSuggestionClicked(false);
    };

    const handleSuggestionClickOffice = (suggestion: AutocompleteItem) => {
        setOfficeName(suggestion.label);
        setSuggestionsOfficeNm([]);
        setIsOpenSugOfnm(false);
        setIsSuggestionClicked(true);
    };

    //Address
    const debouncedFetchSuggestionsAddress = debounce(async () => {
        if (address.length >= 1 && !isSuggestionClicked) {
          setIsLoading(true);


          await CallListingsAPIService.getAutoCompleteAddress({address : address})
            .then((response: any) => {

                setSuggestionsAddress(response.data);
                setIsLoading(false);

            })
            .catch((e: Error) => {
                console.log(e);
                setIsLoading(false);

            })
        } else {
          setSuggestionsAddress([]);
        }
    }, 1000);
  
    useEffect(() => {
    // Call the debounced function instead of fetchSuggestions directly
    if (address.trim() !== '') {
        debouncedFetchSuggestionsAddress();
    } else {
        setSuggestionsAddress([]);
        setIsSuggestionClicked(false);
    }

    // Cleanup function to cancel debounce on component unmount
    return () => {
        debouncedFetchSuggestionsAddress.cancel();
    };
    }, [address]);

    const handleInputChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        // if(agentId === '' || agentId === null){
        //     toast.warn('The Agent ID is required and cannot be empty');
        //     return null;
        // }
        setAddress(e.target.value);
        setIsOpenSugAdr(e.target.value.length >= 1);
        setIsSuggestionClicked(false);
    };

    const handleSuggestionClickAddress = (suggestion: AutocompleteItem) => {
        setAddress(suggestion.label);
        setSuggestionsAddress([]);
        setIsOpenSugAdr(false);
        setIsSuggestionClicked(true);
    };

    //City
    const debouncedFetchSuggestionsCity = debounce(async () => {
        if (city.length >= 1 && !isSuggestionClicked) {
          setIsLoading(true);


          await CallListingsAPIService.getAutoCompleteCity({city : city})
            .then((response: any) => {

                setSuggestionsCity(response.data);
                setIsLoading(false);

            })
            .catch((e: Error) => {
                console.log(e);
                setIsLoading(false);

            })
        } else {
          setSuggestionsCity([]);
        }
    }, 1000);
  
    useEffect(() => {
    // Call the debounced function instead of fetchSuggestions directly
    if (city.trim() !== '') {
        debouncedFetchSuggestionsCity();
    } else {
        setSuggestionsCity([]);
        setIsSuggestionClicked(false);
    }

    // Cleanup function to cancel debounce on component unmount
    return () => {
        debouncedFetchSuggestionsCity.cancel();
    };
    }, [city]);

    const handleInputChangeCity = (e: React.ChangeEvent<HTMLInputElement>) => {
        // if(agentId === '' || agentId === null){
        //     toast.warn('The Agent ID is required and cannot be empty');
        //     return null;
        // }
        setCity(e.target.value);
        setIsOpenSugCity(e.target.value.length >= 1);
        setIsSuggestionClicked(false);
    };

    const handleSuggestionClickCity = (suggestion: AutocompleteItem) => {
        setCity(suggestion.label);
        setSuggestionsCity([]);
        setIsOpenSugCity(false);
        setIsSuggestionClicked(true);
    };

    const handleSearch = async(office : string, address : string, city : string) => {
        // if(agentId === null || agentId === ''){

        //     toast.warn('The Agent ID is required and cannot be empty');
        //     return null;

        // }
        setIsLoadingSearch(true);

          var data = {
            agentId : agentId ? agentId : null,
            office  : office ? office : null,
            address : address? address : null,
            city    : city ? city : null
            };
      
            await CallListingsAPIService.getSearchData(data)
            .then((response: any) => {
              setSearchResult(response.data);
            //   saveSearchHistory("searchSource",agentId, office, address, city);
              setIsLoadingSearch(false);
            })
            .catch((e: Error) => {
                setIsLoadingSearch(false);
      
              console.log(e);
            });        
            // await dispatch(handleSearchSource({agentId , office, address , city}));
            // saveSearchHistory("searchSource",agentId, office, address, city);

 
            
        };
        const handleSearchFromHist = async(agentId : string, office : string, address : string, city : string) => {
  
          
            await dispatch(handleSearchSource({agentId , office, address , city}));
            setVisibleRight(false);
    
            
        };

        const formatDate = (dateString : any) => {
            if (!dateString) return "";
            return format(new Date(dateString), "yyyy-MM-dd"); // Formats to YYYY-MM-DD
        };

        const formatPrice = (price: any) => {
            if (!price || isNaN(price)) return "";  
            return `$ ${Number(price).toLocaleString("en-US")}`;
        };

        const exportFullDataAsCSV = () => {
            // Define the CSV header
            const headers = [
                "mlsSid",
                "listAgentId",
                "listAgentFirstName",
                "listAgentLastName",
                "listAgentPhone1",
                "coListAgentId",
                "coListAgentFirstName",
                "coListAgentLastName",
                "coListAgentPhone1",
                "sellAgentId",
                "sellAgentFirstName",
                "sellAgentLastName",
                "sellAgentPhone1",
                "coSellAgentId",
                "coSellAgentFirstName",
                "coSellAgentLastName",
                "coSellAgentPhone1",
                "dom",
                "city",
                "dateList",
                "listPrice",
                "state",
                "address",
                "addressUnit",
                "bank",
                "statusCode",
                "dateStatusChange",
                "zipCode",
                "listingId",
                "listOfficeId",
                "listOfficeName",
                "listOfficeStreetName1",
                "listOfficeCit",
                "listOfficeZip",
                "listOfficeState",
                "sellOfficeId",
                "sellOfficeName",
                "sellOfficeStreetName1",
                "sellOfficeCity",
                "sellOfficeZip",
                "sellOfficeState",
            ];
            console.log(headers);
        
            // Convert data to CSV format
            const rows = searchResult.map((row) =>
              [
                row.mlsSid,
                row.listAgentId,
                row.listAgentFirstName,
                row.listAgentLastName,
                row.listAgentPhone1,
                row.coListAgentId,
                row.coListAgentFirstName,
                row.coListAgentLastName,
                row.coListAgentPhone1,
                row.sellAgentId,
                row.sellAgentFirstName,
                row.sellAgentLastName,
                row.sellAgentPhone1,
                row.coSellAgentId,
                row.coSellAgentFirstName,
                row.coSellAgentLastName,
                row.coSellAgentPhone1,
                row.dom,
                row.city,
                row.dateList,
                row.listPrice,
                row.state,
                row.address,
                row.addressUnit,
                row.bank,
                row.statusCode,
                row.dateStatusChange,
                row.zipCode,
                row.listingId,
                row.listOfficeId,
                row.listOfficeName,
                row.listOfficeStreetName1,
                row.listOfficeCit,
                row.listOfficeZip,
                row.listOfficeState,
                row.sellOfficeId,
                row.sellOfficeName,
                row.sellOfficeStreetName1,
                row.sellOfficeCity,
                row.sellOfficeZip,
                row.sellOfficeState,
              ].join(";")
            );
        
            // Combine header and rows
            const csvContent = [headers.join(";"), ...rows].join("\n");
        
            // Create a Blob and download the file
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
        
            link.href = url;
            link.setAttribute("download", "listing_historical.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };

    const handleClear = () =>{
    setSearchResult([]);
    setAgentId('');
    setOfficeName('');
    setAddress('');
    setCity('');


    }
    const handleClearAPI = () =>{
        setMlsSid('');
        setFromDate('');
        setToDate('');
        setRecLimit


    }
    const saveSearchHistory = async (savedType :string, agentId: string, officeName: string, address: string, city: string) => {
        if (keycloak.tokenParsed?.sub) {
          const userId = keycloak.tokenParsed.sub;
          let history = JSON.parse(localStorage.getItem(userId+'-searchSource') || '[]');
          console.log(history);
          const newSearch = {savedType, agentId,officeName, address, city, isFavorite: true };
          if (!history.some((item :SearchItemHistory)=> item.agentId === agentId && item.officeName === officeName && item.address === address && item.city === city)) {
            if (history.length >= 10) {
              //history = history.slice(1);
              history.pop();
      
            }
            //history.push(newSearch);
            history.unshift(newSearch);          
  
            localStorage.setItem(userId+'-searchSource', JSON.stringify(history));
            setSearchHistory(history);
            try { 
              await SearchToolsService.saveSearchHistory(userId, savedType, agentId, officeName, address, city );
                    SearchToolsService.getSavedSearches(userId, "searchSource")
                            .then((response: any) => {
                                setSearchHistory(response.data);
                                localStorage.setItem(userId+'-searchSource', JSON.stringify(response.data));
                        
                        
                            })
                            .catch((e: Error) => {
                                console.log(e);

                            });
            } catch (error) {
              console.error('Error saving search history:', error);
            }
          }
        }
      };

    const fetchSavedSearches =  async() => {
    if (keycloak.tokenParsed?.sub) {
        setIsLoadingSavedSearch(true);
        const userId = keycloak.tokenParsed.sub;
    
        await SearchToolsService.getSavedSearches(userId, "searchSource")
        .then((response: any) => {
            
            /*  const history = response.data;
            console.log(history);
            localStorage.setItem(userId, JSON.stringify(history));
            setSearchHistory(history); */ 
            
            setSearchHistory(response.data);
            console.log(response.data);
            localStorage.setItem(userId+'-searchSource', JSON.stringify(response.data));
            setIsLoadingSavedSearch(false);
    
    
        })
        .catch((e: Error) => {
            console.log(e);
            setIsLoadingSavedSearch(false);

        });
    
    
        
    }
    };

    // useEffect(() => {
        
       
    //     if (keycloak.tokenParsed?.sub) {
    //         setProgress(0);
    //         dispatch(resetMapState());
    //         fetchSavedSearches();          
    //         setProgress(100);
    //     }
    // }, [keycloak.tokenParsed?.sub]);

    const toggleFavorite = async (search : SearchItemHistory,event: CheckboxChangeEvent) => {
        event.preventDefault();
      
        if (keycloak.tokenParsed?.sub) {
          const userId = keycloak.tokenParsed.sub;
          const updatedSearch = { ...search, isFavorite: !search.isFavorite };
          console.log(updatedSearch);
          try {
            await SearchToolsService.toggleFavorite(userId, search.idHistory, updatedSearch.isFavorite);
            setSearchHistory(prevHistory =>
              prevHistory.map(item =>
                item.idHistory === search.idHistory ? { ...item, isFavorite: !item.isFavorite } : item
              )
            );
      
            localStorage.setItem(userId+'-searchSource', JSON.stringify(searchHistory));
            if(updatedSearch.isFavorite === false){
              toast.success(updatedSearch.agentId +' is saved in your favorite list');
            }else{
              toast.success(updatedSearch.agentId +' is deleted from your favorite list');
      
            }
      
          } catch (error) {
            console.error('Error toggling favorite:', error);
          }
        }
    };
    const togglePanelApi = () => {
        panelRefApi.current?.toggle(undefined);
        setCollapsedApi(!collapsedApi); // Call toggle with undefined
      };
     const headerPanelAPI = (options: PanelHeaderTemplateOptions) => {
            const className = `${options.className} justify-content-space-between`;
    
    
            return (
    
                <div className={className}>
    
                    <div className="flex align-items-center gap-3">
                        <Avatar icon="pi pi-search" size="large" shape="circle" className="mr-1" />
                        <span className="mr-1"><strong>Call Terradatum API</strong></span>                       
                    </div>
                   
                    {/* <div className='grid'>
    
                        <div className='col'>
                            
                            {options.collapsed ? (
                            <button type="button" className="btn btn-tool " onClick={togglePanelApi}>
                                <strong>Open</strong>
                            </button>
                        ) : (
                            <button type="button" className="btn btn-tool " onClick={togglePanelApi}>
                                <strong>Close</strong>
                            </button>
                        )}
                        </div>
    
                    </div> */}
                </div>
            );
        };

        const togglePanelDb = () => {
            panelRefDb.current?.toggle(undefined);
            setCollapsedDb(!collapsedDb); // Call toggle with undefined
          };
         const headerPanelDb = (options: PanelHeaderTemplateOptions) => {
                const className = `${options.className} justify-content-space-between`;
        
        
                return (
        
                    <div className={className}>
        
                        <div className="flex align-items-center gap-3">
                            <Avatar icon="pi pi-search" size="large" shape="circle" className="mr-1" />
                            <span className="mr-1"><strong>Search Listings</strong></span>                       
                        </div>
                       
                        <div className='grid'>
        
                            <div className='col'>
                                
                                {options.collapsed ? (
                                <button type="button" className="btn btn-tool " onClick={togglePanelDb}>
                                    <strong>Open</strong>
                                </button>
                            ) : (
                                <button type="button" className="btn btn-tool " onClick={togglePanelDb}>
                                    <strong>Close</strong>
                                </button>
                            )}
                            {/* {options.togglerElement} */}
                            </div>
        
                        </div>
                    </div>
                );
            };
    const formatDateToMMDDYYYY = (dateString: string): string => {
        if (!dateString) return '';

        const [year, month, day] = dateString.split('-');

        return `${month}-${day}-${year}`;
    };

    const formatDateToYYYYMMDD = (dateString: string): string => {
        if (!dateString) return '';

        const [month, day, year] = dateString.split('-');

        return `${year}-${month}-${day}`;
    };
    const handleInputChangeMlsSid = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMlsSid(e.target.value);
        // setIsOpenSugAId(e.target.value.length >= 1);
        // setIsSuggestionClicked(false);
    };
    const handleInputChangeFromDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setIsOpenSugAId(e.target.value.length >= 1);
        // setIsSuggestionClicked(false);
        const dateValue = e.target.value;

        // Convert the date to "MM-dd-yyyy" format
        const formattedDate = formatDateToMMDDYYYY(dateValue);

        setFromDate(formattedDate); 
    };
    const handleInputChangeToDate= (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = e.target.value;

        // Convert the date to "MM-dd-yyyy" format
        const formattedDate = formatDateToMMDDYYYY(dateValue);

        setToDate(formattedDate); 
        // setIsOpenSugAId(e.target.value.length >= 1);
        // setIsSuggestionClicked(false);
    };
    const handleInputChangeRecLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecLimit(e.target.value);
        // setIsOpenSugAId(e.target.value.length >= 1);
        // setIsSuggestionClicked(false);
    };
    const handleCallListingsAPI = async(mlsSid : string, fromDate : string, toDate : string, recLimit : string,) => {
    
        setIsLoadingCalListApi(true);

            var data = {
            mlsSid : mlsSid ? mlsSid : null,
            fromDate  : fromDate ? fromDate : null,
            toDate : toDate? toDate : null,
            recLimit : recLimit ? recLimit : null
            };
        
            await CallListingsAPIService.callListingsAPI(data)
            .then((response: any) => {
              console.log(response.data);
            //   setSearchResult(response.data);
              setIsLoadingCalListApi(false);
              togglePanelApi();
              toast.info(response.data.message);

              //Loaded from db
              setIsLoadingSearch(true);
                 CallListingsAPIService.getListingsTop1000()
                .then((response: any) => {
                    setSearchResult(response.data.data);
                    setIsLoadingSearch(false);
                    setVisibleRight(false);
                    toast.info(response.data.message);
                })
                .catch((e: Error) => {
                    setIsLoadingSearch(false);
                    toast.error('Failed to loaded data');
                    console.log(e);
                });
                //
            })
            .catch((e: Error) => {
                setIsLoadingCalListApi(false);
                toast.error('Failed to update data');
              console.log(e);
            }).finally(() => {      
                setIsLoadingCalListApi(false);
                console.log('finally');

            });        
            // await dispatch(handleSearchSource({agentId , office, address , city}));
            // saveSearchHistory("searchSource",agentId, office, address, city);

    
            
        };

        const LoadingOverlay = () => {
            return (
                <div
                    // className="map-loading-overlay"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 1000,
                    }}
                >
                    <BeatLoader size={20} color="#36d7b7" /> {/* Spinner component */}
                </div>
            );
        };

    return (
        <div>
            <LoadingBar
                color="#f11946"
                height={3}
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            {/* Content Wrapper. Contains page content */}
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                    {/* <div className="row">
                        <p className="text-bold" style={{ backgroundColor: '#F8F8F8'}}>
                        NOTICE: This tool searches the raw MLS query results so that we can verify the accuracy of our consolidated data and compare our results to other data providers. You must start the search with a CREMS agent ID, and then use one or more of the other fields to narrow the search results. The page will display a limited table of the fields, but you can download a CSV file that contains all the fields in the result. Contact support with any questions.
                        </p>
                    </div> */}
                    <div className="row mb-2">
                        <div className="col-12" > 
                            <div className="d-flex justify-content-end">
                            <div>

                                <Button className="rounded mb-1" icon="bi bi-send-fill mr-1" onClick={() => setVisibleRight(true)} >Call Listings API</Button>
                                <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)} style={{ width: '50rem' }}>
                                    <div className="col-12 mx-auto">
                                        <Panel  headerTemplate={headerPanelAPI} >
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="grid">
                                                        <div className="form-floating col-3 md:col-3 lg:col-3 border-right">
                                                            <input
                                                                type="text"
                                                                id="mlsSid"
                                                                autoComplete="off"
                                                                className="form-control"
                                                                value={mlsSid}
                                                                onChange={handleInputChangeMlsSid}
                                                                placeholder=""
                                                            />
                                                            <label htmlFor="mlsSid">MlsSid</label>
                                                        </div>

                                                        <div className="form-floating col-3 md:col-3 lg:col-3 border-right">
                                                            <input
                                                                type="date"
                                                                id="from_date"
                                                                autoComplete="off"
                                                                className="form-control"
                                                                value={formatDateToYYYYMMDD(fromDate)}
                                                                onChange={handleInputChangeFromDate}
                                                                placeholder=""
                                                            />
                                                            <label htmlFor="from_date">From Date</label>
                                                        </div>

                                                        <div className="form-floating col-3 md:col-3 lg:col-3 border-right">
                                                            <input
                                                                type="date"
                                                                id="to_date"
                                                                autoComplete="off"
                                                                className="form-control"
                                                                value={formatDateToYYYYMMDD(toDate)}
                                                                onChange={handleInputChangeToDate}
                                                                placeholder=""
                                                            />
                                                            <label htmlFor="to_date">To Date</label>
                                                        </div>

                                                        <div className="form-floating col-3 md:col-3 lg:col-3">
                                                            <input
                                                                type="text"
                                                                id="rec_limit"
                                                                autoComplete="off"
                                                                className="form-control"
                                                                value={recLimit}
                                                                onChange={handleInputChangeRecLimit}
                                                                placeholder=""
                                                            />
                                                            <label htmlFor="rec_limit">Records Limit</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mt-4">
                                                    <div className="col-md-12">
                                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                            <button
                                                                className="btn btn-primary btn-lg me-md-2 mb-2 mb-md-0"
                                                                type="button"
                                                                id="search"
                                                                name="search"
                                                                onClick={() => handleCallListingsAPI(mlsSid, fromDate, toDate, recLimit)}
                                                            >
                                                                Call API
                                                                <i className="bi bi-search"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-warning btn-lg me-md-2 mb-2 mb-md-0"
                                                                type="button"
                                                                id="clear"
                                                                name="clear"
                                                                onClick={handleClearAPI}
                                                            >
                                                                Clear
                                                                <i className="bi bi-arrow-repeat"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {isLoadingCalListApi && <LoadingOverlay />}
                                            </div>
                                        </Panel>

                                        
                                    </div>
                                </Sidebar>
                            </div>
                            </div>               
                                <div className="card">
                                    <div className="card-body">
                                        <div className="grid flex align-items-center">


                                            <div className="form-floating col-4 md:col-4 lg:col-4 border-right">
                                                <input type="text" id="agent_f_name" autoComplete="off" className="form-control"
                                                    value={officeName}
                                                    onChange={handleInputChangeOffice} placeholder="" />
                                                {isOpenSugOfnm && (<ul className="autocomplete-suggestions mr-0">
                                                    {!isLoading ? suggestionsOfficeNm[0] && (suggestionsOfficeNm.map((suggestion) => (
                                                        <li key={suggestion.value} onClick={() => handleSuggestionClickOffice(suggestion)}>
                                                            {suggestion.label}
                                                        </li>
                                                    ))) : <li>
                                                        <BeatLoader className="loading-container" size={15} color="#36d7b7" />
                                                    </li>}
                                                </ul>
                                                )}
                                                <label htmlFor="agent_f_name">Office</label>


                                            </div>

                                            <div className="form-floating col-4 md:col-4 lg:col-4 border-right">
                                                <input type="text" id="agent_f_name" autoComplete="off" className="form-control"
                                                    value={address}
                                                    onChange={handleInputChangeAddress} placeholder="" />
                                                {isOpenSugAdr && (<ul className="autocomplete-suggestions mr-0">
                                                    {!isLoading ? suggestionsAddress[0] && (suggestionsAddress.map((suggestion) => (
                                                        <li key={suggestion.value} onClick={() => handleSuggestionClickAddress(suggestion)}>
                                                            {suggestion.label}
                                                        </li>
                                                    ))) : <li>
                                                        <BeatLoader className="loading-container" size={15} color="#36d7b7" />
                                                    </li>}
                                                </ul>
                                                )}
                                                <label htmlFor="agent_f_name">Listing Address</label>


                                            </div>

                                            <div className="form-floating col-4 md:col-4 lg:col-4">
                                                <input type="text" id="agent_f_name" autoComplete="off" className="form-control"
                                                    value={city}
                                                    onChange={handleInputChangeCity} placeholder="" />
                                                {isOpenSugCity && (<ul className="autocomplete-suggestions mr-0">
                                                    {!isLoading ? suggestionsCity[0] && (suggestionsCity.map((suggestion) => (
                                                        <li key={suggestion.value} onClick={() => handleSuggestionClickCity(suggestion)}>
                                                            {suggestion.label}
                                                        </li>
                                                    ))) : <li>
                                                        <BeatLoader className="loading-container" size={15} color="#36d7b7" />
                                                    </li>}
                                                </ul>
                                                )}
                                                <label htmlFor="agent_f_name">Listing City</label>


                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col-md-12">
                                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                <button className="btn btn-primary btn-lg me-md-2 mb-2 mb-md-0" type="button" id="search" name="search"
                                                    onClick={() => handleSearch(officeName, address, city)}>
                                                    Search
                                                    <i className="bi bi-search"></i>
                                                </button>
                                                <button className="btn btn-warning btn-lg me-md-2 mb-2 mb-md-0" type="button" id="clear" name="clear"
                                                onClick={() => handleClear()}>
                                                    Clear
                                                    <i className="bi bi-arrow-repeat"></i>

                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>



                        </div>{/* /.col */}

                        {/* /.col */}
                    </div>{/* /.row */}


                    <div className="row mt-1">
                        <div className="col-12">
                            <div className="card">
                            {searchResult.length >0 && (<div>
                                <Button
                                className="float-right btn-sm mt-2 mr-2 mb-2"
                                label="Export to CSV"
                                icon="pi pi-file"
                                onClick={exportFullDataAsCSV}
                            />
                            </div>)}
                                {/* <div className="card-body"> */}
                                    { isLoadingSearch? ( <div  >
    
                                    <BeatLoader className="loading-container mt-3"size={15} color="#36d7b7" />

                                    </div>
                                    ):searchResult.length >0 && (



                                    <DataTable value={searchResult} ref={dt} paginator rows={10} sortField="dateList" sortOrder={1}>
                                        <Column field="dateList" header="Date Listing" sortable body={(rowData) => formatDate(rowData.dateList)}/>
                                        <Column field="mlsSid" header="MlsSid" sortable/>
                                        <Column field="listAgentFirstName" header="First Name" sortable/>
                                        <Column field="listAgentLastName" header="Last Name" sortable/>
                                        <Column field="listOfficeName" header="Office Name" sortable/>
                                        <Column field="listOfficeId" header="Office Id" sortable/>
                                        <Column field="statusCode" header="Listing Status" sortable/>
                                        <Column field="address" header="Listing Address" sortable/>
                                        <Column field="city" header="Listing City" sortable/>
                                        <Column field="listPrice" header="Listing Price" sortable body={(rowData) => formatPrice(rowData.listPrice)} />
                                    </DataTable>
                                    )}
                                
                                {/* </div> */}
                            </div>
                        </div>

                    </div>
                    {/*<!-- /.row (main row) -->*/}



                </div>{/* /.container-fluid */}


            </div>
        </div>

    );
};

export default SearchApiListing;