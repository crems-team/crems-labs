import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useMapContext } from '../Components/Map/MapContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import GeoAreaService from "../Services/GeoAreaService";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { setMarkers, addMarker } from '../Redux/Slices/MapSlice';


interface CremsTableProps {
    displayAreaMap : () => void;
    nbrMonth : number;
    // areaReportRendred: (newBoolean: boolean) => void;

  
  }


  const CremsTable: React.FC<CremsTableProps> = ({ displayAreaMap,nbrMonth}) => {
//   const { transactions,addMarker,getMapInstance ,zoomToLocation,setMarkers} = useMapContext();
  //const { zoomToLocation, getMapInstance, markers, addMarker, setMarkers, setTransactions } = useMapContext();
  const {   getMapInstance,zoomToLocation } = useMapContext();
  const [listPositions, setListPositions,] = useState<Array<any>>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const transactions = useSelector((state: RootState) => state.map.transactions);


  const handleClickArea = (rowData: any) => {
    displayAreaMap(); // Call the first method
    fetchMarkers(rowData);   // Call the second method
  };

  const handleRedirectToApr = (rowData: any) => {
    navigate(`/AgentProdReports/${rowData.agentId}`);

  };

  const buttons = (rowData: any) => {
    return (
    <div style={{ display: 'flex',  gap: '1rem' }}>
        <Button label="Area" icon="bi bi-globe-americas" className="btn btn-success" onClick={() => handleClickArea(rowData)} />
        <Button label="Reports" icon="bi bi-bar-chart-line-fill" className="btn btn-success" onClick={() => handleRedirectToApr(rowData)}/>
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
    }
  }, [listPositions, dispatch]);

     
      const fetchMarkers = async (rowData : any) => {
        dispatch(setMarkers([]));

        //areaReportRendred(true);
        const map = getMapInstance();

             console.log(rowData.agentId);
             console.log(nbrMonth);
            await GeoAreaService.fetchTransactionsGeoByAgent(rowData.agentId,nbrMonth)
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

  return (
    <div>
    {transactions[0]?
    <DataTable value={transactions} paginator rows={10} sortField="total" sortOrder={-1}  rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '20rem' }}>
     
      <Column field="agentfirstname" header="First Name" sortable></Column>
      <Column field="agentlastname" header="Last Name" sortable></Column>
      <Column field="listings" header="Listings" sortable></Column>
      <Column field="selling" header="Selling" sortable></Column>
      <Column field="total" header="Total" sortable></Column>
      <Column field="zipcode" header="Zip" sortable ></Column>
      <Column body={buttons} />
    
 
    </DataTable>
    :"No results found"
    }
    </div>
  );
};

export default CremsTable;
