import React, { useState,useEffect } from 'react';
import AgentService from "../Services/AgentService";
import { Chart } from 'react-google-charts';
import DataPresentRep from '../Models/DataPresentRep';


interface OtherComponentProps {
    id: string;
  }


const TierPersonaReport : React.FC<OtherComponentProps> = ({ id }) => {


    const [presentRepoData, setPresentRepoData] = useState<Array<DataPresentRep>>([]);
    const [data, setData] = useState<(any[])>([]);
    const [options, setOptions] = useState<any>(null);






 /*    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                setLoading(true);

                AgentService.getAgentHistoData({ id })
                .then((response: any) => {
                  setMonthData(response.data);
                  setIsFetched(true);
                  //console.log(response.data);                
  
                })
                .catch((e: Error) => {
                  console.log(e);
                });
                setLoading(false);

            }
            fetchData();
        }
    }, []); */

 


    useEffect(() => {

                
            const fetchData=()=>{

                AgentService.getTotalPresent({id})
                .then((response: any) => {
                    if(response.data){
                        console.log('in response');
                        console.log(response.data);


                        const data = [
                            ["element", "Total",{ role: "style" }],
                            ["Listing", response.data[0].list, "red"], 
                            ["Selling", response.data[0].sell, "blue"], 
                            ["Non MLS", response.data[0].dna, "green"]
                        ];
                        
                        
    
                        setData(data);
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

   /*   if (loading) {
        return <div className="overlay">
        <i className="fas fa-2x fa-sync-alt"> </i>
      </div>;
      } */ 
    
    
    return (
        <div>
            {data[1]?(<Chart
        width={'198px'}
        height={'105px'}
        chartType="ColumnChart"
        data={data}
        options={{
            title: "12 month total",

            legend: 'none',
           
           
        }}
        
        />)
        :<div>Loading Chart...</div>
        
}
        </div>
    )
  };

  export default TierPersonaReport;