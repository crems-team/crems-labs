import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import OfficeService from "../Services/OfficeService";
import AgentModel from "../Models/AgentModel";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import http from '../http-common';
import AgentOfficeData from "../Models/AgentOfficeData";
import { InputText } from 'primereact/inputtext';
import SearchItemOffice from "../Models/SearchItemOffice";
import { useKeycloak } from "@react-keycloak/web";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { fas, faR, faSave ,faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { useSearch } from '../Components/Context/Context';













interface AutocompleteItem {
    value: number;
    label: string;
  }

function SearchByOffice() {
    const [city, setCity] = useState('');
    const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenOff, setIsOpenOff] = useState(false);
    const [office, setOffice] = useState('');
    const [suggestionsOff, setSuggestionsOff] = useState<AutocompleteItem[]>([]);
    //const [dataAgent, setDataAgent] = useState<Array<AgentOfficeData>>([]);
    const [officeId, setOfficeId] = useState('');
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [searchHistory, setSearchHistory] = useState<Array<SearchItemOffice>>([]);
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();
    const [isLoadingSavedSearch, setIsLoadingSavedSearch] = useState(Boolean);
    //const [isLoadingSearchOffice, setIsLoadingSearchOffice] = useState(Boolean);
    const { handleSearchAction, isLoadingSearchOffice, dataAgent,setDataAgent,setIsLoadingSearchOffice } = useSearch();

    const [filteredData, setFilteredData] = useState(dataAgent);




    const debouncedFetchSuggestions = debounce(async () => {
        if (city.length >= 2 && !isSuggestionClicked) {
            setIsLoading(true);
            try {
                const response = await http.get<AutocompleteItem[]>(`/office/getCity?term=${city}`);
                const data = response.data;
                setSuggestions(data);
              } catch (error) {
                console.error('Error fetching suggestions:', error);
              } finally {
                setIsLoading(false);
              }
        } else {
          setSuggestions([]);
        }
      }, 1000);

    useEffect(() => {
        if (city.trim() !== '') {
          debouncedFetchSuggestions();
        } else {
          setSuggestions([]);
          setIsSuggestionClicked(false);
        }
    
        // Cleanup function to cancel debounce on component unmount
        return () => {
          debouncedFetchSuggestions.cancel();
        };
    }, [city]);

    useEffect(() => {
        // Fetch autocomplete suggestions from API based on inputValue
        const fetchSuggestionsOff = async () => {
    
        if  (office.length >= 1 && !isSuggestionClicked)  {
                setIsLoading(true);
          try {
            const response = await http.get<AutocompleteItem[]>(`/office/getOfficeByCity?term=${office}&city=${city}`);
            const data = response.data;
            setSuggestionsOff(data);
          } catch (error) {
            console.error('Error fetching suggestions:', error);
          }
          finally {
            setIsLoading(false);
          }
         } else {
            setSuggestionsOff([]);
          }
        };
    
        if (office.trim() !== '') {
            fetchSuggestionsOff();
        } else {
          setSuggestions([]);
        }
      }, [office]);

      /* useEffect(() => {

                
        const fetchData=()=>{
          const data={
            id : officeId
          }
          OfficeService.getAgentsByOffice(data)
            .then((response: any) => {
                if(response.data){
                    setDataAgent(response.data);
                }                 
            })
            .catch((e: Error) => {
                console.log(e);
            });    
        }
        if(officeId){
            fetchData();
        }

      }, [officeId]); */  

      useEffect(() => {
        if (globalFilter) {
          const filtered = dataAgent.filter(item =>
            (item.agentlastName && item.agentlastName.toLowerCase().includes(globalFilter.toLowerCase())) ||
            (item.agentfirstName && item.agentfirstName.toLowerCase().includes(globalFilter.toLowerCase())) ||
            (item.agentPhone && item.agentPhone.includes(globalFilter)) ||
            (item.officeRank && item.officeRank.toString().includes(globalFilter)) ||
            (item.list && item.list.toString().includes(globalFilter)) ||
            (item.sell && item.sell.toString().includes(globalFilter))
          );
          setFilteredData(filtered);
        } else {
          setFilteredData(dataAgent);
        }
      }, [globalFilter, dataAgent]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
        setIsOpen(e.target.value.length >= 2);
        setIsSuggestionClicked(false);
      };

    const handleSuggestionClick = (suggestion: AutocompleteItem) => {
        setCity(suggestion.label);
        setSuggestions([]);
        setIsOpen(false);
        setIsSuggestionClicked(true);
      };

    const handleInputChangeOff = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setOffice(ev.target.value);
        setIsOpenOff(ev.target.value.length >= 1);
        setIsSuggestionClicked(false);
    
      };

    const handleSuggestionClickOff = (suggestion: AutocompleteItem) => {
        setOffice(suggestion.label);
        setOfficeId(suggestion.value.toString());
        setSuggestionsOff([]);
        setIsOpenOff(false);
        setIsSuggestionClicked(true);
    
      };

    const handleRowSelect = (event: any) => {
        setSelectedRow(event.value.agentid);
        //const url = `https://crems-labs.com/AgentProdReports/${event.value.agentIdC}`;
        //window.location.href = url;
        navigate(`/AgentProdReports/${event.value.agentIdC}`);
    };

    const handleSearch = () => {
      setIsLoadingSearchOffice(true);
      const data={
        id : officeId
      }
      OfficeService.getAgentsByOffice(data)
        .then((response: any) => {
            if(response.data){
                setDataAgent(response.data);
                saveSearchHistory("office",office, response.data[0].officeId);
                setIsLoadingSearchOffice(false);

            }                 
        })
        .catch((e: Error) => {
          setIsLoadingSearchOffice(false);

            console.log(e);
        });
    };

    const handleClear = () =>{
      setDataAgent([]);
      setCity('');
      setOffice('');

  
    }

    const saveSearchHistory = async (savedType :string, officeName: string, officeId: string) => {
      if (keycloak.tokenParsed?.sub) {
        const userId = keycloak.tokenParsed.sub;
        let history = JSON.parse(localStorage.getItem(userId+'-office') || '[]');
        const newSearch = {savedType, officeName, officeId, isFavorite: true };
        if (!history.some((item :SearchItemOffice)=> item.officeName === officeName && item.officeId === officeId)) {
          if (history.length >= 10) {
            //history = history.slice(1);
            history.pop();
    
          }
          //history.push(newSearch);
          history.unshift(newSearch);
    
          localStorage.setItem(userId+'-office', JSON.stringify(history));
          setSearchHistory(history);
          try {
            await OfficeService.saveSearchHistory(userId, savedType,officeName, officeId );
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
    
        await OfficeService.getSavedSearches(userId,"office")
          .then((response: any) => {
            
           /*  const history = response.data;
            console.log(history);
            localStorage.setItem(userId, JSON.stringify(history));
            setSearchHistory(history); */ 
            
            setSearchHistory(response.data);
            localStorage.setItem(userId+'-office', JSON.stringify(response.data));
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
    
    const toggleFavorite = async (search : SearchItemOffice,event: CheckboxChangeEvent) => {
      event.preventDefault();
    
      if (keycloak.tokenParsed?.sub) {
        const userId = keycloak.tokenParsed.sub;
        const updatedSearch = { ...search, isFavorite: !search.isFavorite };
        try {
          await OfficeService.toggleFavorite(userId, search.officeName, search.officeId, updatedSearch.isFavorite);
          setSearchHistory(prevHistory =>
            prevHistory.map(item =>
              item.officeName === search.officeName && item.officeId === search.officeId ? { ...item, isFavorite: !item.isFavorite } : item
            )
          );
          localStorage.setItem(userId+'-office', JSON.stringify(searchHistory));
          if(updatedSearch.isFavorite === false){
            toast.success(updatedSearch.officeName +' is saved in your favorite list');
          }else{
            toast.success(updatedSearch.officeName +' is deleted from your favorite list');
    
          }
        } catch (error) {
          console.error('Error toggling favorite:', error);
        }
      }
    };

    // const handleSearchAction = (search : SearchItemOffice) => {
    //   setIsLoadingSearchOffice(true);
    //   const data={
    //     id : search.officeId
    //   }
    //   OfficeService.getAgentsByOffice(data)
    //     .then((response: any) => {
    //         if(response.data){
    //             setDataAgent(response.data);
    //             setIsLoadingSearchOffice(false);

    //         }                 
    //     })
    //     .catch((e: Error) => {
    //       setIsLoadingSearchOffice(false);

    //         console.log(e);
    //     });
    // };

  return (
    <div className="container mt-3">
      <div className="row">
          <div>
                <a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="Find an agent’s office by first entering the first few letters of the office’s city name, select the correct city from the list.
        Second, enter the first few letters of the office name in the second field, then select the correct office from the list and click on the Search button.
        The system should display all the agents in that office, by order of most-to-least listings, or enter the desired agent’s name in the “search” box.
        Select the desired agent.">
                                    <i id="idInfoIcon" className="bi bi-info-circle" /></a>
          </div>
            <div className="col-md-8 col-sm-4">
                <div className="row">
                    <div className="col-md-12 col-sm-4">
                            <div className="form-floating mr-3 ml-3">
                                        <input type="text" id="city"  autoComplete="off" className="form-control" value={city}
                                        onChange={handleInputChange} placeholder="City Name" required/>
                                        {isOpen && (<ul className="autocomplete-suggestions">
                                      { !isLoading ?suggestions[0] &&(suggestions.map((suggestion) => (
                                        <li key={suggestion.value} onClick={() => handleSuggestionClick(suggestion)}>
                                            {suggestion.label}
                                        </li>
                                        ))):<li>   
                                          <BeatLoader className="loading-container"size={10} color="#36d7b7" />                         
                                          </li>}
                                    </ul>
                                    )}
                                

                                <label htmlFor="city" className="form-text text-muted">City Name</label>

                                <small className="form-text text-muted">Type the first few letters of the city.</small>

                            </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                            <div className="form-floating mr-3 ml-3">
                                <input type="text" id="officename"  autoComplete="off" className="form-control" value={office}
                                onChange={handleInputChangeOff} placeholder="Office Name" required/>
                                {isOpenOff && (<ul className="autocomplete-suggestions">
                                { !isLoading ?suggestionsOff[0] &&(suggestionsOff.map((suggestionOff) => (
                                <li key={suggestionOff.value} onClick={() => handleSuggestionClickOff(suggestionOff)}>
                                    {suggestionOff.label}
                                </li>
                                ))):<li>   
                                  <BeatLoader className="loading-container"size={10} color="#36d7b7" />                         
                                  </li>}
                                </ul>
                                )}

                                

                                <label htmlFor="officename" className="form-text text-muted">Office Name</label>

                                <small className="form-text text-muted mb-5">Type the first
                                            few
                                            letters of the office's.</small>

                            </div>
                    </div>
                </div>
                
                
                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn btn-primary btn-lg me-md-2 mb-2 mb-md-0" type="button" id="search" name="search"
                             onClick={() => handleSearch()}>
                                Search
                                <i className="bi bi-search"></i>
                            </button>
                            <button className="btn btn-warning btn-lg"  type="button" id="clear" name="clear"
                               onClick={() => handleClear()}>
                                Clear
                                <i className="bi bi-arrow-repeat"></i>

                            </button>
                        </div>
                    </div>
                </div>
            </div>


              <div className="col-md-4  mx-auto">
                <div className="card" >
                  <div className="card-header bg-primary text-white">
                    <span className="page-title">Office Search History</span>
                    <span className="subtitle" style={{ fontSize: '12px' }}>
                    Click the <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                              </svg> icon to save. Click the <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"></path>
                              </svg> icon to unsave.                                            
                    </span>
                  
                 </div>
                  <div className="card-body cardRecentSearch">
                        {isLoadingSavedSearch? ( <div  >
                                  <ul className=""style={{listStyleType: 'none'}}>
         
                                    <li>
                                    <BeatLoader className="loading-container mt-3"size={10} color="#36d7b7" />
                                    </li>
                              
                                 </ul> 
                                 </div>
                              ):                             
                        searchHistory.length>0?  (
                          <ul className="list-group">
                            {searchHistory.map((search, index) => (
                              <li key={index} className="list-group-item d-flex justify-content-between align-items-center" >
                                <span role="button" onClick={() => handleSearchAction(search)}>
                                  {search.officeName} 
                                  </span>
                                  <Checkbox onChange={(event) => toggleFavorite(search,event)} checked={!search.isFavorite}></Checkbox>
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
                          ):  
                        <ul className="list-group">
                                                <li  className="list-group-item d-flex justify-content-between align-items-center">
                                                No recent searches.
                                          
                                                </li>
                                </ul>

                              
                      }            
                      
                  </div>
                </div>

              </div>
              
      </div>

      <div className="row">       
        <div className="col-md-8 col-sm-4">
          { isLoadingSearchOffice? ( <div  >
 
            <BeatLoader className="loading-container mt-3"size={10} color="#36d7b7" />

            </div>
            ):dataAgent[0] ?  
                  <div style={{ height: '100%', width: '100%' ,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                              
                                                                    
                            <DataTable value={filteredData} showGridlines tableStyle={{ minWidth: '60rem' }}
                            paginator rows={5}  
                            selectionMode="single"
                            selection={selectedRow}
                            onSelectionChange={handleRowSelect}
                            >              
                                <Column field="officeRank" header="Ranking"  />
                                <Column field="agentlastName" header="Last Name" />
                                <Column field="agentfirstName" header="First Name"  />
                                <Column field="agentPhone" header="Phone"/>
                                <Column field="list" header="Listings" />
                                <Column field="sell" header="Selling"/>
    
                            </DataTable>
                          
                          
              
              </div>
              :''
            }

        </div>
        <div className="col-md-4  mx-auto">

            {isLoadingSearchOffice? ( <div  >
 
            </div>
            ): dataAgent[0] ?  
              <div className="d-flex justify-content-center mb-2">
                <InputText  value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
              </div>
              :''
            }


        </div>

      </div>



    </div>
    
  );
};

export default SearchByOffice;
