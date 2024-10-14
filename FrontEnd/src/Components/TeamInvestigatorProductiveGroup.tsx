import React, { useState,useEffect } from 'react';
import AgentService from "../Services/AgentService";
import TeamAgentsTable from '../Models/TeamAgentsTable';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';




interface ComponentProps {
    id: string,
  }


const TeamInvestigatorProductiveGroup : React.FC<ComponentProps> = ({ id }) => {


    const [dataTeam, setDataTeam] = useState<Array<TeamAgentsTable>>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(1); 
    const [totalRecords, setTotalRecords] = useState(0); 
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const navigate = useNavigate();






    useEffect(() => {

                
            const fetchData=()=>{
                AgentService.getTeamAgentsTable({id})
                .then((response: any) => {
                    if(response.data){
                        setDataTeam(response.data);
                        setTotalRecords(response.data.length);
                    }                 
                })
                .catch((e: Error) => {
                    console.log(e);
                });    
            }
            if(id){
                fetchData();
            }

    }, [id]); 
      
    const handleRowSelect = (event: any) => {
        setSelectedRow(event.value.agentid);
        /* const url = `https://crems-labs.com/AgentProdReports/${event.value.agentid}`;
        window.location.href = url; */
        navigate(`/AgentProdReports/${event.value.id}`);

    };
    return (
        <div>
            { dataTeam[0] ?                                                              
                          <DataTable value={dataTeam}
                          paginator rows={5}  
                          selectionMode="single"
                          selection={selectedRow}
                          onSelectionChange={handleRowSelect}>
                              <Column field="firstName" header="First Name" style={{ width: '1%' }} />
                              <Column field="lastName" header="Last Name" style={{ width: '1%' }}/>
                              <Column field="colist" header="Co-listings" style={{ width: '2%' }} />
                              <Column field="cosell" header="Co-sellings" style={{ width: '1%' }}/>
                              <Column field="sell" header="Sellings" style={{ width: '1%' }}/>
                              <Column field="total" header="Total" style={{ width: '1%' }}/>
  
                          </DataTable>
                        
                        :<div>loading...</div>
            }
        
        </div>
    )
  };

  export default TeamInvestigatorProductiveGroup;