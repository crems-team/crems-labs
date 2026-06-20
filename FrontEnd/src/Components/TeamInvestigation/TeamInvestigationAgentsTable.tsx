import React, { useState,useEffect } from 'react';
import TeamInvestigationService from "../../Services/TeamInvestigation/TeamInvestigationService";
import TeamInvestigationAgents from '../../Models/TeamInvestigation/TeamInvestigationAgents';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { useAppDispatch } from '../../Hooks/DispatchHook';
import {setFromTeamInvestigation,setLastTeamId} from '../../Redux/Slices/TeamInvestigationSlice';
import {pushBackTarget} from '../../Redux/Slices/navigationSlice';
import {  setAgentFilters} from '../../Redux/Slices/AreaAgentSlice';




interface ComponentProps {
    id: string,
    filterCriteria : any
  }


const TeamInvestigationAgentsTable : React.FC<ComponentProps> = ({ id,  filterCriteria}) => {


    const [dataTeam, setDataTeam] = useState<Array<TeamInvestigationAgents>>([]);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(Boolean);
    const dispatch = useAppDispatch();
    const agentFilters = useSelector((state: RootState) => state.areaAgent.agentFilters);







    useEffect(() => {
        if (id) {
            dispatch(setLastTeamId(id));
         }
    
            const fetchData=()=>{
                setIsLoading(true);
                TeamInvestigationService.getAgentTeamTable({teamId :id},filterCriteria)
                .then((response: any) => {

                    if(response.data){
                        console.log(response.data);
                        
                        setDataTeam(response.data);
                        setIsLoading(false);

                    }                 
                })
                .catch((e: Error) => {
                    setIsLoading(false);
                    console.log(e);
                })
                .finally(() => {      
                        setIsLoading(false);
            });                    
            }
            if(id){
                fetchData();
            }
    
    }, [id,filterCriteria]); 
      
    const handleRowSelect = (event: any) => {
        setSelectedRow(event.value.agentid);
        /* const url = `https://crems-labs.com/AgentProdReports/${event.value.agentid}`;
        window.location.href = url; */
        navigate(`/AgentProdReports/${event.value.id}`);

    };

    const handleRedirectToApr = (rowData: any) => {
        
        // dispatch(setFromTeamInvestigation(true));
        const teamId = id;
        dispatch(pushBackTarget({ type: 'team_invest',teamId  }));
        navigate(`/AgentProdReports/${rowData.agId}`);
    };
  

    const buttons = (rowData: any) => {
            if (!rowData.agId || rowData.tier === 'T0') {
                return null;
            }
    
            return (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button
                        label="Reports"
                        icon="bi bi-bar-chart-line-fill"
                        className="btn btn-primary p-button-sm"
                        onClick={() => handleRedirectToApr(rowData)}
                    />
                </div>
            );
        };

        const onAgentFilter = (e: any) => {
        dispatch(setAgentFilters(e.filters));
    }
    
        return (
            <div style={{ position: "relative", minHeight: "300px" }}>
                {isLoading && (
                    <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.85)",
                        zIndex: 20
                    }}
                    >
                    <BeatLoader size={12}  />
                    </div>
                )}

                {!isLoading && dataTeam.length > 0 && (
                    <DataTable
                    value={dataTeam}
                    paginator
                    rows={10}
                    tableStyle={{ minWidth: "20rem" }}
                    filters={agentFilters}
                    onFilter={onAgentFilter}
                    filterDisplay="row"
                    >
                    <Column body={buttons} />
                    <Column field="name" header="Agent Name" sortable filter filterPlaceholder="Search by team name"/>
                    {/* <Column field="office" header="Office" sortable /> */}
                    <Column field="countTx" header="Total" sortable />
                    <Column field="persona" header="Focus" sortable />
                    <Column field="phone" header="Phone" sortable />
                    <Column field="email" header="Email" sortable />
                    </DataTable>
                )}

                {!isLoading && dataTeam.length === 0 && (
                    <div>No data</div>
                )}
                </div>

        )
    
  };

  export default TeamInvestigationAgentsTable;