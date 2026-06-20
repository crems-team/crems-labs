import React, { useState, useMemo,useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import http from '../../http-common';
import { useKeycloak } from "@react-keycloak/web";

import SearchItem from "../../Models/SearchItemHistory";
import { toast } from 'react-toastify';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import SearchHistory from '../../Components/SearchHistory';
import { useAppDispatch } from '../../Hooks/DispatchHook';
import { resetMapState} from '../../Redux/Slices/MapSlice'
import SearchItemHistory from "../../Models/SearchItemHistory";
import { Sidebar } from 'primereact/sidebar';
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteSelectEvent } from "primereact/autocomplete";
import TeamService from "../../Services/TeamService";

import TeamInvestigationService from "../../Services/TeamInvestigation/TeamInvestigationService";
import { log } from 'node:console';




interface AutocompleteItem {
    value: string;
    label: string;
  }


/*  interface SearchItem {
  savedType : string;
  firstName: string;
  lastName: string;
  isFavorite: boolean;
  agentIdC : string;
} */

function SearchTeamInvestigation() {
    const [teamId, setTeamId] = useState<string | null>(null);
    const [name, setName] = useState('');

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
    const [visibleRight, setVisibleRight] = useState(false);
///
  const [isLoadingSuggest, setIsLoadingSuggest] = useState(false);




    // const debouncedFetchSuggestions = debounce(async () => {
    //   if (name.length >= 1 && !isSuggestionClicked) {
    //     setIsLoading(true);
    //     await LoanOfficerService.getNameLoanOfficer({term: name})
    //         .then((response: any) => {

    //           setSuggestions(response.data);
    //             setIsLoading(false);

    //         })
    //         .catch((e: Error) => {
    //             console.log(e);
    //             setIsLoading(false);

    //         })
    //   } else {
    //     setSuggestions([]);
    //   }
    // }, 1000);

    // useEffect(() => {
    //   // Call the debounced function instead of fetchSuggestions directly
    //   if (name.trim() !== '') {
    //     debouncedFetchSuggestions();
    //   } else {
    //     setSuggestions([]);
    //     setIsSuggestionClicked(false);
    //   }
  
    //   // Cleanup function to cancel debounce on component unmount
    //   return () => {
    //     debouncedFetchSuggestions.cancel();
    //   };
    // }, [name]);

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

  const saveSearchHistory = async (savedType :string, teamName: string, teamId: string) => {
    if (keycloak.tokenParsed?.sub) {
      
      const userId = keycloak.tokenParsed.sub;
      let history = JSON.parse(localStorage.getItem(userId+'-team') || '[]');
      const newSearch = {savedType, teamName, isFavorite: true };
      if (!history.some((item :SearchItemHistory)=> item.teamName === teamName && item.teamId === teamId )) {
        if (history.length >= 10) {
          //history = history.slice(1);
          history.pop();
  
        }
        //history.push(newSearch);
        history.unshift(newSearch);          

        localStorage.setItem(userId+'-team', JSON.stringify(history));
        setSearchHistory(history);
        try { 

          await TeamInvestigationService.saveSearchHistory(userId, savedType, teamName, teamId);
          TeamInvestigationService.getSavedSearches(userId, "team")
                        .then((response: any) => {
                            setSearchHistory(response.data);
                            localStorage.setItem(userId+'-team', JSON.stringify(response.data));
                    
                    
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
        await TeamService.toggleFavorite(userId, search.idHistory, updatedSearch.isFavorite);
        setSearchHistory(prevHistory =>
          prevHistory.map(item =>
            item.idHistory === search.idHistory ? { ...item, isFavorite: !item.isFavorite } : item
          )
        );
  
        localStorage.setItem(userId+'-team', JSON.stringify(searchHistory));
        if(updatedSearch.isFavorite === false){
          toast.success(updatedSearch.teamName +' is saved in your favorite list');
        }else{
          toast.success(updatedSearch.teamName +' is deleted from your favorite list');
  
        }
  
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    }
};

const deteteNonFavorite = async () => {

  if (keycloak.tokenParsed?.sub) {
    const userId = keycloak.tokenParsed.sub;
    try {
      await TeamService.deteteNonFavorite(userId, 'team');
      fetchSavedSearches();     

    } catch (error) {
      console.error('Error detele non favorite:', error);
    }
  }
};

const fetchSavedSearches =  async() => {
  if (keycloak.tokenParsed?.sub) {
    setIsLoadingSavedSearch(true);
    const userId = keycloak.tokenParsed.sub;

      await TeamInvestigationService.getSavedSearches(userId, "team")
      .then((response: any) => {
        console.log(response.data);
        
       /*  const history = response.data;
        console.log(history);
        localStorage.setItem(userId, JSON.stringify(history));
        setSearchHistory(history); */ 
        
        setSearchHistory(response.data);
        localStorage.setItem(userId+'-team', JSON.stringify(response.data));
        setIsLoadingSavedSearch(false);


      })
      .catch((e: Error) => {
        setSearchHistory([]);
        console.log(e);
        
      });

 
       setIsLoadingSavedSearch(false);

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


const handleSearch = async(teamId : string) => {

  if(teamId === null){
      toast.warn('Please select a team first.');
      return;
  }
  setIsLoadingSearchAgent(true);
    var data = {
        teamId: teamId
      };

      await TeamInvestigationService.getAgentsByTeamId(data)
      .then((response: any) => {
        setDataAgent(response.data);        
        saveSearchHistory("team", name,teamId);
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
    setTeamId(null);
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
    // navigate(`/loanOfficerProdReport/${id}`);
  };
  const redirectToTeamGraph = (teamId : number) => {
    setVisibleRight(false);

    navigate(`/teamInvestGraph/${teamId}`);
  };

///
  const onAutoComplete = (e: { query: string }) => {
    setIsSuggestionClicked(false);
    debouncedFetch(e.query);
  };
  
  const debouncedFetch = useMemo(
    () =>
      debounce((q: string) => {
        fetchSuggestions(q);
      }, 350),
    [] 
  );

  const fetchSuggestions = async (query: string) => {
    if (!query || query.trim().length < 1 || isSuggestionClicked) {
      setSuggestions([]);
      setIsLoadingSuggest(false);
      return;
    }
      try {
        setDataAgent([]);
        setIsLoadingSuggest(true);
        const resp = await TeamInvestigationService.getTeamByName({ term: query });
        console.log(resp);
        
        setSuggestions(resp.data || []);
      } catch (e) {
        setSuggestions([]);
        toast.warn("No team found with this name.");
        console.error(e);
      } finally {
        setIsLoadingSuggest(false);
      }
};
const onChange = (e: AutoCompleteChangeEvent) => {
    setName(e.value ?? "");
    if (!e.value) {
      setSuggestions([]);
      setDataAgent([]);
    }
  };

    const onSelect = (e: AutoCompleteSelectEvent) => {
      const item = e.value as AutocompleteItem;
      console.log(item);
      setName(item.label);
      setTeamId(item.value);
      setIsSuggestionClicked(true);
    };
  return (
    <div className="container mt-3 modern-page">
       
    <main>
        <div className="row align-items-start g-3">
            <div className="col-md-10">
                <div className="row">
                    <div className="col-md-12">
                        <label className="form-label fw-semibold mb-2">Team Name</label>
                        
                        <div className="flex-grow-1">
                          <AutoComplete
                            value={name}
                            suggestions={suggestions}
                            completeMethod={onAutoComplete}
                            onChange={onChange}
                            onSelect={onSelect}
                            forceSelection={false}
                            field="label"
                            placeholder="Type the first few letters of the team name..."
                            className="w-100 p-inputtext-lg modern-autocomplete"
                          />                        
                          <div className="form-text mt-2">
                            Type the first few letters of the team name, then select the correct option from the dropdown list.
                          </div>
                        </div>
                    </div>
                </div>
                <div className="row text-center" >
                    <div className="col-md-12">
                        
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card mt-3">

                        {isLoadingSearchAgent ? (
                            <div className="py-4 d-flex justify-content-center">
                            <BeatLoader size={12} />
                            </div>
                        ) : (
                            dataAgent.length > 0 && (
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="mb-0 fw-semibold ml-1">Team Results</h5>

                                
                                <Button
                                    label="View Team Graph"
                                    icon="pi pi-share-alt"
                                    severity="info"
                                    outlined
                                    className="rounded-pill p-button-sm mt-1 mr-1"
                                    onClick={() => navigate(`/teamInvestGraph/${teamId}`)}  
                                />
                                </div>

                                
                                <DataTable value={dataAgent} paginator rows={5} responsiveLayout="scroll">
                                <Column field="name" header="Agent Name" />
                                <Column field="phone" header="Agent Phone" />
                                <Column field="email  " header="Agent Email" />
                                </DataTable>
                            </>
                            )
                        )}
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <Button
                              type="button"
                              label="Search"
                              icon="pi pi-search"
                              onClick={() => handleSearch(teamId!)}
                              className="modern-action modern-search"
                            />
                            <Button
                              type="button"
                              label="Clear"
                              icon="pi pi-times"
                              severity="warning"
                              outlined
                              onClick={handleClear}
                              className="modern-action"
                            />
                        </div>
                    </div>
                </div>
            </div>


            <div className="col-md-2 ">
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
              <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)} style={{ width: '50rem' }}>
                <div className="col-12  mx-auto">
                  <SearchHistory
                    title="Team Search History"
                    isLoading={isLoadingSavedSearch}
                    searchHistory={searchHistory}
                    onSearchClick={(search: any) => redirectToTeamGraph(search.teamId)}
                    onToggleFavorite={toggleFavorite}
                    onDeteteNonFavorite={deteteNonFavorite}
                    parent="Team"
                  />


                </div>
              </Sidebar>




            </div>
              
        </div>
    </main>
    {/* <footer className="bg-light py-4 mt-5">
      <div className="container text-left">
      <strong><span style={{ textDecoration: 'underline'}}>SYSTEM PURPOSE:</span> The Agent Production Reporting (APR) system’s purpose is to provide the most accurate summary of a Real Estate Agent’s sales productivity over the past 24 months. It is designed for industry professionals (such as Title and Mortgage, etc.) who market their services to agents and want to confirm the volume of an agent’s productivity (aka Sales).</strong>
      </div>
    </footer> */}
    </div>
  );
};

export default SearchTeamInvestigation;
