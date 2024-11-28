import React, { useState,useEffect } from 'react';
import TeamService from "../Services/TeamService";
import FirstSecondLevelTable from '../Models/FirstSecondLevelTable';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';




interface ComponentProps {
    id: string,
    filterCriteria : any
  }


const FirstSecondLevelTeamTable : React.FC<ComponentProps> = ({ id,  filterCriteria}) => {


    const [dataTeam, setDataTeam] = useState<Array<FirstSecondLevelTable>>([]);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(Boolean);







    useEffect(() => {
        const { office,currentTab, tiers } = filterCriteria;
       
        console.log(currentTab);
      // if one propertie is true
      const modeFilter = office || Object.values(tiers).some(tier => tier);
    
    //   if (modeFilter && currentTab === '1') {
                
            const fetchData=()=>{
                setIsLoading(true);
                TeamService.getTeamTableByFilter({id :id},filterCriteria)
                .then((response: any) => {

                    if(response.data){
                        console.log(response.data.firstSecondLevelList);
                        setDataTeam(response.data.firstSecondLevelList);
                        setIsLoading(false);

                    }                 
                })
                .catch((e: Error) => {
                    setIsLoading(false);
                    console.log(e);
                });    
            }
            if(id){
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

    }, [id,filterCriteria]); 
      
    const handleRowSelect = (event: any) => {
        setSelectedRow(event.value.agentid);
        /* const url = `https://crems-labs.com/AgentProdReports/${event.value.agentid}`;
        window.location.href = url; */
        navigate(`/AgentProdReports/${event.value.id}`);

    };
    return (
        <div>
            { isLoading? ( <div  >
 
                <BeatLoader className="loading-container mt-5"size={15} color="#36d7b7" />

                </div>
                ) : dataTeam[0] ?                                                              
                          <DataTable value={dataTeam}
                          paginator
                          rows={10}                            
                          selectionMode="single"
                          selection={selectedRow}
                        //   onSelectionChange={handleRowSelect}
                           >
                              <Column field="source" header="Agent Source" sortable style={{ width: '1%' }} />
                              <Column field="target" header="Agent Target" sortable style={{ width: '1%' }}/>
                              <Column field="office" header="Office" sortable style={{ width: '1%' }} />
                              <Column field="count" header="Total" sortable style={{ width: '1%' }}/>
                              <Column field="sell" header="Sellings" sortable style={{ width: '1%' }}/>
                              <Column field="colist" header="Co-listings" sortable style={{ width: '1%' }}/>
  
                          </DataTable>
                        
                        :<div>No data</div>
            }
        
        </div>
    )
  };

  export default FirstSecondLevelTeamTable;