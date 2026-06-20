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
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import {setDataAgent,setFromAgentSearchpage,setAgentTeams} from '../Redux/Slices/MapSlice';
import { resetMapState } from '../Redux/Slices/MapSlice';
import { resetTeamInvestigationState } from '../Redux/Slices/TeamInvestigationSlice';

import { Sidebar } from 'primereact/sidebar';







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
    // const [dataAgent, setDataAgent] = useState<Array<AgentModel>>([]);
    const navigate = useNavigate();
    const { keycloak, initialized } = useKeycloak();
    //const [searchHistory, setSearchHistory] = useState<Array<{firstName: string, lastName: string}>>([]);
    const [searchHistory, setSearchHistory] = useState<Array<SearchItem>>([]);
    const [isLoadingSavedSearch, setIsLoadingSavedSearch] = useState(Boolean);
    const [isLoadingSearchAgent, setIsLoadingSearchAgent] = useState(Boolean);
    const dispatch = useAppDispatch();
    const [visibleRight, setVisibleRight] = useState(false);

    const [name, setName] = useState('');
    const [idAgent, setIdAgent] = useState<number>(0);
    const dataAgent = useSelector((state: RootState) => state.map.dataAgent);


    const debouncedFetchSuggestions = debounce(async () => {
      if (name.length >= 2 && !isSuggestionClicked) {
        setIsLoading(true);
        await AgentService.getAgentFullName({term: name})
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // setIsOpen(e.target.value.length >= 2);
    // setIsSuggestionClicked(false);
  };

  const handleSuggestionClick = (suggestion: AutocompleteItem) => {
    setName(suggestion.label);
    setIdAgent(suggestion.value);
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

const saveSearchHistory = async (savedType :string, fullName: string, agentIdC : string ,state : string) => {
  if (keycloak.tokenParsed?.sub) {
    const userId = keycloak.tokenParsed.sub;
    let history = JSON.parse(localStorage.getItem(userId+'-agent') || '[]');
    console.log(history);
    const newSearch = {savedType, fullName, isFavorite: true, agentIdC, state };
    if (!history.some((item :SearchItem)=> item.fullName === fullName && item.state === state)) {
      if (history.length >= 10) {
        //history = history.slice(1);
        history.pop();

      }
      //history.push(newSearch);
      history.unshift(newSearch);

      localStorage.setItem(userId+'-agent', JSON.stringify(history));
      setSearchHistory(history);
      try {
        await AgentService.saveSearchHistory(userId, savedType,fullName ,agentIdC,state);
      } catch (error) {
        console.error('Error saving search history:', error);
      }
    }
  }
};

const toggleFavorite = async (search : SearchItem,event: CheckboxChangeEvent) => {
  event.preventDefault();
  console.log(search)
  if (keycloak.tokenParsed?.sub) {
    const userId = keycloak.tokenParsed.sub;
    const updatedSearch = { ...search, isFavorite: !search.isFavorite };
    console.log(updatedSearch);
    try {
      await AgentService.toggleFavorite(search.agentIdC, updatedSearch.isFavorite);
      setSearchHistory(prevHistory =>
        prevHistory.map(item =>
          item.fullName === search.fullName && item.state === search.state ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );

      localStorage.setItem(userId+'-agent', JSON.stringify(searchHistory));
      if(updatedSearch.isFavorite === false){
        toast.success(updatedSearch.fullName+' is saved in your favorite list');
      }else{
        toast.success(updatedSearch.fullName+' is deleted from your favorite list');

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




    try {
      const savedSearches: SearchItem[] = await AgentService.getSavedSearches(userId, "agent");
  
      setSearchHistory(savedSearches);
      localStorage.setItem(userId+'-agent', JSON.stringify(savedSearches));
  
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSavedSearch(false);
    }

      // await AgentService.getSavedSearches(userId, "agent")
      // .then((response: any) => {
        
      //  /*  const history = response.data;
      //   console.log(history);
      //   localStorage.setItem(userId, JSON.stringify(history));
      //   setSearchHistory(history); */ 
        
      //   setSearchHistory(response.data);
      //   localStorage.setItem(userId+'-agent', JSON.stringify(response.data));
      //   setIsLoadingSavedSearch(false);


      // })
      // .catch((e: Error) => {
      //   setIsLoadingSavedSearch(false);

      //   console.log(e);
      // });

 
   
  }
};

  const deteteNonFavorite = async () => {

  if (keycloak.tokenParsed?.sub) {
    const userId = keycloak.tokenParsed.sub;
    try {
      await AgentService.deteteNonFavorite(userId, 'agent');
      fetchSavedSearches();     

    } catch (error) {
      console.error('Error detele non favorite:', error);
    }
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
    dispatch(resetTeamInvestigationState());
    fetchSavedSearches();
   
  }
}, [keycloak.tokenParsed?.sub]);


// const handleSearch = async() => {
//   setIsLoadingSearchAgent(true);

//       await AgentService.getAgent({term : name})
//       .then((response: any) => {
//         dispatch(setDataAgent(response.data));
//         // saveSearchHistory("agent",name,response.data[0].agentIdC,response.data[0].officeState);
//         setIsLoadingSearchAgent(false);
//         console.log(response.data);
//       })
//       .catch((e: Error) => {
//         setIsLoadingSearchAgent(false);

//         console.log(e);
//       });
    
      

//   };

const handleSearch = async () => {
  if (!name?.trim()) return;
  setIsLoadingSearchAgent(true);

  try {
    const agents: AgentModel[] = await AgentService.getAgent({ term: name.trim() });
    console.log(agents);
    dispatch(setDataAgent(agents));
    

  } catch (e) {
    console.error(e);
  } finally {
    setIsLoadingSearchAgent(false);
  }
};

  const handleClick = ( event: React.MouseEvent<HTMLButtonElement>)=> {
    event.preventDefault();
  };

  const handleClear = () =>{
    dispatch(setDataAgent([]));
    setFirstName('');
    setName('');
    setIdAgent(0);

  }


const buttonDataTable = (rowData : AgentModel) => {

  const hasTeams = rowData.teams?.some(team => team.teamId != null);
  
  return(
  <div style={{ display: 'flex',  gap: '1rem' }}>
        <Button label="Report" icon="bi bi-bar-chart-line-fill" className="btn btn-success" style={{ whiteSpace: 'nowrap' }} onClick={() => redirectToApr(rowData)} />
        <Button label="Inter. Report" icon="bi bi-microsoft-teams" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }} onClick={() => redirectToInteractionReport(rowData)} />
          
        {hasTeams && (
        <Button
          label="Teams"
          icon="bi bi-microsoft-teams"
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap' }}
          onClick={() => redirectToTeamInvestigator(rowData)}
        />
      )}

    </div>
  );
  };

  const redirectToApr = (agent : AgentModel) => {
    if(dataAgent.length > 1){
    dispatch(setFromAgentSearchpage(true));
    }
    const fullName = agent.agentfirstName + ' ' + agent.agentlastName;
    const fullNameUpperCase = fullName.toUpperCase();

    saveSearchHistory("agent",fullNameUpperCase,agent.agentIdC.toString(),agent.officeState);

    navigate(`/AgentProdReports/${agent.agentIdC}`);

  };

  const redirectSaveToApr = (id : string) => {
    setVisibleRight(false);

    navigate(`/AgentProdReports/${id}`);
  };

  const redirectToInteractionReport = (agent : AgentModel) => {

    const fullName = agent.agentfirstName + ' ' + agent.agentlastName;
    const fullNameUpperCase = fullName.toUpperCase();

    saveSearchHistory("agent",fullNameUpperCase,agent.agentIdC.toString(),agent.officeState);
    navigate(`/TeamInvestigator/${agent.agentIdC}`);
};

const redirectToTeamInvestigator = (agent: AgentModel) => {

 if (!agent.teams || agent.teams.length > 1) {

    dispatch(setFromAgentSearchpage(true));
 }
  const firstTeam = agent.teams[0];
  
  
  dispatch(setAgentTeams(agent.teams));

  const fullName = agent.agentfirstName + ' ' + agent.agentlastName;
    const fullNameUpperCase = fullName.toUpperCase();

    saveSearchHistory("agent",fullNameUpperCase,agent.agentIdC.toString(),agent.officeState);

  navigate(`/teamInvestGraph/${firstTeam.teamId}`);
};

const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  handleSearch(); 
};

return (
  <div className="container mt-3">
    <main>
      <form id="frmAction" onSubmit={handleFormSubmit}>
        <div className="row g-4">
          <div className="col-md-10">
            <div className="mb-3">
              <label htmlFor="A" className="form-label">Listing Agent Full Name</label>

              <div className="d-grid d-md-flex align-items-stretch gap-2">
                <input
                  type="text"
                  id="A"
                  autoComplete="off"
                  className="form-control form-control-lg rounded-3 flex-grow-1" 
                  value={name}
                  onChange={handleInputChange}
                  placeholder="Type the first few letters..."
                />

                <Button
                  label="Search"
                  icon="pi pi-search"
                  type="submit"
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

            <div className="row">
              <div className="col-12">
                {isLoadingSearchAgent ? (
                  <div className="mt-4 text-center">
                    <BeatLoader className="loading-container" size={15} color="#36d7b7" />
                  </div>
                ) : (
                  dataAgent.length > 0 && (
                    <div className="card mt-4">
                      <div className="card-body p-0">
                        <DataTable
                          value={dataAgent}
                          paginator
                          rows={5}
                          breakpoint="768px"
                          tableStyle={{ minWidth: '620px' }} 
                        >
                          <Column body={buttonDataTable} />
                          <Column field="agentIdC" header="Agent Id" style={{ minWidth: 110 }} />
                          <Column field="agentfirstName" header="First Name" style={{ minWidth: 140 }} />
                          <Column field="agentlastName" header="Last Name" style={{ minWidth: 140 }} />
                          <Column field="officeName" header="Office Name" style={{ minWidth: 180 }} />
                          <Column field="officeState" header="State" style={{ minWidth: 100 }} />
                        </DataTable>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>


          <div className="col-md-2">
            <div className="d-flex justify-content-md-end mb-3">
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
            </div>

            <Sidebar
              visible={visibleRight}
              position="right"
              onHide={() => setVisibleRight(false)}
              style={{ width: '85vw', maxWidth: '50rem' }} 
            >
              <div className="col-12 mx-auto">
                <SearchHistory
                  title="Agent Search History"
                  isLoading={isLoadingSavedSearch}
                  searchHistory={searchHistory}
                  onSearchClick={(search: any) => redirectSaveToApr(search.agentIdC)}
                  onToggleFavorite={toggleFavorite}
                  onDeteteNonFavorite={deteteNonFavorite}
                  parent="Agent"
                />
              </div>
            </Sidebar>
          </div>
        </div>
      </form>
    </main>

    <footer className="bg-light py-4 mt-5">
      <div className="container text-left">
        <strong>
          <span style={{ textDecoration: 'underline' }}>SYSTEM PURPOSE:</span> The Agent Production Reporting (APR) system’s purpose is to provide
          the most accurate summary of a Real Estate Agent’s sales productivity over the past 24 months. It is designed for industry professionals
          (such as Title and Mortgage, etc.) who market their services to agents and want to confirm the volume of an agent’s productivity (aka Sales).
        </strong>
      </div>
    </footer>
  </div>
);


};

export default SearchByName;
