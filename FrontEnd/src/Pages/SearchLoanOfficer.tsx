import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import LoanOfficerService from "../Services/LoanOfficerService";
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
import SearchItemHistory from "../Models/SearchItemHistory";








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

function SearchLoanOfficer() {
    const [name, setName] = useState('');
    const [officerId, setOfficerId] = useState('');

    const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);
    //const [dataAgent, setDataAgent] = useState<AgentModel[]>([]);
    const [dataAgent, setDataAgent] = useState<Array<any>>([]);
    const navigate = useNavigate();
    const { keycloak, initialized } = useKeycloak();
    //const [searchHistory, setSearchHistory] = useState<Array<{firstName: string, lastName: string}>>([]);
    const [searchHistory, setSearchHistory] = useState<Array<SearchItem>>([]);
    const [isLoadingSavedSearch, setIsLoadingSavedSearch] = useState(Boolean);
    const [isLoadingSearchAgent, setIsLoadingSearchAgent] = useState(Boolean);
    const dispatch = useAppDispatch();




    const debouncedFetchSuggestions = debounce(async () => {
      if (name.length >= 1 && !isSuggestionClicked) {
        setIsLoading(true);
        await LoanOfficerService.getNameLoanOfficer({term: name})
            .then((response: any) => {

              setSuggestions(response.data);
                setIsLoading(false);

            })
            .catch((e: Error) => {
                console.log(e);
                setIsLoading(false);

            })
      } else {
        setSuggestions([]);
      }
    }, 1000);

    useEffect(() => {
      // Call the debounced function instead of fetchSuggestions directly
      if (name.trim() !== '') {
        debouncedFetchSuggestions();
      } else {
        setSuggestions([]);
        setIsSuggestionClicked(false);
      }
  
      // Cleanup function to cancel debounce on component unmount
      return () => {
        debouncedFetchSuggestions.cancel();
      };
    }, [name]);

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
    setName(e.target.value);
    setIsOpen(e.target.value.length >= 1);
    setIsSuggestionClicked(false);
  };

  const handleSuggestionClick = (suggestion: AutocompleteItem) => {
    setName(suggestion.label);
    setOfficerId(suggestion.value.toString());
    setSuggestions([]);
    setIsOpen(false);
    setIsSuggestionClicked(true);
  };
  

  const saveSearchHistory = async (savedType :string, officerId: string, officerName: string) => {
    if (keycloak.tokenParsed?.sub) {
      
      const userId = keycloak.tokenParsed.sub;
      let history = JSON.parse(localStorage.getItem(userId+'-loanOfficer') || '[]');
      console.log(history);
      const newSearch = {savedType, officerId,officerName, isFavorite: true };
      if (!history.some((item :SearchItemHistory)=> item.officerId === officerId && item.officerName === officerName)) {
        if (history.length >= 10) {
          //history = history.slice(1);
          history.pop();
  
        }
        //history.push(newSearch);
        history.unshift(newSearch);          

        localStorage.setItem(userId+'-loanOfficer', JSON.stringify(history));
        setSearchHistory(history);
        try { 
          
          await LoanOfficerService.saveSearchHistory(userId, savedType, officerId, officerName);
          LoanOfficerService.getSavedSearches(userId, "loanOfficer")
                        .then((response: any) => {
                            setSearchHistory(response.data);
                            localStorage.setItem(userId+'-loanOfficer', JSON.stringify(response.data));
                    
                    
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

  const toggleFavorite = async (search : SearchItemHistory,event: CheckboxChangeEvent) => {
    event.preventDefault();
  
    if (keycloak.tokenParsed?.sub) {
      const userId = keycloak.tokenParsed.sub;
      const updatedSearch = { ...search, isFavorite: !search.isFavorite };
      console.log(updatedSearch);
      try {
        await LoanOfficerService.toggleFavorite(userId, search.idHistory, updatedSearch.isFavorite);
        setSearchHistory(prevHistory =>
          prevHistory.map(item =>
            item.idHistory === search.idHistory ? { ...item, isFavorite: !item.isFavorite } : item
          )
        );
  
        localStorage.setItem(userId+'-loanOfficer', JSON.stringify(searchHistory));
        if(updatedSearch.isFavorite === false){
          toast.success(updatedSearch.officerName +' is saved in your favorite list');
        }else{
          toast.success(updatedSearch.officerName +' is deleted from your favorite list');
  
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

      await LoanOfficerService.getSavedSearches(userId, "loanOfficer")
      .then((response: any) => {
        
       /*  const history = response.data;
        console.log(history);
        localStorage.setItem(userId, JSON.stringify(history));
        setSearchHistory(history); */ 
        
        setSearchHistory(response.data);
        console.log(response.data);
        localStorage.setItem(userId+'-loanOfficer', JSON.stringify(response.data));
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


const handleSearch = async(name : string) => {
  setIsLoadingSearchAgent(true);
    var data = {
        name: name
      };

      await LoanOfficerService.getAgentByName(data)
      .then((response: any) => {
        setDataAgent(response.data);
        console.log(response.data[0]);
        console.log(officerId);
        console.log(name);
        saveSearchHistory("loanOfficer",officerId, name);
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
    setName('');

  }


const buttonDataTable = (rowData : any) => {
  return(
  <div style={{ display: 'flex',  gap: '1rem' }}>
        <Button label="LO Report" icon="bi bi-bar-chart-line-fill" className="btn btn-success" onClick={() => redirectToLO(rowData.officerNmlsId)} />

    </div>
  );
  };

  const redirectToLO = (id : number) => {
    navigate(`/loanOfficerProdReport/${id}`);
  };
  const redirectSaveToApr = (id : string) => {
    navigate(`/loanOfficerProdReport/${id}`);
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
                            <input type="text" id="agent_l_name" autoComplete="off" className="form-control" value={name}
                            onChange={handleInputChange} placeholder="Loan Officer Name" required/>
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
                            <label htmlFor="agent_l_name">Loan Officer Name</label>
                            
                            <div className="invalid-feedback">Please provide a valid last name.</div>
                            <span className="form-text">Type the first few letters of the agent’s last name, then select the correct choice from the drop-down list.</span>
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
                          
                        

                        <DataTable value={dataAgent} paginator rows={5}>
                        <Column body={buttonDataTable} />
                            <Column field="officerNmlsId" header="officer Nmls Id" />
                            <Column field="officerName" header="officer Name" />
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
                            onClick={() => handleSearch(name)}>
                                Search
                                <i className="bi bi-search"></i>
                            </button>
                            <button className="btn btn-warning btn-lg me-md-2 mb-2 mb-md-0"  type="button" id="clear" name="clear"
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
                title="LO Search History"
                isLoading={isLoadingSavedSearch}
                searchHistory={searchHistory}
                onSearchClick={(search : any) => redirectSaveToApr(search.officerId)}
                onToggleFavorite={toggleFavorite}
                parent="LoanOfficer"
              />


              </div>
              
        </div>
    </form>
    </main>
    {/* <footer className="bg-light py-4 mt-5">
      <div className="container text-left">
      <strong><span style={{ textDecoration: 'underline'}}>SYSTEM PURPOSE:</span> The Agent Production Reporting (APR) system’s purpose is to provide the most accurate summary of a Real Estate Agent’s sales productivity over the past 24 months. It is designed for industry professionals (such as Title and Mortgage, etc.) who market their services to agents and want to confirm the volume of an agent’s productivity (aka Sales).</strong>
      </div>
    </footer> */}
    </div>
  );
};

export default SearchLoanOfficer;
