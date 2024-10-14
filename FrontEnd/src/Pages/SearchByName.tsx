import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import AgentService from "../Services/AgentService";
import AgentModel from "../Models/AgentModel";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import http from '../http-common';
import { useKeycloak } from "@react-keycloak/web";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faStar, faStarHalfAlt,faSave ,fas  } from '@fortawesome/free-solid-svg-icons';
import { fas, faR, faSave ,faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import SearchItem from "../Models/SearchItemHistory";
import { toast } from 'react-toastify';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import SearchHistory from '../Components/SearchHistory';
import { useAppDispatch } from '../Hooks/DispatchHook';
import { resetMapState} from '../Redux/Slices/MapSlice'







interface AutocompleteItem {
    value: number;
    label: string;
  }


/*  interface SearchItem {
  savedType : string;
  firstName: string;
  lastName: string;
  isFavorite: boolean;
  agentIdC : string;
} */

function SearchByName() {
    const [lastName, setLastName] = useState('');
    const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);
    //const [dataAgent, setDataAgent] = useState<AgentModel[]>([]);
    const [dataAgent, setDataAgent] = useState<Array<AgentModel>>([]);
    const navigate = useNavigate();
    const { keycloak, initialized } = useKeycloak();
    //const [searchHistory, setSearchHistory] = useState<Array<{firstName: string, lastName: string}>>([]);
    const [searchHistory, setSearchHistory] = useState<Array<SearchItem>>([]);
    const [isLoadingSavedSearch, setIsLoadingSavedSearch] = useState(Boolean);
    const [isLoadingSearchAgent, setIsLoadingSearchAgent] = useState(Boolean);
    const dispatch = useAppDispatch();




    const debouncedFetchSuggestions = debounce(async () => {
      if (lastName.length >= 3 && !isSuggestionClicked) {
        setIsLoading(true);
        try {
          const response = await http.get<AutocompleteItem[]>(`/search/lastName?term=${lastName}`);
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
      // Call the debounced function instead of fetchSuggestions directly
      if (lastName.trim() !== '') {
        debouncedFetchSuggestions();
      } else {
        setSuggestions([]);
        setIsSuggestionClicked(false);
      }
  
      // Cleanup function to cancel debounce on component unmount
      return () => {
        debouncedFetchSuggestions.cancel();
      };
    }, [lastName]);

  /* useEffect(() => {
    // Fetch autocomplete suggestions from API based on inputValue
    const fetchSuggestions = async () => {
    if  (lastName.length >= 1 && !isSuggestionClicked)  {
            setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/search/lastName?term=${lastName}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
      finally {
        setIsLoading(false);
      }
     } else {
        setSuggestions([]);
      }
    };

    if (lastName.trim() !== '') {
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setIsSuggestionClicked(false);
    }
  }, [lastName]); */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    setIsOpen(e.target.value.length >= 3);
    setIsSuggestionClicked(false);
  };

  const handleSuggestionClick = (suggestion: AutocompleteItem) => {
    setLastName(suggestion.label);
    setSuggestions([]);
    setIsOpen(false);
    setIsSuggestionClicked(true);
  };
  //For first name
  const [firstName, setFirstName] = useState('');
  const [suggestionsFn, setSuggestionsFn] = useState<AutocompleteItem[]>([]);
  const [isOpenFn, setIsOpenFn] = useState(false);



  useEffect(() => {
    // Fetch autocomplete suggestions from API based on inputValue
    const fetchSuggestionsfn = async () => {

    if  (lastName.length >= 1 && !isSuggestionClicked)  {
            setIsLoading(true);
      try {
        const response = await http.get<AutocompleteItem[]>(`/search/firstName?term=${firstName}&lastName=${lastName}`);
        const data = response.data;
        setSuggestionsFn(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
      finally {
        setIsLoading(false);
      }
     } else {
        setSuggestionsFn([]);
      }
    };

    if (firstName.trim() !== '') {
        fetchSuggestionsfn();
    } else {
      setSuggestions([]);
    }
  }, [firstName]);

  const handleInputChangeFn = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(ev.target.value);
    setIsOpenFn(ev.target.value.length >= 1);
    setIsSuggestionClicked(false);

  };

  const handleSuggestionClickFn = (suggestion: AutocompleteItem) => {
    setFirstName(suggestion.label);
    setSuggestionsFn([]);
    setIsOpenFn(false);
    setIsSuggestionClicked(true);

  };

  /* const saveSearchHistory = (firstName: string, lastName: string) => {
    if (keycloak.tokenParsed?.sub) {
        const userId = keycloak.tokenParsed.sub;
        var searchHistory = JSON.parse(localStorage.getItem(userId) || '[]');
        const newSearch = { firstName, lastName };

        // Check if the search already exists
        const isDuplicate = searchHistory.some(
            (item: { firstName: string; lastName: string }) =>
                item.firstName === firstName && item.lastName === lastName
        );

        if (!isDuplicate) {
          if (searchHistory.length >= 10) {
            searchHistory = searchHistory.slice(1); // Remove the oldest search if history length exceeds 10
          }
            searchHistory.push(newSearch);
            localStorage.setItem(userId, JSON.stringify(searchHistory));
        }
    }
}; */

const saveSearchHistory = async (savedType :string, firstName: string, lastName: string, agentIdC : string) => {
  if (keycloak.tokenParsed?.sub) {
    const userId = keycloak.tokenParsed.sub;
    let history = JSON.parse(localStorage.getItem(userId+'-agent') || '[]');
    const newSearch = {savedType, firstName, lastName, isFavorite: true, agentIdC };
    if (!history.some((item :SearchItem)=> item.firstName === firstName && item.lastName === lastName)) {
      if (history.length >= 10) {
        //history = history.slice(1);
        history.pop();

      }
      //history.push(newSearch);
      history.unshift(newSearch);

      localStorage.setItem(userId+'-agent', JSON.stringify(history));
      setSearchHistory(history);
      try {
        await AgentService.saveSearchHistory(userId, savedType,firstName, lastName ,agentIdC);
      } catch (error) {
        console.error('Error saving search history:', error);
      }
    }
  }
};

const toggleFavorite = async (search : SearchItem,event: CheckboxChangeEvent) => {
  event.preventDefault();

  if (keycloak.tokenParsed?.sub) {
    const userId = keycloak.tokenParsed.sub;
    const updatedSearch = { ...search, isFavorite: !search.isFavorite };
    try {
      await AgentService.toggleFavorite(userId, search.firstName, search.lastName, updatedSearch.isFavorite);
      setSearchHistory(prevHistory =>
        prevHistory.map(item =>
          item.firstName === search.firstName && item.lastName === search.lastName ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );
      localStorage.setItem(userId+'-agent', JSON.stringify(searchHistory));
      if(updatedSearch.isFavorite === false){
        toast.success(updatedSearch.firstName +' '+ updatedSearch.lastName+' is saved in your favorite list');
      }else{
        toast.success(updatedSearch.firstName +' '+ updatedSearch.lastName+' is deleted from your favorite list');

      }

    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }
};

const fetchSavedSearches =  async() => {
  if (keycloak.tokenParsed?.sub) {
    setIsLoadingSavedSearch(true);
    const userId = keycloak.tokenParsed.sub;

      await AgentService.getSavedSearches(userId, "agent")
      .then((response: any) => {
        
       /*  const history = response.data;
        console.log(history);
        localStorage.setItem(userId, JSON.stringify(history));
        setSearchHistory(history); */ 
        
        setSearchHistory(response.data);
        localStorage.setItem(userId+'-agent', JSON.stringify(response.data));
        setIsLoadingSavedSearch(false);


      })
      .catch((e: Error) => {
        console.log(e);
      });

 
   
  }
};




/* useEffect(() => {
  if (keycloak.tokenParsed?.sub) { */
      /* const userId = keycloak.tokenParsed.sub;
      const storedHistory = JSON.parse(localStorage.getItem(userId) || '[]');
      setSearchHistory(storedHistory); */
      /* const userId = keycloak.tokenParsed.sub;

      AgentService.getSavedSearches(userId)
      .then((response: any) => { */
        
       /*  const history = response.data;
        console.log(history);
        localStorage.setItem(userId, JSON.stringify(history));
        setSearchHistory(history); */ 
        
        /* setSearchHistory(response.data);
        localStorage.setItem(userId, JSON.stringify(response.data));
          console.log(response.data);

      })
      .catch((e: Error) => {
        console.log(e);
      });
  }
}, [dataAgent]); */

useEffect(() => {
  if (keycloak.tokenParsed?.sub) {
    dispatch(resetMapState());
    fetchSavedSearches();
  }
}, [keycloak.tokenParsed?.sub]);


const handleSearch = async(firstName : string, lastName : string) => {
  setIsLoadingSearchAgent(true);
    var data = {
        firstName: firstName,
        lastName: lastName
      };

      await AgentService.getAgent(data)
      .then((response: any) => {
        setDataAgent(response.data);
        saveSearchHistory("agent",firstName, lastName,response.data[0].agentIdC);
        setIsLoadingSearchAgent(false);
      })
      .catch((e: Error) => {
        setIsLoadingSearchAgent(false);

        console.log(e);
      });
    
      

  };

  const handleClick = ( event: React.MouseEvent<HTMLButtonElement>)=> {
    event.preventDefault();
  };

  const handleClear = () =>{
    setDataAgent([]);
    setFirstName('');
    setLastName('');

  }


const buttonDataTable = (rowData : AgentModel) => {
  return(
  <div style={{ display: 'flex',  gap: '1rem' }}>
        <Button label="Report" icon="bi bi-bar-chart-line-fill" className="btn btn-success" onClick={() => redirectToApr(rowData.agentIdC)} />
        <Button label="Teams" icon="bi bi-microsoft-teams" className="btn btn-primary" onClick={() => redirectToApr(rowData.agentIdC)} />

    </div>
  );
  };

  const redirectToApr = (id : number) => {
    navigate(`/AgentProdReports/${id}`);
  };

  const redirectSaveToApr = (id : string) => {
    navigate(`/AgentProdReports/${id}`);
  };

  

  return (
    <div className="container mt-3">
       
    <main>
      <form id="frmAction" action="" method="POST">
        <div className="row">
            <div className="col-md-8">
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-floating">
                            <input type="text" id="agent_l_name" autoComplete="off" className="form-control" value={lastName}
                            onChange={handleInputChange} placeholder="Listing Agent Last Name" required/>
                            {isOpen && (<ul className="autocomplete-suggestions">
                              { !isLoading ?suggestions[0] &&(suggestions.map((suggestion) => (
                                <li key={suggestion.value} onClick={() => handleSuggestionClick(suggestion)}>
                                    {suggestion.label}
                                </li>
                                ))):<li>   
                                  <BeatLoader className="loading-container"size={15} color="#36d7b7" />                         
                                  </li>}
                            </ul>
                            )}
                            <label htmlFor="agent_l_name">Listing Agent Last Name</label>
                            
                            <div className="invalid-feedback">Please provide a valid last name.</div>
                            <span className="form-text">Type the first few letters of the agent’s last name, then select the correct choice from the drop-down list.</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-floating">
                            <input type="text" id="agent_f_name"  autoComplete="off" className="form-control" value={firstName}
                            onChange={handleInputChangeFn} placeholder="Listing Agent First Name" required/>
                              {isOpenFn && (<ul className="autocomplete-suggestions">
                              {!isLoading ? suggestionsFn[0]&&(Array.isArray(suggestionsFn) && suggestionsFn.map((suggestionfn) => (
                                <li key={suggestionfn.value} onClick={() => handleSuggestionClickFn(suggestionfn)}>
                                    {suggestionfn.label}
                                </li>
                                ))): <li>   
                                <BeatLoader className="loading-container"size={15} color="#36d7b7" />                         
                                </li>}
                            </ul>
                            )}

                            <label htmlFor="agent_f_name" >Listing Agent First Name</label>

                            <div className="invalid-feedback">Please provide a valid first name.</div>
                            <span className="form-text">Type the first few letters of the agent’s first name, then select the correct choice from the drop-down list. The system should present only the first names which match with the last name.</span>
                        </div>
                    </div>
                </div>
                <div className="row text-center" >
                    <div className="col-md-12">
                        
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                    <div className="card">
                      { isLoadingSearchAgent? ( <div  >
 
                                    <BeatLoader className="loading-container mt-3"size={15} color="#36d7b7" />
 
                                 </div>
                        ):dataAgent.length >0 && (
                          
                                   
                        <DataTable value={dataAgent} >
                        <Column body={buttonDataTable} />
                            <Column field="agentfirstName" header="FirstName" />
                            <Column field="agentlastName" header="LastName" />
                            <Column field="agentIdC" header="CREMS ID" />
                            <Column field="officeName" header="Office Name" />
                        </DataTable>
                      )}
                    </div>
    
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn btn-primary btn-lg me-md-2 mb-2 mb-md-0" type="button" id="search" name="search"
                            onClick={() => handleSearch(firstName,lastName)}>
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
              <SearchHistory
                title="Agent Search History"
                isLoading={isLoadingSavedSearch}
                searchHistory={searchHistory}
                onSearchClick={(search : any) => redirectSaveToApr(search.agentIdC)}
                onToggleFavorite={toggleFavorite}
                parent="Agent"
              />


              </div>
              
        </div>
    </form>
    </main>
    <footer className="bg-light py-4 mt-5">
      <div className="container text-left">
      <strong><span style={{ textDecoration: 'underline'}}>SYSTEM PURPOSE:</span> The Agent Production Reporting (APR) system’s purpose is to provide the most accurate summary of a Real Estate Agent’s sales productivity over the past 24 months. It is designed for industry professionals (such as Title and Mortgage, etc.) who market their services to agents and want to confirm the volume of an agent’s productivity (aka Sales).</strong>
      </div>
    </footer>
    </div>
  );
};

export default SearchByName;
