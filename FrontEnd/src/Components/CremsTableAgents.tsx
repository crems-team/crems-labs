import React,{useState,useEffect,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useMapContext } from './Map/MapContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import GeoAreaAgentProdService from "../Services/GeoAreaAgentProdService";
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../Hooks/DispatchHook';
import { RootState } from '../Redux/Store';
import { setMarkers, addMarker ,setLoadingMarkers,setFromSearchByArea,setError} from '../Redux/Slices/MapSlice';
import { pushBackTarget} from '../Redux/Slices/navigationSlice';
import { Dialog } from 'primereact/dialog';

import Zip from "../Models/Zip";


interface CremsTableProps {
    displayAreaMap : () => void;
    // areaReportRendred: (newBoolean: boolean) => void;
  }

type Team = {
    teamId: string;
    teamName: string;
  };

type Agent = {
  agentId: string;

  firstName: string;
  lastName: string;

  state: string;
  city: string;

  officeName: string;
  officeAddress1: string;

  total_cur: number;
  total_before: number;

  dna: number;
  list: number;
  sell: number;

  persona: string;

  part_total_curr: number;
  part_total_before: number;

  tier: string;

  agentSalesYoyInOutArea: string;  
  agentSalesYoyInArea: string;
  teams: Team[];
  hasTeam: boolean;     
};


  const CremsTableAgents: React.FC<CremsTableProps> = ({ displayAreaMap}) => {
//   const { transactions,addMarker,getMapInstance ,zoomToLocation,setMarkers} = useMapContext();
  //const { zoomToLocation, getMapInstance, markers, addMarker, setMarkers, setTransactions } = useMapContext();
  const {   getMapInstance,zoomToLocation } = useMapContext();
  const [listPositions, setListPositions,] = useState<Zip[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const AgentGeoProdResult = useSelector((state: RootState) => state.map.AgentGeoProdResult);
  const dt = useRef<DataTable<any>>(null);
  const [visible, setVisible] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<Agent>();

  const handleClickArea = (rowData: any) => {
    console.log(rowData);
    fetchMarkers(rowData);   // Call the second method
    displayAreaMap(); // Call the first method
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
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        
      }}>
        <Button 
            label="Area" 
            icon="bi bi-globe-americas" 
            className="btn btn-success p-button-sm" 
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => handleClickArea(rowData)} 
        />
        <Button 
            label="Reports" 
            icon="bi bi-bar-chart-line-fill" 
            className="btn btn-primary p-button-sm" 
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => handleRedirectToApr(rowData)}
        />

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
      console.log(listPositions);
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

     
    //   const fetchMarkers = async (rowData : any) => {
    //     dispatch(setMarkers([]));
    //     dispatch(setLoadingMarkers(true));

    //     //areaReportRendred(true);
    //     const map = getMapInstance();

    //         await GeoAreaAgentProdService.fetchTransactionsGeoByAgent(rowData.agentId)
    //             .then((response: any) => {
    //               console.log(response);
    //                 /*  const history = response.data;
    //                  console.log(history);
    //                  localStorage.setItem(userId, JSON.stringify(history));
    //                  setSearchHistory(history); */
    //                  setListPositions(response.data); 
    //                 //  areaReportRendred(false); 
                     
    //             })
    //             .catch((e: Error) => {
    //                 console.log(e);
    //                 return ;

    //             });
    // };

    const fetchMarkers = async (rowData: any) => {
      try {
          dispatch(setMarkers([]));
          dispatch(setLoadingMarkers(true));
          dispatch(setError(null));
          
          const map = getMapInstance(); 
          
          const response = await GeoAreaAgentProdService.fetchTransactionsGeoByAgent(rowData.agentId);

          if (!response || response.length === 0) {
            dispatch(setError("No data available for this agent."));
            return; 
        }
          setListPositions(response);
          dispatch(setError(null));
          
      } catch (e: any) {
        let errorMessage = "Internal server error";

        if (e.response?.status === 404) {
            errorMessage = "No data available for this agent.";
        } else if (e.response?.status === 500) {
            errorMessage = "Internal server error";
        } else if (e.message) {
            errorMessage = e.message;
        }

        console.error("Erreur API:", e);
        dispatch(setError(errorMessage));
      } finally {
          dispatch(setLoadingMarkers(false));
      }
  };
  

  
console.log(AgentGeoProdResult);

  return (
    <>
    {/* <div>
    <Button
        className="float-right"
        label="Export to CSV"
        icon="pi pi-file"
        onClick={() => dt.current?.exportCSV()}
      />
    </div> */}
    <div>
     
    {AgentGeoProdResult.length >0?
      <DataTable value={AgentGeoProdResult} paginator rows={10} sortField="part_total_curr" sortOrder={-1} >
          <Column body={buttons}  />
          <Column field="firstName" header="First" sortable headerStyle={{ 
                minWidth: '220px', 
                whiteSpace: 'nowrap',
                textAlign: 'center'
            }}
            bodyStyle={{ 
                minWidth: '220px',
                padding: '0.1rem',
                textAlign: 'center'
            }}/>
          <Column field="lastName" header="Last" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>
          <Column field="officeName" header="Office" sortable headerStyle={{ 
                minWidth: '230px', 
                whiteSpace: 'nowrap',
                textAlign: 'center'
            }}
            />
          <Column field="part_total_curr" header="Sale In Area" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>
          {/* <Column field="agentSalesYoyInOutArea" header="A12mo YoY % In/Out" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/> */}
          <Column field="total_cur" header="Sale In & Out" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>
          <Column field="tier" header="Tier" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>

          {/* <Column field="agentSalesYoyInArea" header="12mo YoY % In/Only" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/> */}
          {/* <Column field="list" header="Listing In/Out" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/> */}
          {/* <Column field="sell" header="Selling In/Out" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/> */}

      </DataTable>
      :"No results found"
    }

    <Dialog
      header={`${selectedTeams?.firstName || ''} ${selectedTeams?.lastName || ''}`}
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
    </div>
    </>
  );
};

export default CremsTableAgents;
