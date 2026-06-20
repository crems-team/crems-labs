import React, { useState,useEffect } from 'react';
import TeamService from "../Services/TeamService";
import FirstSecondLevelTable from '../Models/FirstSecondLevelTable';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { Button } from 'primereact/button';
import { toast } from "react-toastify";



interface ComponentProps {
    name: string,
    filterCriteria : any

  }


const TeamAgentTableMock : React.FC<ComponentProps> = ({ name, filterCriteria}) => {


    const [dataTeam, setDataTeam] = useState<Array<any>>([]);
    const [filteredDataTeam, setFilteredDataTeam] = useState<Array<any>>([]);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(Boolean);







    useEffect(() => {
        // const { office,currentTab, tiers } = filterCriteria;
       
        // console.log(currentTab);
      // if one propertie is true
    //   const modeFilter = office || Object.values(tiers).some(tier => tier);
    
    //   if (modeFilter && currentTab === '1') {
                
            const fetchData=()=>{
                setIsLoading(true);
                TeamService.getAgentTeamTable({name :name})
                .then((response: any) => {

                    if(response.data){
                        console.log(response.data);
                        setDataTeam(response.data);

                    }                 
                })
                .catch((e: Error) => {
                    setIsLoading(false);
                    console.log(e);
                })
                .finally(() => setIsLoading(false));    
            }
            if(name){
                fetchData();
            }
    //   }

    //   if (!modeFilter && currentTab === '1')    {
                
    //     const fetchData=()=>{
    //         console.log(filterCriteria);
    //         TeamService.getTeamTableByFilter({id :id},filterCriteria)
    //         .then((response: any) => {
    //             if(response.data){
    //                 setDataTeam(response.data.firstLevelList);
    //             }                 
    //         })
    //         .catch((e: Error) => {
    //             console.log(e);
    //         });    
    //     }
    //     if(id){
    //         fetchData();
    //     }
    //     }

    }, [name]); 

    useEffect(() => {
  if (!dataTeam || dataTeam.length === 0) {
    setFilteredDataTeam([]);
    return;
  }

  const hiddenTiers = new Set<number>();
  if (filterCriteria.removeTier1) hiddenTiers.add(1);
  if (filterCriteria.removeTier2) hiddenTiers.add(2);
  if (filterCriteria.removeTier3) hiddenTiers.add(3);
  if (filterCriteria.removeTier4) hiddenTiers.add(4);
  if (filterCriteria.removeTier5) hiddenTiers.add(5);

  const filtered = dataTeam.filter(row => {
    // filtrer par tier si présent
    if (row.tier && hiddenTiers.has(row.tier)) {
      return false;
    }

    // filtrer admin
    if (filterCriteria.hideAdmin && row.flagAdmin === 'O') {
      return false;
    }

    // filtre onlyThisOffice si tu veux le brancher aussi
    // if (filterCriteria.onlyThisOffice && row.officeName !== selectedOfficeName) {
    //   return false;
    // }

    return true;
  });

  setFilteredDataTeam(filtered);
}, [dataTeam, filterCriteria]);
      
    const handleRowSelect = (event: any) => {
        setSelectedRow(event.value.agentid);
        /* const url = `https://crems-labs.com/AgentProdReports/${event.value.agentid}`;
        window.location.href = url; */
        navigate(`/AgentProdReports/${event.value.agentId}`);

    };
    const handleRedirectToApr = (rowData: any) => {
    if (!rowData.agentId || rowData.agentId === 'NULL') {
        toast.warn('This agent does not have an ID.', {
            position: 'top-right',
            autoClose: 5000,
        });
        return;
    }

    navigate(`/AgentProdReports/${rowData.agentId}`);
};

//     const buttons = (rowData: any) => {
//     return (
//      <div style={{ display: 'flex',  gap: '1rem' }}>
//             <Button label="Reports" icon="bi bi-bar-chart-line-fill" className="btn btn-primary p-button-sm" onClick={() => handleRedirectToApr(rowData)} />
    
//         </div>
       
//     );
//   }

    const buttons = (rowData: any) => {
        if (!rowData.agentId || rowData.agentId === 'NULL') {
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

    return (
        <div>
            {isLoading ? (
                <div>
                    <BeatLoader className="loading-container mt-5" size={15} color="#36d7b7" />
                </div>
                ) : filteredDataTeam.length > 0 ? (
                <DataTable
                    value={filteredDataTeam}
                    paginator
                    rows={10}
                    tableStyle={{ minWidth: '20rem' }}
                >
                    <Column body={buttons} />
                    <Column field="agentName" header="Agent Name" sortable />
                    <Column field="transactions" header="Transactions" sortable />
                    <Column field="role" header="Role" sortable />
                    <Column field="agentPhone" header="Agent Phone" sortable />
                    <Column field="agentEmail" header="Agent Email" sortable />
                </DataTable>
                ) : (
                <div>No data</div>
                )}

        
        </div>
    )
  };

  export default TeamAgentTableMock;