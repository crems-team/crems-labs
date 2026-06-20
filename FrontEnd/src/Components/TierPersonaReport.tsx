import React, { useState,useEffect } from 'react';
import AgentService from "../Services/AgentService";
import { Chart } from 'react-google-charts';
import DataPresentRep from '../Models/DataPresentRep';
import { Skeleton } from 'primereact/skeleton';


interface OtherComponentProps {
    id: string;
  }


const TierPersonaReport : React.FC<OtherComponentProps> = ({ id }) => {


    const [presentRepoData, setPresentRepoData] = useState<Array<DataPresentRep>>([]);
    const [data, setData] = useState<(any[])>([]);
    const [options, setOptions] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);






    useEffect(() => {

                
            const fetchData=()=>{

                setIsLoading(true);
                AgentService.getTotalPresent({id})
                .then((totalPresent: [{ list: number; sell: number; dna: number }]) => {
                    if(totalPresent){
                    


                        const data = [
                            ["element", "Total",{ role: "style" }],
                            ["Listing", totalPresent[0].list, "red"], 
                            ["Selling", totalPresent[0].sell, "blue"]
                            // ["Non MLS", totalPresent[0].dna, "green"]
                        ];
                        
                        
    
                        setData(data);
                        }                 
                })
                .catch((e: Error) => {
                    console.log(e);
                })
                .finally(() => {
                    setIsLoading(false);
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
            {isLoading?<div><Skeleton size="6rem"></Skeleton></div>
            :
            data[1]?(<Chart
                width={'198px'}
                height={'105px'}
                chartType="ColumnChart"
                data={data}
                options={{
                    title: "12 month total",        
                    legend: 'none',
                   
                   
                }}
                
                />)
                :'Not available'
        
}
        </div>
    )
  };

  export default TierPersonaReport;