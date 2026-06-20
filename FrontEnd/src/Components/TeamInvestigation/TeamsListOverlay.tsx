import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';


const TeamsListOverlay: React.FC = () => {


    const op = useRef<OverlayPanel>(null);
    const navigate = useNavigate();
    const agentTeams = useSelector((state: RootState) => state.map.agentTeams);
    const showTeamsListButton = useSelector((state: RootState) => state.map.fromAgentSearchpage);


    const redirectToTeamInvestigator = (team: any) => {
                
        op.current?.hide(); 
        
        navigate(`/teamInvestGraph/${team.teamId}`);
    };

   

    const buttonDataTable = (rowData: any) => {
        return (
            <div style={{ display: 'flex', gap: '0.5rem' }}>

                <Button 
                    label="Teams" 
                    icon="pi pi-users" 
                    className="p-button-primary p-button-sm rounded" 
                    onClick={() => redirectToTeamInvestigator(rowData)} 
                />
            </div>
        );
    };
    
    const agentCount = agentTeams ? agentTeams.length : 0;

    return (
        <>
        {showTeamsListButton &&  (
            <div className="mt-0">
                <Button 
                    type="button" 
                    icon="pi pi-users" 
                    label={`Open Searched Agent List (${agentCount})`} 
                    onClick={(e) => op.current?.toggle(e)} 
                    className="p-button-info"
                />

                <OverlayPanel ref={op} showCloseIcon>
                    <DataTable value={agentTeams} paginator rows={5} dataKey="teamId" emptyMessage="No Team found.">
                        <Column body={buttonDataTable} header="Actions" />
                        <Column field="teamName" header="Team Name"  />

                    </DataTable>
                </OverlayPanel>
            </div>
       )}
         </>
    );
}

export default TeamsListOverlay;