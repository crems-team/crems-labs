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
import Zip from "../Models/Zip";


interface CremsTableProps {
    displayAreaMap : () => void;
    // areaReportRendred: (newBoolean: boolean) => void;
  }


  const CremsTableAgents: React.FC<CremsTableProps> = ({ displayAreaMap}) => {
//   const { transactions,addMarker,getMapInstance ,zoomToLocation,setMarkers} = useMapContext();
  //const { zoomToLocation, getMapInstance, markers, addMarker, setMarkers, setTransactions } = useMapContext();
  const {   getMapInstance,zoomToLocation } = useMapContext();
  const [listPositions, setListPositions,] = useState<Zip[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const AgentGeoProdResult = useSelector((state: RootState) => state.map.AgentGeoProdResult);
  const dt = useRef<DataTable<any>>(null);


  const handleClickArea = (rowData: any) => {
    console.log(rowData);
    fetchMarkers(rowData);   // Call the second method
    displayAreaMap(); // Call the first method
  };

  const handleRedirectToApr = (rowData: any) => {
    dispatch(setFromSearchByArea(true));

    navigate(`/AgentProdReports/${rowData.agentId}`);

  };

  const buttons = (rowData: any) => {
    return (
    <div style={{ display: 'flex',  gap: '1rem' }}>
        <Button label="Area" icon="bi bi-globe-americas" className="btn btn-success" onClick={() => handleClickArea(rowData)} />
        <Button label="Reports" icon="bi bi-bar-chart-line-fill" className="btn btn-primary" onClick={() => handleRedirectToApr(rowData)}/>
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

          if (!response.data || response.data.length === 0) {
            dispatch(setError("No data available for this agent."));
            return; 
        }
          setListPositions(response.data);
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
      <DataTable value={AgentGeoProdResult} paginator rows={10} sortField="part_total_curr" sortOrder={-1}>
          <Column body={buttons} />
          <Column field="firstName" header="First Name" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }} />
          <Column field="lastName" header="Last Name" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>
          <Column field="officeName" header="Office Name" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>
          <Column field="tier" header="Tier" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>
          <Column field="total_global" header="12mo Sales In/Out" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>
          <Column field="agentSalesYoyInOutArea" header="A12mo YoY % In/Out" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>
          <Column field="part_total_curr" header="12mo Sales In/Only" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>
          <Column field="agentSalesYoyInArea" header="12mo YoY % In/Only" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>
          <Column field="list" header="Listing In/Out" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>
          <Column field="sell" header="Selling In/Out" sortable headerStyle={{ whiteSpace: 'nowrap', minWidth: '100px' }}/>
      </DataTable>
      :"No results found"
    }
    </div>
    </>
  );
};

export default CremsTableAgents;
