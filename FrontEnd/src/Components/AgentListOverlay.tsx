import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AgentModel from "../Models/AgentModel";
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';


const AgentListOverlay: React.FC = () => {


    const op = useRef<OverlayPanel>(null);
    const navigate = useNavigate();
    const dataAgent = useSelector((state: RootState) => state.map.dataAgent);
    const showAgentsListButton = useSelector((state: RootState) => state.map.fromAgentSearchpage);


    const redirectToApr = (agent: AgentModel) => {
                
        op.current?.hide(); 
        
        navigate(`/AgentProdReports/${agent.agentIdC}`);
    };

   const redirectToTeamInvestigator = (agent : AgentModel) => {
   
       navigate(`/TeamInvestigator/${agent.agentIdC}`);
   };
   

    const buttonDataTable = (rowData: AgentModel) => {
        return (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button 
                    label="Report" 
                    icon="pi pi-chart-bar" 
                    className="p-button-success p-button-sm rounded" 
                    onClick={() => redirectToApr(rowData)} 
                />
                <Button 
                    label="Teams" 
                    icon="pi pi-users" 
                    className="p-button-primary p-button-sm rounded" 
                    onClick={() => redirectToTeamInvestigator(rowData)} 
                />
            </div>
        );
    };
    
    const agentCount = dataAgent ? dataAgent.length : 0;

    return (
        <>
        {showAgentsListButton && (
            <div className="mt-0">
                <Button 
                    type="button" 
                    icon="pi pi-users" 
                    label={`Open Searched Agent List (${agentCount})`} 
                    onClick={(e) => op.current?.toggle(e)} 
                    className="p-button-info"
                />

                <OverlayPanel ref={op} showCloseIcon>
                    <DataTable value={dataAgent} paginator rows={5} dataKey="agentIdC" emptyMessage="No agents found.">
                        <Column body={buttonDataTable} header="Actions" />
                        <Column field="agentIdC" header="Agent Id" sortable />
                        <Column field="agentfirstName" header="First Name" sortable />
                        <Column field="agentlastName" header="Last Name" sortable />
                        <Column field="officeName" header="Office Name" sortable />
                        <Column field="officeState" header="State" sortable />
                    </DataTable>
                </OverlayPanel>
            </div>
       )}
         </>
    );
}

export default AgentListOverlay;