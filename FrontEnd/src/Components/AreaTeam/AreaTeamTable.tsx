import React, { useEffect, useState } from 'react';
import { DataTable, DataTableExpandedRows, DataTableRowEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { useAppDispatch } from '../../Hooks/DispatchHook';
import { getAgentTeamTable } from '../../Redux/Slices/AreaAgentSlice';
import TeamInvestigationAgents from '../../Models/TeamInvestigation/TeamInvestigationAgents';
import TeamGeoProdResult from '../../Models/GeoAreaAgentProd/TeamGeoProdResult';
import {setFromSearchByArea} from '../../Redux/Slices/MapSlice';
import {setAreaModeDisplay, setSelectedTeam, setTeamFilters, setAgentFilters} from '../../Redux/Slices/AreaAgentSlice';
import {pushBackTarget} from '../../Redux/Slices/navigationSlice';




// interface TeamGeoProdResult {
//     teamId: number;
//     teamName: string;
//     teamSize: string;
//     agentsOnTeam: string;
//     brand: string;
//     OfficeNameBrokerage: string;
//     teamWebSite: string;
// }

const AreaTeamTable: React.FC = () => {
    const selectedLocation = useSelector((state: RootState) => state.map.selectedLocation);
    const teamGeoProdResult = useSelector((state: RootState) => state.areaAgent.teamGeoProdResult);
    const teamGeoProdResultLoading = useSelector((state: RootState) => state.areaAgent.teamGeoProdResultLoading);
    const teamAgentList = useSelector((state: RootState) => state.areaAgent.teamAgentList);
    const teamAgentListLoading = useSelector((state: RootState) => state.areaAgent.teamAgentListLoading);
    const areaModeDisplay = useSelector((state: RootState) => state.areaAgent.areaModeDisplay);
    const selectedTeam = useSelector((state: RootState) => state.areaAgent.selectedTeam);
    const teamFilters = useSelector((state: RootState) => state.areaAgent.teamFilters);
    const agentFilters = useSelector((state: RootState) => state.areaAgent.agentFilters);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onTeamFilter  = (e: any) => {
         dispatch(setTeamFilters(e.filters));
    };

    const onAgentFilter = (e: any) => {
        dispatch(setAgentFilters(e.filters));
    }

    const handleRedirectToTeamInvest = (rowData: TeamGeoProdResult) => {
        // if (!rowData.agId || rowData.tier === 'T0') return;
        dispatch(pushBackTarget({ type: 'search_area' }));
        navigate(`/teamInvestGraph/${rowData.teamId}`);
    };


    // const reportsButtonTemplate = (rowData: TeamInvestigationAgents) => {
    //     if (!rowData.agId || rowData.tier === 'T0') {
    //         return null;
    //     }

    //     return (
    //         <Button
    //             label="Reports"
    //             icon="bi bi-bar-chart-line-fill"
    //             className="btn btn-primary p-button-sm"
    //             onClick={() => handleRedirectToTeamInvest(rowData)}
    //         />
    //     );
    // };

const handleAgentsClick = (rowData: TeamGeoProdResult) => {
    
    //dispatch(setSelectedTeam(rowData));
    //dispatch(getAgentTeamTable({ teamId: rowData.teamId }));
    //dispatch(setAreaModeDisplay('agent'));
};    


const expanderBodyTemplate = (rowData: TeamGeoProdResult) => {

    return (
        <Button
            type="button"
            label="Team Investigation"
            icon='bi bi-people-fill'
            className="btn btn-primary p-button-sm "
            onClick={() => handleRedirectToTeamInvest(rowData)}
        />
    );
};

const handleBackToTeams = () => {
    dispatch(setAreaModeDisplay('team'));
};
    

    return (
        <div style={{ position: 'relative', minHeight: '300px' }}>

            {/* {areaModeDisplay === 'agent' && (
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Button
                        label="Return to teams"
                        icon="pi pi-arrow-left"
                        className="p-button-text"
                        onClick={handleBackToTeams}
                    />
                    <span style={{ fontWeight: 600 }}>
                        {'Team: '+selectedTeam?.teamName}
                    </span>
                </div>
            )} */}
             {/* Teams */}
            {areaModeDisplay === 'team' && (
                <>
                    {teamGeoProdResultLoading && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.85)',
                                zIndex: 20
                            }}
                        >
                            <BeatLoader size={12} />
                        </div>
                    )}

                    {!teamGeoProdResultLoading && teamGeoProdResult.length > 0 && (
                        <DataTable
                            value={teamGeoProdResult}
                            paginator
                            rows={10}
                            tableStyle={{ minWidth: '70rem' }}
                            emptyMessage="No teams found"
                            filters={teamFilters}
                            onFilter={onTeamFilter}
                            filterDisplay="row"
                        >
                            <Column body={expanderBodyTemplate} />
                            <Column field="teamName" header="Team Name" sortable filter filterPlaceholder="Search by team name" />
                            <Column field="teamSize" header="Team Size" sortable />
                            <Column field="agentsOnTeam" header="Agents On Team" sortable />
                            <Column field="brand" header="Brand" sortable />
                        </DataTable>
                    )}

                    {!teamGeoProdResultLoading && teamGeoProdResult.length === 0 && (
                        <div>No data</div>
                    )}
                </>
            )}
            {/* Agents of team */}
            
        </div>

    );
};

export default AreaTeamTable;