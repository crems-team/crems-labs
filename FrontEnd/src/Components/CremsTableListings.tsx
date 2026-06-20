import React,{useState,useEffect,useRef,useMemo} from 'react';
import { useNavigate } from 'react-router-dom';
import { useMapContext } from './Map/MapContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import GeoAreaService from "../Services/GeoAreaService";
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../Hooks/DispatchHook';
import { RootState } from '../Redux/Store';
import { setMarkers, addMarker ,setLoadingMarkers,setFromSearchByArea} from '../Redux/Slices/MapSlice';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteChangeEvent } from 'primereact/autocomplete';
import { setOriginalData,setDisplayedData,setSearchTermListing,setIsFiltered,setInputValue} from '../Redux/Slices/AreaAgentSlice';
import { pushBackTarget} from '../Redux/Slices/navigationSlice';
import { Dialog } from 'primereact/dialog';
import GeoAreaAgentProdService from '../Services/GeoAreaAgentProdService';
import Zip from "../Models/Zip";



interface CremsTableProps {
    displayAreaMap : () => void;
    nbrMonth : number;
    // areaReportRendred: (newBoolean: boolean) => void;

  
  }

  type Team = {
    teamId: string;
    teamName: string;
  };

  type Agent = {
    zipcode: string;

    agentId: number;

    agentfirstname: string;
    agentlastname: string;

    listings: number;  
    selling: number;   
    dna: number;      

    total: number;
    teams: Team[];
    hasTeam: boolean;
  };


  const CremsTableListings: React.FC<CremsTableProps> = ({ displayAreaMap,nbrMonth}) => {
//   const { transactions,addMarker,getMapInstance ,zoomToLocation,setMarkers} = useMapContext();
  //const { zoomToLocation, getMapInstance, markers, addMarker, setMarkers, setTransactions } = useMapContext();
  const {   getMapInstance,zoomToLocation } = useMapContext();
  // const [listPositions, setListPositions,] = useState<Array<any>>([]);
  const [listPositions, setListPositions,] = useState<Array<Zip>>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const listingsGeoProduction = useSelector((state: RootState) => state.areaAgent.listingsGeoProduction);
  const dt = useRef<DataTable<any>>(null);
  //Listings search agent
  // const [searchTermListing, setSearchTermListing] = useState('');
  const searchTermListing = useSelector((state: RootState) => state.areaAgent.searchTermListing);
  const [suggestionsListing, setSuggestionsListing] = useState<any[]>([]);
  // const [isFiltered, setIsFiltered] = useState(false);
  const isFiltered = useSelector((state: RootState) => state.areaAgent.isFiltered);
  // const displayedData = useSelector((state: RootState) => state.areaAgent.displayedData);
  // const originalData = useSelector((state: RootState) => state.areaAgent.originalData);
  const [visible, setVisible] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<Agent>();
  // const [inputValue, setInputValue] = useState('');
  const inputValue = useSelector((state: RootState) => state.areaAgent.inputValue);

  const handleClickArea = (rowData: any) => {
    displayAreaMap(); // Call the first method
    fetchMarkers(rowData);   // Call the second method
  };

  const handleRedirectToApr = (rowData: any) => {
    // dispatch(setFromSearchByArea(true));
    dispatch(pushBackTarget({ type: 'search_area' }));

    navigate(`/AgentProdReports/${rowData.agentId}`);

  };

  function handleTeamClick(team: Team) {
      dispatch(pushBackTarget({ type: 'search_area' }));
      navigate(`/teamInvestGraph/${team.teamId}`);
    }

  const buttons = (rowData: any) => {
    const hasTeams = rowData.hasTeam;
    return (
    <div style={{ display: 'flex',  gap: '1rem' }}>
        <Button label="Area" icon="bi bi-globe-americas" className="btn btn-success" onClick={() => handleClickArea(rowData)} />
        <Button label="Reports" icon="bi bi-bar-chart-line-fill" className="btn btn-primary" onClick={() => handleRedirectToApr(rowData)}/>
        {hasTeams && (
            <Button
              label="Teams"
              icon="bi bi-microsoft-teams"
              className="btn btn-primary"
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => {
                setSelectedTeams(rowData);
                setVisible(true);
              }}
            />
          )}
    </div>
    
    );
  }
  useEffect(() => {
    if (listPositions.length > 0) {
      zoomToLocation(10,[parseFloat(listPositions[0]?.lat), parseFloat(listPositions[0]?.lng)] );
      listPositions.forEach((element: any) => {
        dispatch(addMarker({
          position: [element.lat, element.lng],
          zip: element.zip,
          street: element.street,
          nbrlist: element.nbrlist,
          nbragt: element.nbragt,
          icon: null,
        }));
      });
      dispatch(setLoadingMarkers(false));

    }
  }, [listPositions, dispatch]);

     
      const fetchMarkers = async (rowData : any) => {
        dispatch(setMarkers([]));
        dispatch(setLoadingMarkers(true));

        //areaReportRendred(true);
        const map = getMapInstance();

             console.log(rowData.agentId);
             console.log(nbrMonth);
            // await GeoAreaService.fetchTransactionsGeoByAgent(rowData.agentId,nbrMonth)
            await GeoAreaAgentProdService.fetchTransactionsGeoByAgent(rowData.agentId)
                .then((response: any) => {

                    /*  const history = response.data;
                     console.log(history);
                     localStorage.setItem(userId, JSON.stringify(history));
                     setSearchHistory(history); */
                     setListPositions(response); 
                    //  areaReportRendred(false); 
                     
                })
                .catch((e: Error) => {
                    console.log(e);
                });
    };

    // const agentSuggestions = useMemo<any[]>(() => {
    //   return originalData.map(agent => ({
    //     ...agent,
    //     fullName: `${agent.agentfirstname} ${agent.agentlastname}`
    //   }));
    // }, [originalData]);

    const agentSuggestions = useMemo(() => {
      return listingsGeoProduction.map(agent => ({
        ...agent,
        fullName: `${agent.agentfirstname} ${agent.agentlastname}`
      }));
    }, [listingsGeoProduction]);

    const filteredData = useMemo(() => {
      if (!searchTermListing) return listingsGeoProduction;

      const q = searchTermListing.toLowerCase();

      return listingsGeoProduction.filter(agent =>
        `${agent.agentfirstname} ${agent.agentlastname}`
          .toLowerCase()
          .includes(q)
      );
    }, [listingsGeoProduction, searchTermListing]);
  
    // agent search function for autocomplete  listing
    const searchAgentsListings = (e: { query: string }) => {
      const query = e.query.toLowerCase();
      if (!query) {
        setSuggestionsListing([]);
        return;
      }
  
      const filtered = agentSuggestions.filter(agent => 
        agent.fullName.toLowerCase().includes(query)
      );
      
      setSuggestionsListing(filtered);
    };
  
    // const handleAgentSelect = (agent: any) => {
    //   const filteredResults = originalData.filter(
    //     item => item.agentId === agent.agentId
    //   );
    //   dispatch(setDisplayedData(filteredResults));
    //   setIsFiltered(true);
    // };

    const handleAgentSelect = (agent: any) => {
      dispatch(setSearchTermListing(`${agent.agentfirstname} ${agent.agentlastname}`));
      setIsFiltered(true);
    };
  
    // const clearSearch = () => {
    //   setSearchTermListing('');
    //   dispatch(setDisplayedData(originalData));
    //   setIsFiltered(false);
    //   setSuggestionsListing([]);
    // };

    const clearSearch = () => {
      // dispatch(setSearchTermListing(''));
      // setIsFiltered(false);
      // setSuggestionsListing([]);
      dispatch(setInputValue(''));
      dispatch(setSearchTermListing(''));
      dispatch(setIsFiltered(false));
    };

  

  return (
    <>
    {/* <div className="mt-3 mr-5 mb-2">
    <Button
        className="float-right"
        label="Export to CSV"
        icon="pi pi-file"
        onClick={() => dt.current?.exportCSV()}
      />
    </div> */}
    {listingsGeoProduction.length > 0 ?
                                                (<div className="mt-5 mb-5 ml-2 d-flex justify-content-between">
                                                    <div className=" ml-2 d-flex align-items-center gap-2">
                                                        <AutoComplete
                                                            field="fullName"
                                                            value={inputValue}
                                                            suggestions={suggestionsListing}
                                                            completeMethod={searchAgentsListings}
                                                            onChange={(e) => dispatch(setInputValue(e.value))}
                                                            onSelect={(e) => {
                                                              const fullName = `${e.value.agentfirstname} ${e.value.agentlastname}`;
                                                                dispatch(setInputValue(fullName));
                                                                dispatch(setSearchTermListing(e.value.fullName));
                                                                dispatch(setSearchTermListing(fullName));  
                                                                dispatch(setIsFiltered(true));
                                                            }}
                                                            placeholder="Search an agent..."
                                                        />
    
                                                        {isFiltered && (
                                                          <Button 
                                                            icon="pi pi-times" 
                                                            className="p-button-danger modern-history-btn  ml-2 "
                                                            onClick={clearSearch}
                                                            label="Clear"
                                                            aria-label="Clear"
                                                            type="button"
                                                            outlined
                                                            severity="info"
                                                          />
                                                         )}
                                                    </div>
                                                    <div>
                                                    <Button
                                                      className="modern-history-btn  float-right mr-3"
                                                      label="Export to CSV"
                                                      aria-label="Export to CSV"
                                                      icon="pi pi-file"
                                                      onClick={() => dt.current?.exportCSV()}
                                                      type="button"
                                                      outlined
                                                      severity="info"
                                                    />
                                                    </div>
                                                    
                                                </div>)
                                                : null}
    {/* {listingsGeoProduction.length > 0 ?
        (<div className="mt-5 mb-5 ml-2 d-flex justify-content-between">
          <div className="">
            <AutoComplete
                field="fullName"
                value={inputValue}
                suggestions={suggestionsListing}
                completeMethod={searchAgentsListings}
                onChange={(e) => dispatch(setInputValue(e.value))}
                onSelect={(e) => {
                  const fullName = `${e.value.agentfirstname} ${e.value.agentlastname}`;
                    dispatch(setInputValue(fullName));
                    dispatch(setSearchTermListing(e.value.fullName));
                    dispatch(setSearchTermListing(fullName));  
                    dispatch(setIsFiltered(true));
                }}
                placeholder="Search an agent..."
            />
            {isFiltered && (
          <Button 
            icon="pi pi-times" 
            className="search-history-btn  ml-2 p-button-danger"
            label="Clear"
            onClick={clearSearch}
          />
        )}
            </div>

   
            <Button
              className="search-history-btn  float-right mr-3"
              label="Export to CSV"
              icon="pi pi-file"
              onClick={() => dt.current?.exportCSV()}
            />
          
        </div>)
        : null} */}
    <div>
     
    {listingsGeoProduction[0]?
    <DataTable value={filteredData}  ref={dt} paginator rows={10} sortField="total" sortOrder={-1}  rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '20rem' }}>
     
      <Column body={buttons} />
      <Column field="agentfirstname" header="First Name" sortable></Column>
      <Column field="agentlastname" header="Last Name" sortable></Column>
      <Column field="listings" header="Listings" sortable></Column>
      <Column field="selling" header="Selling" sortable></Column>
      <Column field="total" header="Total" sortable></Column>
    
 
    </DataTable>
    :"No results found"
    }
    </div>

    <Dialog
          header={`${selectedTeams?.agentfirstname || ''} ${selectedTeams?.agentlastname || ''}`}
          visible={visible}
          style={{ width: '320px' }}
          onHide={() => setVisible(false)}
        >
           <ul className="list-group">
            {selectedTeams?.teams?.map((t: Team) => (
              <li
                key={t.teamId}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => handleTeamClick(t)}
              >
                <span>{t.teamName}</span>
                <i className="pi pi-arrow-right"></i>
              </li>
            ))}
          </ul>
        </Dialog>
    </>
  );
};

export default CremsTableListings;
